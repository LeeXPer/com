namespace LUI {
	enum TabDirection {
		HORIZONTAL,
		VERTICAL
	}
	export class Tab extends Component {
		protected _dataProvider: Array<any>;
		protected _itemRenderer: any;
		/**标签方向（0：水平方向;1：垂直方向） */
		protected _direction: number = 0;
		/**间隙 */
		protected _gap: number = 0;
		protected _children: Array<ISelect>;
		protected _selectedIndex: number = -1;
		protected _selectedItem: ISelect;
		protected _dataChanged: boolean;
		/**标签宽 */
		protected _cellW: number;
		/** */
		protected _cellH: number;
		/**可见标签索引列表 */
		protected _visibles: Array<number>;
		protected _visiblesChanged: boolean = false;
		/**是否可重复选择 */
		protected _isRepeatSelect: boolean;
		protected _firstDraw: boolean = true;
		/**标签类
		 * (参数：显示容器、item 、方向、间隙、标签宽、标签高)
		 */
		public constructor(p?: egret.DisplayObjectContainer, itemRenderer: any = null, direction: number = 0, gap: number = 0, cellW: number = -1, cellH: number = -1) {
			super(p);
			if (itemRenderer != null) {
				this._itemRenderer = itemRenderer;
			}
			else {
				this._itemRenderer = Button;
			}
			this._direction = direction;
			this._gap = gap;
			this._cellW = cellW;
			this._cellH = cellH;
		}
		protected createChildren(): void {
			super.createChildren();
			this._children = [];
		}
		protected draw(): void {
			if (this._dataChanged) {
				this._dataChanged = false;
				this.removeAllItems();
				if (this._dataProvider != null) {
					let len: number = this._dataProvider.length;
					for (let i: number = 0; i < len; i++) {
						let item: ISelect = <ISelect>new this._itemRenderer();
						this.addChild(item);
						if (this._cellW != -1 && this._cellH != -1)
							item.size(this._cellW, this._cellH);
						else {
							this._cellW = item.width;
							this._cellH = item.height;
						}
						item.data = this._dataProvider[i];
						this._children.push(item);
						this.rendererAdded(item);
						if (this._selectedIndex >= 0 && i == this._selectedIndex) {
							this._selectedItem = item;
							item.selected = true;
						}
						if (this._direction == TabDirection.HORIZONTAL)
							item.move(i * (this._cellW + this._gap) + this._margin.left, this._margin.top);
						else
							item.move(this._margin.left, this._margin.top + i * (this._cellH + this._gap));
					}
				}
				if (this._direction == TabDirection.HORIZONTAL) {
					this._width = this._children.length * (this._cellW + this._gap) - this._gap + this._margin.left + this._margin.right;
					this._height = this._cellH + this._margin.top + this._margin.bottom;
				}
				else {
					this._height = this._children.length * (this._cellH + this._gap) - this._gap + this._margin.top + this._margin.bottom;
					this._width = this._cellW + this._margin.left + this._margin.right;
				}
			}
			super.draw();
			if (this._firstDraw){
				this.reItemVisible();
				this._firstDraw = false;
			}
		}
		protected removeAllItems(): void {
			while (this.numChildren > 0) {
				let item: ISelect = <ISelect>this.removeChildAt(0);
				this.rendererRemoved(item);
				item.dispose();
			}
			this._children.splice(0, this._children.length);
		}
		private reItemVisible(): void {
			if (this._visiblesChanged || !this._visibles || this._firstDraw) {
				this._visiblesChanged = false;
				let showItems = [];
				for (let i = 0; i < this._children.length; i++) {
					let item = this._children[i];
					if (!this._visibles || (this._visibles[i] && this._visibles[i] == 1)) {
						showItems.push(item);
						item.visible = true;
					} else {
						item.visible = false;
					}
				}
				for (let i = 0; i < showItems.length; i++) {
					let item = showItems[i];
					if (this._direction == TabDirection.HORIZONTAL)
						item.move(i * (this._cellW + this._gap) + this._margin.left, this._margin.top);
					else
						item.move(this._margin.left, this._margin.top + i * (this._cellH + this._gap));
				}
			}
		}
		protected rendererAdded(renderer: ISelect): void {
			renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRendererTouchTab, this);
		}
		protected rendererRemoved(renderer: ISelect): void {
			renderer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRendererTouchTab, this);
		}
		protected onRendererTouchTab(event: egret.TouchEvent): void {
			let itemRenderer = <IItemRenderer>(event.$currentTarget);
			if (itemRenderer == this._selectedItem && !this._isRepeatSelect) {
				this._selectedItem.selected = true;
				return;
			}
			if (this._selectedItem != null) {
				this._selectedItem.selected = false;
			}
			this._selectedItem = itemRenderer;
			this._selectedItem.selected = true;
			this._selectedIndex = this._children.indexOf(this._selectedItem);
			TabItemTapEvent.dispatchItemTapEvent(this, TabItemTapEvent.TAB_ITEM_TAP, itemRenderer, this._selectedIndex);
		}
		/**  当前选中的标签 */
		public get selectedIndex(): number {
			return this._selectedIndex;
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
						item.selected = true;
						this._selectedItem = item;
					}
				}
			}
		}
		public get selectedItem(): ISelect {
			return this._selectedItem;
		}
		public set dataProvider(value: Array<any>) {
			this._dataProvider = value;
			this._selectedIndex = -1;
			if (this._selectedItem != null) {
				this._selectedItem.selected = false;
				this._selectedItem = null;
			}
			this._dataChanged = true;
			this.invalidate();
		}

		/**取消选中*/
		public unSelect() {
			this._selectedIndex = -1;
			if (this._selectedItem != null) {
				this._selectedItem.selected = false;
				this._selectedItem = null;
			}
		}

		public get dataProvider(): Array<any> {
			return this._dataProvider;
		}
		public get children(): Array<ISelect> {
			return this._children;
		}

		public set visibles(value: Array<number>) {
			if (this._visibles != value) {
				this._visibles = value;
				this._visiblesChanged = true;
				this.reItemVisible();
			}
		}
		public set isRepeatSelect(value: boolean) {
			this._isRepeatSelect = value;
		}
		public get isRepeatSelect() {
			return this._isRepeatSelect;
		}
	}
}