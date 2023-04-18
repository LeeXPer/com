namespace LUI {
	export class List extends Component implements IViewport {
		protected _contentWidth: number;
		protected _contentHeight: number;
		protected _scrollV: number;
		protected _scrollH: number;
		protected _scrollEnabled: boolean;
		protected _container: Component;
		/**垂直滚动条 */
		protected _vScroller: VScrollBar;
		/**水平滚动条 */
		protected _hScroller: HScrollBar;
		protected _dataProvider: Array<any>;
		/**数据是否被修改 */
		protected _dataChanged: boolean;
		protected _itemRenderer: any;
		protected _row: number = -1;
		protected _column: number = -1;			//_explicitColumn-1时会根据dataProvider长度改变的列数
		protected _explicitColumn: number = NaN;
		protected _explicitRow: number = NaN;
		protected _vgap: number = 0;
		protected _hgap: number = 0;
		protected _cellW: number = -1;
		protected _cellH: number = -1;
		protected _maxW: number;//单行时最大宽
		protected _maxH: number;//单列时最大高
		protected _lastItemY: number;//最后一个item的Y坐标
		protected _lastItemX: number;//最后一个item的X坐标
		/**用来保存item的数组 */
		protected _children: Array<IItemRenderer>;
		protected _selectedItem: IItemRenderer;
		protected _selectedIndex: number = -1;
		protected _scrollPolicy: number = ScrollBarPolicy.AUTO;
		protected _hScrollPolicy: number = ScrollBarPolicy.AUTO;
		protected _itemsPool: Array<IItemRenderer>;
		//延迟生成item，最终会全部生成完(数据很大时用，建议dataProvider.length>50，根据渲染内容的复杂度决定)
		protected _isLazy: boolean = false;
		//懒加载池的最大长度
		protected _lazyMaxLen: number = 50;
		//===true 只生成可视区域的item(数据较大时用，建议dataProvider.length>30)
		protected _isClipping: boolean = false;
		protected _loopCreating = false;
		/**是否可以多选，也可以取消选中 */
		protected _isMutiSelect: boolean;
		protected _renderStartIndex: number;
		protected _renderEndIndex: number;

		// 页码
		protected _pageCureent: number;
		protected _pageNum: number;

		// 上一次container容器更新时的坐标
		protected _containerUpdateX: number = 0;
		protected _containerUpdateY: number = 0;

		//显示滚动调
		protected _needScroller: boolean = false;
		/**是否拖动canDrag */
		protected _canDrag: boolean = false;
		//是否延迟拖动（需要canDrag == true）
		protected _needDelayDrag: boolean = false;
		//延迟拖动Timer
		protected _delayDragTimer: DateTimer;
		//能否双击
		protected _needDoubleClick: boolean = false;
		//延迟点击Timer
		protected _delayTapTimer: DateTimer;
		//渲染器宽不统一（单行时，cellW == -2则为true）
		protected _irregularW: boolean = false;
		//渲染器高不统一（单列时，cellH == -2则为true）
		protected _irregularH: boolean = false;
		/**行偏移量 */
		protected _rowOffX: number;

		/**列表
		 * @param p 要添加到的显示对象容器
		 * @param IItemRenderer 列表元素item
		 * @param column 列数
		 * @param row 行数
		 * @param vgap 垂直间距
		 * @param hgap 水平间距
		 * @param cellW item宽度
		 * @param cellH item高度
		 */
		public constructor(p?: egret.DisplayObjectContainer, itemRenderer: any = null, column: number = 1, row: number = -1, vgap: number = 0, hgap: number = 0, cellW: number = -1, cellH: number = -1, rowOffX: number = 0) {
			super(p);
			if (itemRenderer != null)
				this._itemRenderer = itemRenderer;
			else
				this._itemRenderer = LabelItemRenderer;
			this._explicitColumn = column;
			if (isNaN(column) || column == null) {
				this._explicitColumn = -1;
			}
			this._explicitRow = row;
			if (isNaN(row) || row == null) {
				this._explicitRow = -1;
			}
			this._rowOffX = rowOffX;
			this._vgap = vgap;
			this._hgap = hgap;
			this._cellH = cellH;
			this._cellW = cellW;
			this._irregularH = cellH == -2;
			this._irregularW = cellW == -2;
			if (this._cellW == -1 || this._cellH == -1) {
				let tmpItem: IItemRenderer = <IItemRenderer>new this._itemRenderer();
				this._cellW = tmpItem.width;
				this._cellH = tmpItem.height;
				this._itemsPool.push(tmpItem);
			}
			this.resetRowAndColNum();
		}
		protected preinitialize(): void {
			super.preinitialize();
			this.touchChildren = true;
			this._scrollV = 0;
			this._scrollH = 0;
			this._defaultWidth = 100;
			this._defaultHeight = 100;
			this._width = this._defaultWidth;
			this._height = this._defaultHeight;
		}
		protected createChildren(): void {
			super.createChildren();
			this._itemsPool = [];
			this._children = [];
			this._container = new Component(this);

			//垂直滚动条
			this._vScroller = new VScrollBar();
			this._vScroller.visible = false;
			this._vScroller.showButtons = false;
			this._vScroller.needScroller = this.needScroller;
			this._vScroller.slider.snapInterval = 5;
			this._vScroller.addEventListener(ResizeEvent.RESIZE, this.vscrollBarResizeHandler, this);

			//水平滚动条
			this._hScroller = new HScrollBar();
			this._hScroller.visible = false;
			this._hScroller.showButtons = false;
			this._hScroller.needScroller = this.needScroller;
			this._hScroller.slider.snapInterval = 5;
			this._hScroller.addEventListener(ResizeEvent.RESIZE, this.hscrollBarResizeHandler, this);
		}
		/**当其dataProvider属性被改变时会被触发 */
		protected draw(): void {
			if (this._changed) {
				this.scrollRect = new egret.Rectangle(0, 0, this._width, this._height);
				if (this._scrollPolicy != ScrollBarPolicy.OFF) {
					this.addChild(this._vScroller);
					this._vScroller.viewport = this;
					this._vScroller.height = this._height;
					this.positionVScrollBar();
				}
				else {
					if (this.contains(this._vScroller)) {
						this.removeChild(this._vScroller);
					}
				}
				if (this._hScrollPolicy != ScrollBarPolicy.OFF) {
					this.addChild(this._hScroller);
					this._hScroller.viewport = this;
					this._hScroller.width = this._width;
					this.positionHScrollBar();
				}
				else {
					if (this.contains(this._hScroller)) {
						this.removeChild(this._hScroller);
					}
				}
				this.graphics.clear();
				this.graphics.beginFill(0, 0)
				this.graphics.drawRect(0, 0, this._width, this._height);
				this.graphics.endFill();
			}
			if (this._dataChanged) {
				this._dataChanged = false;
				//如果数据被修改过，则重新绘制整个列表
				this.resetRowAndColNum();
				this.dataDraw();
				this.calContentSize();
			}else if (this._loopCreating) {
				this.dataDraw();
				this._loopCreating = false;
			}
			super.draw();
		}
		/**绘制item */
		protected dataDraw(): void {
			if (this._dataProvider != null) {
				this.calRenderIndex();
				this.reorganizeItems();
				this.calcCurrentPage();
				let count = 0;
				let tempX = 0;
				let tempY = 0;
				let tempW = 0;
				let tempH = 0;
				this._maxW = 0;
				this._maxH = 0;
				for (let i: number = this._renderStartIndex; i < this._renderEndIndex; i++) {
					let item: IItemRenderer = this.children[i];
					let tmpY = Math.floor(i / this._column) * (this._cellH + this._vgap);
					let tmpX = (i % this._column) * (this._cellW + this._hgap);
					if (item == null) {
						item = this._itemsPool.shift();
					}
					if (item == null) {
						item = <IItemRenderer>new this._itemRenderer();
						count++;
					}
					this._container.addChild(item);
					//动态宽高的Item重新渲染
					if (this._irregularW || this._irregularH)
						item.reset();
					item.data = this._dataProvider[i];
					item.itemIndex = i;
					this._children[i] = item;
					if (this._cellW != -1 && this._cellH != -1)
						item.size(this._cellW, this._cellH);
					else {
						this._cellW = item.width;
						this._cellH = item.height;
					}
					//单列/单行动态计算坐标
					if (this._irregularW || this._irregularH) {
						item.drawDirectly();
						tempW = item.width;
						tempH = item.height;
						item.move(tempX, tempY);
						if (i == this._renderEndIndex - 1) {
							this._lastItemX = tempX;
							this._lastItemY = tempY;
						}
					} else {
						tempW = this._cellW;
						tempH = this._cellH;
						// x轴偏移量
						let line = Math.floor(item.itemIndex / this._explicitRow);
						let offX = this._rowOffX == 0 ? 0 : this._rowOffX > 0 ? this._rowOffX * line : (this._explicitRow - line - 1) * Math.abs(this._rowOffX);
						item.move(tmpX + offX, tmpY);
					}
					if (this._irregularW) {
						tempX += tempW + this._hgap;
						this._maxW = tempX - this._hgap;
					}
					if (this._irregularH) {
						tempY += tempH + this._vgap;
						this._maxH = tempY - this._vgap;
					}

					this.rendererAdded(item);
					if (this._selectedIndex >= 0 && i == this._selectedIndex) {
						if (this._selectedItem) this._selectedItem.selected = false;
						this._selectedItem = item;
						item.selected = true;
					}
					if (this._isLazy && count >= this._lazyMaxLen) {
						this._loopCreating = true;
						this.invalidate();
						break;
					}
				}
			} else {
				this.reorganizeItems();
			}
		}

		protected resetRowAndColNum() {
			let dataLen = this._dataProvider != null ? this._dataProvider.length : 10;
			if (this._explicitColumn <= 0) {
				this._column = dataLen;
				this._row = this._explicitRow > 0 ? this._explicitRow : 1;
			} else if (this._explicitRow <= 0) {
				this._column = this._explicitColumn > 0 ? this._explicitColumn : 1;
				this._row = dataLen;
			} else {
				this._column = this._explicitColumn > 0 ? this._explicitColumn : 1;
				this._row = this._explicitRow > 0 ? this._explicitRow : 1;
			}
		}
		protected calRenderIndex() {
			if (this._dataProvider != null) {
				let len: number = Math.min(this._row * this._column, this._dataProvider.length);
				let startR = 0;
				let startC = 0;
				let startI = 0;
				if (this._isClipping) {
					if (this._row == 1) {
						startC = Math.floor(this._scrollH / (this._cellW + this._hgap)) - 1;
						startI = Math.max(0, startC);
					} else {
						startR = Math.floor(this._scrollV / (this._cellH + this._vgap)) - 1;
						startR = Math.max(0, startR);
						startI = startR * this._column;
					}
				}
				let endI = len;
				let endR = 0;
				let endC = 0;
				let maxY: number = this._scrollV + this.height;
				let maxX: number = this._scrollH + this.width;
				if (this._isLazy || this._isClipping) {
					if (this._row == 1) {
						endC = Math.ceil(maxX / (this._cellW + this._hgap)) + 1;
						endI = Math.min(endC, len);
					} else {
						endR = Math.ceil(maxY / (this._cellH + this._vgap)) + 1;
						endI = Math.min(endR * this._column, len);
					}
				}
				this._renderStartIndex = startI;
				this._renderEndIndex = endI;
			} else {
				this._renderStartIndex = 0;
				this._renderEndIndex = 0;
			}
		}

		protected calcCurrentPage(): void {
			if (isNaN(this.pageNum)) return;// 有设置页数，计算当前页码
			let page = 1;
			if (this._dataProvider) {
				// let st = 'scrollH:{0},scrollV:{1},width:{2},height:{3},contentWidth:{4},contentHeight:{5}';
				// Log.trace(StringUtil.substitute(st,this.scrollH,this.scrollV,this.width,this.height,this.contentWidth,this.contentHeight));

				let len: number = Math.min(this._row * this._column, this._dataProvider.length);
				let maxPage = Math.ceil(len / this.pageNum); // 最大页码
				let minPage = 1; // 最小页码
				if (this._row == 1) {
					page = Math.ceil(this.scrollH / this.width) + 1;
				} else {
					page = Math.ceil(this.scrollV / this.height) + 1;
				}

				if (page < minPage) {
					page = minPage;
				}
				if (page > maxPage) {
					page = maxPage;
				}
				// Log.trace('页码:',page);
			}
			if (this._pageCureent != page) {
				this._pageCureent = page;
				this.dispatchEventWith(ItemTapEvent.LIST_PAGE_CHANGE);
			}
		}

		protected reorganizeItems(): void {
			let childrenBack = this._children.slice();
			let backLen = childrenBack.length;
			if (this._dataProvider) {
				let len: number = Math.min(this._row * this._column, this._dataProvider.length);
				this._children = new Array(len);
				for (let i = this._renderStartIndex; i < this._renderEndIndex; i++) {
					if (i < backLen) {
						let item = childrenBack[i];
						childrenBack[i] = null;
						if (this._container.contains(item)) {
							this._container.removeChild(item);
						}
						this._children[i] = item;
					} else {
						break;
					}
				}
			} else {
				this._children = [];
			}
			for (let item of childrenBack) {
				if (item != null) {
					this.rendererRemoved(item);
					if (this._container.contains(item)) {
						this._container.removeChild(item);
					}
					item.reset();
					this._itemsPool.push(item);
				}
			}
		}

		protected calContentSize(): void {
			let maxW: number = 0;
			let maxH: number = 0;
			let len: number = this._children.length;
			maxW = this._irregularW ? this._maxW : this._column * (this._cellW + this._hgap) - this._hgap;
			maxH = this._irregularH ? this._maxH : Math.ceil(len / this._column) * (this._cellH + this._vgap) - this._vgap;
			let tmpContentW: number = maxW + this._margin.right + this._margin.left;
			let tmpContentH: number = maxH + this._margin.bottom + this._margin.top;
			if (tmpContentH != this._contentHeight) {
				this._contentHeight = tmpContentH;
				if (this._scrollPolicy != ScrollBarPolicy.OFF){
					this._vScroller.resetViewPort();
					let maxY = Math.max(0, tmpContentH - this.height);
					if (this.scrollV > maxY) 
						this.scrollV = maxY;				
				}
			}
			if (tmpContentW != this._contentWidth) {
				this._contentWidth = tmpContentW;
				if (this._hScrollPolicy != ScrollBarPolicy.OFF){
					this._hScroller.resetViewPort();
					let maxX = Math.max(0, tmpContentW - this.width);
					if (this.scrollH > maxX) 
						this.scrollH = maxX;
				}
			}
		}
		protected rendererAdded(renderer: IItemRenderer): void {
			renderer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRendererTouchBegin, this);
			renderer.addEventListener(egret.TouchEvent.TOUCH_END, this.onRendererTouchEnd, this);
			renderer.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onRendererTouchCancle, this);
		}
		protected rendererRemoved(renderer: IItemRenderer): void {
			renderer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRendererTouchBegin, this);
			renderer.removeEventListener(egret.TouchEvent.TOUCH_END, this.onRendererTouchEnd, this);
			renderer.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onRendererTouchCancle, this);
		}

		private _touchCancel: boolean;
		private _touchDownItemRenderer: IItemRenderer;
		protected onRendererTouchBegin(event: egret.TouchEvent): void {
			if (event.$isDefaultPrevented)
				return;
			this._touchCancel = false;
			this._touchDownItemRenderer = <IItemRenderer>(event.$currentTarget);
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
			//拖拽处理
			if (this._canDrag) {
				ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_DOWN, this._touchDownItemRenderer, event);
				if (this._needDelayDrag) {
					if (!this._delayDragTimer)
						this._delayDragTimer = new DateTimer(200, 1);
					if (!this._delayDragTimer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE))
						this._delayDragTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.delayDragTimerHandler, this);
					this._delayDragTimer.reset();
					this._delayDragTimer.start();
				}
			}
		}
		protected delayDragTimerHandler(evt: egret.TimerEvent): void {
			if (this._delayDragTimer && !this._touchCancel) {
				this._delayDragTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.delayDragTimerHandler, this);
				ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_DELAY_DRAG, this._touchDownItemRenderer);
				this._vScroller.removeAllLisenter();
				this._hScroller.removeAllLisenter();
			}
		}
		protected onRendererTouchCancle(event: egret.TouchEvent): void {
			this._touchCancel = true;
			this.clearTouchDown();
			if (this.$stage) {
				this.$stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
			}
		}
		protected onRendererTouchEnd(event: egret.TouchEvent): void {
			let itemRenderer = <IItemRenderer>(event.$currentTarget);
			let touchDownItemRenderer = this._touchDownItemRenderer;
			if (this._canDrag) {
				ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_UP, itemRenderer, event);
			}
			if (itemRenderer != touchDownItemRenderer)
				return;
			if (!this._touchCancel) {
				if (this._selectedItem != this._touchDownItemRenderer || touchDownItemRenderer.itemIndex != this._selectedIndex) {
					if (!this._isMutiSelect) {
						if (this._selectedItem != null)
							this._selectedItem.selected = false;
					}
					this._selectedItem = this._touchDownItemRenderer;
					if (!this._isMutiSelect)
						this._selectedItem.selected = true;
					else
						this._selectedItem.selected = !this._selectedItem.selected;
					this._selectedIndex = this._children.indexOf(this._selectedItem);
					this.checkClickEvent();
				}
				else if (this._selectedItem && this._isMutiSelect) {
					this._selectedItem.selected = !this._selectedItem.selected;
					this.checkClickEvent();
				}
			}
			this._touchCancel = false;
		}
		private checkClickEvent(): void {
			if (!this._needDoubleClick) {
				ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_TAP, this._touchDownItemRenderer);
			} else {
				if (!this._delayTapTimer)
					this._delayTapTimer = new DateTimer(300, 1);
				if (!this._delayTapTimer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE))
					this._delayTapTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.delayTapTimerHandler, this);
				if (this._delayTapTimer.running) {
					ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_DOUBLECLICK, this._touchDownItemRenderer);
					this._touchDownItemRenderer = null;
					this._delayTapTimer.stop();
					this._delayTapTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.delayTapTimerHandler, this);
					return;
				}
				this._delayTapTimer.reset();
				this._delayTapTimer.start();
			}
		}
		private delayTapTimerHandler(evt: egret.TimerEvent) {
			this._delayTapTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.delayTapTimerHandler, this);
			ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_TAP, this._touchDownItemRenderer);
			if (!this._delayDragTimer || !this._delayDragTimer.running)
				this._touchDownItemRenderer = null;
		}
		private stage_touchEndHandler(event: egret.Event): void {
			let stage = <egret.Stage>event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
			this.clearTouchDown();
			if (this._needDelayDrag) {
				this._vScroller.recoverAllLisenters();
				this._hScroller.recoverAllLisenters();
			}
		}
		private clearTouchDown(): void {
			if (!this._needDoubleClick)
				this._touchDownItemRenderer = null;
			if (this._delayDragTimer) {
				this._delayDragTimer.stop();
				if (this._delayDragTimer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE))
					this._delayDragTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.delayDragTimerHandler, this);
			}
		}
		private vscrollBarResizeHandler(evt: ResizeEvent): void {
			this.positionVScrollBar();
		}
		private hscrollBarResizeHandler(evt: ResizeEvent): void {
			this.positionHScrollBar();
		}
		protected positionVScrollBar(): void {
			if (this._vScroller != null)
				this._vScroller.move(this._width - this._vScroller.width, 0);
		}
		protected positionHScrollBar(): void {
			if (this._hScroller != null)
				this._hScroller.move(0, this.height - this._hScroller.height);
		}
		protected initialize(): void {
			super.initialize();
		}
		public set contentWidth(value: number) {
			this._contentWidth = value;
		}
		public get contentWidth(): number {
			return this._contentWidth;
		}

		public set contentHeight(value: number) {
			if (this._contentHeight != value) {
				this._contentHeight = value;
				if (this._vScroller)
					this._vScroller.resetViewPort();
			}
		}
		public get contentHeight(): number {
			return this._contentHeight;
		}

		public get scrollV(): number {
			return this._scrollV;
		}

		public set scrollV(value: number) {
			value = +value || 0;
			if (value != this._scrollV) {
				this._scrollV = value;
				this._container.y = -this._scrollV;
				if (this._isLazy || this._isClipping) {
					// 移动超过一格才进行渲染
					if (Math.abs(this._containerUpdateY - this._container.y) > this._cellH + this._vgap) {
						this._containerUpdateY = this._container.y;
						this._loopCreating = true;
						this.invalidate();
					}
				}
			}
		}

		public get scrollH(): number {
			return this._scrollH;
		}

		public set scrollH(value: number) {
			value = +value || 0;
			if (value != this._scrollH) {
				this._scrollH = value;
				this._container.x = -this._scrollH;
				if (this._isLazy || this._isClipping) {
					if (Math.abs(this._containerUpdateX - this._container.x) > this._cellW + this._hgap) {
						this._containerUpdateX = this._container.x;
						this._loopCreating = true;
						this.invalidate();
					}
				}
				else this.calcCurrentPage();
			}
		}

		public get scrollEnabled(): boolean {
			return this._scrollEnabled;
		}

		public set scrollEnabled(value: boolean) {
			if (value != this._scrollEnabled) {
				this._scrollEnabled = value;
			}
		}
		public set selectedIndex(value: number) {
			if (this._selectedIndex != value) {
				this._selectedIndex = value;
				if (!this._dataChanged) {
					if (this._selectedIndex >= 0 && this._selectedIndex < this._children.length) {
						if (this._selectedItem != null) {
							this._selectedItem.selected = false;
						}
						let item = this._children[this._selectedIndex];
						if (item) item.selected = true;
						this._selectedItem = item;
					}
				}
			}
		}
		public get selectedIndex(): number {
			return this._selectedIndex;
		}
		public get selectedItem(): IItemRenderer {
			return this._selectedItem;
		}
		public set dataProvider(value: Array<any>) {
			this._dataProvider = value;
			this._selectedIndex = -1;
			if (this._selectedItem != null) {
				if (!this._isMutiSelect)
					this._selectedItem.selected = false;
				this._selectedItem = null;
			}
			if(this._vScroller) this._vScroller.stopAnimation();
			if(this._hScroller) this._hScroller.stopAnimation();
			this._dataChanged = true;
			this.invalidate();
		}
		public get dataProvider(): Array<any> {
			return this._dataProvider;
		}
		public get children(): Array<IItemRenderer> {
			return this._children;
		}
		public set scrollPolicy(value: number) {
			this._scrollPolicy = value;
		}
		public get scrollPolicy(): number {
			return this._scrollPolicy;
		}
		public set hScrollPolicy(value: number) {
			this._hScrollPolicy = value;
		}
		public get hScrollPolicy(): number {
			return this._hScrollPolicy;
		}
		public get scroller(): ScrollBar {
			return this._vScroller;
		}
		public get hScroller(): ScrollBar {
			return this._hScroller;
		}
		public set isMutiSelect(value: boolean) {
			this._isMutiSelect = value;
		}
		public get isMutiSelect() {
			return this._isMutiSelect;
		}
		public set canDrag(value: boolean) {
			this._canDrag = value;
		}
		public get canDrag() {
			return this._canDrag;
		}
		public set needDelayDrag(value: boolean) {
			this._needDelayDrag = value;
		}
		public get needDelayDrag() {
			return this._needDelayDrag;
		}
		public set needDoubleClick(value: boolean) {
			this._needDoubleClick = value;
		}
		public get needDoubleClick() {
			return this._needDoubleClick;
		}
		public set pageNum(value: number) {
			this._pageNum = value;
		}
		public get pageNum(): number {
			return this._pageNum;
		}
		/**当前页，从1开始 */
		public get pageCureent(): number {
			return this._pageCureent;
		}
		/**是否延迟生成item**/
		public get isLazy(): boolean {
			return this._isLazy;
		}
		/**是否延迟生成item**/
		public set isLazy(value: boolean) {
			this._isLazy = value;
		}
		/**是否只生成可视区域item**/
		public get isClipping(): boolean {
			return this._isClipping;
		}
		/**是否只生成可视区域item**/
		public set isClipping(value: boolean) {
			this._isClipping = value;
		}
		public get maxH(): number {
			return this._maxH;
		}
		public get maxW(): number {
			return this._maxW;
		}
		public get lastItemX(): number {
			return this._lastItemX || 0;
		}
		public get lastItemY(): number {
			return this._lastItemY || 0;
		}
		public set lazyMaxLen(value: number) {
			this._lazyMaxLen = value;
		}

		/**移动内部容器 */
		public moveContainer(x: number, y: number): void {
			this._container.move(x, y);
		}

		/**取消选中*/
		public unSelect() {
			this._selectedIndex = -1;
			if (this._selectedItem != null) {
				if (!this._isMutiSelect)
					this._selectedItem.selected = false;
				this._selectedItem = null;
			}
		}

		/** 是否需要滚动条 */
		public get needScroller(): boolean {
			return this._needScroller;
		}
		/** 是否需要滚动条 */
		public set needScroller(value: boolean) {
			this._needScroller = value;
			if (this._vScroller) {
				this._vScroller.needScroller = this._needScroller;
			}
			if (this._hScroller) {
				this._hScroller.needScroller = this._needScroller;
			}
		}

		public dispose() {
			if (!this._disposed) {
				super.dispose();
				this._vScroller.removeEventListener(ResizeEvent.RESIZE, this.vscrollBarResizeHandler, this);
				this._hScroller.removeEventListener(ResizeEvent.RESIZE, this.hscrollBarResizeHandler, this);
				this._itemsPool.splice(0, this._itemsPool.length);
				while (this._children.length > 0) {
					let item: IItemRenderer = this._children.pop();
					item.dispose();
				}
			}
		}
	}
}