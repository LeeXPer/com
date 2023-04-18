module LUI {
	export class Container extends Component {
		/**
		 *基本布局,绝对坐标布局 
		 */
		public static BASIC_LAYOUT: string = "BasicLayout";
		/**
		 *垂直方向布局 
		 */
		public static VERTICAL_LAYOUT: string = "VerticalLayout";
		/**
		 *水平方向布局 
		 */
		public static HORIZONTAL_LAYOUT: string = "HorizontalLayout";
		protected _container: Component;
		protected _rect: egret.Rectangle;
		protected _elementChanged: boolean = false;
		/**布局方式（水平，垂直，绝对坐标）**/
		protected _layout: string;
		protected _layoutChanged: boolean = false;
		/**垂直间距**/
		protected _vgap: number;
		/**水平间距**/
		protected _hgap: number;

		public constructor(p?: egret.DisplayObjectContainer, layout: string = Container.BASIC_LAYOUT, vgap: number = 0, hgap: number = 0) {
			super(p);
			this._vgap = vgap;
			this._hgap = hgap;
			this._layout = layout;
		}
		protected createChildren(): void {
			super.createChildren();
			this._container = new Component();
			this.addChild(this._container);
		}
		protected initialize(): void {
			super.initialize();
			this.size(this._defaultWidth, this._defaultHeight);
			this._rect = new egret.Rectangle(0, 0, this._defaultWidth, this._defaultHeight);
			this._container.scrollRect = this._rect;
		}
		public dispose(): void {
			if (!this._disposed) {
				super.dispose();
				this.removeAllElements(true);
				this._container = null;
			}
		}
		/**
		 *添加元素
		 * @param child
		 */
		public addElement(child: Component): void {
			var _comp = child;
			if (_comp && (!this._container.contains(_comp))) {
				this._container.addChild(_comp);
				_comp.addEventListener(ResizeEvent.RESIZE, this.elementSizeChanged, this);
				this._elementChanged = true;
				this.invalidate();
			}
		}
		/**
		 *将某元素添加到索引指定的位置 
		 * @param child
		 * @param index
		 */
		public addElementAt(child: Component, index: number): void {
			var _comp: Component = child;
			if (_comp && (!this._container.contains(_comp))) {
				if (index > this._container.numChildren - 1)
					index = this._container.numChildren;
				if (index < 0)
					index = 0;
				this._container.addChildAt(_comp, index);
				_comp.addEventListener(ResizeEvent.RESIZE, this.elementSizeChanged, this);
				this._elementChanged = true;
				this.invalidate();
			}
		}
		/**
		 * 移除某元素
		 * @param child
		 */
		public removeElement(child: Component): void {
			var _comp: Component = child;
			if (_comp && this._container.contains(_comp)) {
				this._container.removeChild(_comp);
				_comp.removeEventListener(ResizeEvent.RESIZE, this.elementSizeChanged, this);
				this._elementChanged = true;
				this.invalidate();
			}
		}
		/**
		 *通过索引移除容器内元素 
		 * @param index
		 */
		public removeElementAt(index: number): Component {
			if (index >= 0 && index < this._container.numChildren) {
				var _icomp: Component = this._container.removeChildAt(index) as Component;
				_icomp.removeEventListener(ResizeEvent.RESIZE, this.elementSizeChanged, this);
				this._elementChanged = true;
				this.invalidate();
				return _icomp;
			}
			return null;
		}
		/**
		 * 移除容器内所有元素
		 * @param gc 是否dispose元素
		 */
		public removeAllElements(gc: boolean = false): void {
			while (this._container.numChildren > 0) {
				var _icomp: Component = this._container.removeChildAt(0) as Component;
				_icomp.removeEventListener(ResizeEvent.RESIZE, this.elementSizeChanged, this);
				if (gc)
					_icomp.dispose();
			}

			this._elementChanged = true;
			this.invalidate();
		}
		/**
		 * 获取索引处的元素
		 * @param index
		 * @return 
		 */
		public getElementAt(index: number): Component {
			if (index >= 0 && index < this.numElements) {
				return this._container.getChildAt(index) as Component;
			}
			return null;
		}
		public setElementIndex(child: Component, index: number): void {
			if (index >= 0 && index < this.numElements && this._container.contains(child) && this._container.getChildIndex(child) != index) {
				this._container.setChildIndex(child as Component, index);
				this._elementChanged = true;
				this.invalidate();
			}
		}
		/**容器中元素改变**/
		protected elementSizeChanged(param: Object = null): void {
			this._elementChanged = true;
			this.invalidate();
		}
		/**
		 * 更新内部元素布局
		 * **/
		protected updateLayout(): void {
			if (this._layout == Container.BASIC_LAYOUT)
				return;
			var last: number = 0;
			var object: Component;
			var i: number, j: number = this._container.numChildren;
			var totleW:number = 0;;
			var totleH:number = 0;;
			for (i = 0; i < j; i++) {
				object = this._container.getChildAt(i) as Component;
				if (this._layout == Container.HORIZONTAL_LAYOUT) {
					object.x = last;
					object.y = 0;
					last = object.x + object.width + this._hgap;
					totleW = last - this._hgap;
					totleH = object.height;
				}
				else if (this._layout == Container.VERTICAL_LAYOUT) {
					object.x = 0;
					object.y = last;
					last = object.y + object.height + this._vgap;
					totleH = last - this._vgap;
					totleW = object.width;
				}
			}
			this.size(totleW,totleH);
			if (this.hasEventListener(ResizeEvent.RESIZE)) {
				ResizeEvent.dispatchResizeEvent(this, this._oldWidth, this._oldHeight);
			}

		}

		protected draw(): void {
			if (this._elementChanged || this._layoutChanged) {
				this._elementChanged = false;
				this._layoutChanged = false;
				this.updateLayout();
			}
			if (!this._changed) return;
			this._changed = false;


			this._rect.width = this._width - this._margin.right - this._margin.left;
			this._rect.height = this._height - this._margin.bottom - this._margin.top;

			this._container.x = this._margin.left;
			this._container.y = this._margin.top;
			this._container.scrollRect = this._rect;
			super.draw();
		}
		public drawDirectly(): void {
			this._elementChanged = true;
			super.drawDirectly();
		}
		///////////////////////////////////
		// getter/setters
		///////////////////////////////////
		/**容器中元素数量**/
		public get numElements(): number {
			return this._container.numChildren;
		}
		/**
		 * 元素容器
		 * @return 
		 */
		public get container(): Component {
			return this._container;
		}

		public get layout(): string {
			return this._layout;
		}
		/**
		 *设置layout方式 
		 * @param value
		 */
		public set layout(value: string) {
			if (value != this._layout) {
				this._layout = value;
				this._layoutChanged = true;
				this.invalidate();
			}
		}
	}
}