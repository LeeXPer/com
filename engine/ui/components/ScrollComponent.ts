namespace LUI {
	export class ScrollComponent extends Component implements IViewport {
		protected _contentWidth: number;
		protected _contentHeight: number;
		protected _scrollV: number;
		protected _scrollH: number;
		protected _scrollEnabled: boolean;
		protected _container: Component;
		protected _vScroller: VScrollBar;
		protected _hScroller: HScrollBar;
		protected _vScrollPolicy: number = ScrollBarPolicy.AUTO;
		protected _hScrollPolicy: number = ScrollBarPolicy.AUTO;
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
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
			this._container = new Component(this);

			this._vScroller = new VScrollBar();
			this._vScroller.visible = false;
			this._vScroller.showButtons = false;
			this._vScroller.needScroller = false;
			this._vScroller.slider.snapInterval = 5;
			this._vScroller.addEventListener(ResizeEvent.RESIZE, this.vscrollBarResizeHandler, this);

			this._hScroller = new HScrollBar();
			this._hScroller.visible = false;
			this._hScroller.showButtons = false;
			this._hScroller.needScroller = false;
			this._hScroller.slider.snapInterval = 5;
			this._hScroller.addEventListener(ResizeEvent.RESIZE, this.hscrollBarResizeHandler, this);
		}
		protected draw(): void {
			if (this._changed) {
				this.scrollRect = new egret.Rectangle(0, 0, this._width, this._height);
				//V
				if (this._vScrollPolicy != ScrollBarPolicy.OFF) {
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
				//H
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
			}
			super.draw();
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
				this._hScroller.move(0, this._height - this._hScroller.height);
		}

		public updata(w: number, h: number): void {
			let tmpContentW: number = w + this._margin.right + this._margin.left;
			let tmpContentH: number = h + this._margin.bottom + this._margin.top;
			if (tmpContentW != this._contentWidth) {
				this._contentWidth = tmpContentW;
				if (this._hScrollPolicy != ScrollBarPolicy.OFF)
					this._hScroller.resetViewPort();
			}
			if (tmpContentH != this._contentHeight) {
				this._contentHeight = tmpContentH;
				if (this._vScrollPolicy != ScrollBarPolicy.OFF)
					this._vScroller.resetViewPort();
			}
		}
		public addElement(child: egret.DisplayObject): void {
			if (child && (!this._container.contains(child))) {
				this._container.addChild(child);
			}
		}
		public set contentWidth(value: number) {
			this._contentWidth = value;
		}
		public get contentWidth(): number {
			return this._contentWidth;
		}

		public set contentHeight(value: number) {
			this._contentHeight = value;
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
			}
		}
		public get vscroller(): VScrollBar {
			return this._vScroller;
		}
		public get hscroller(): HScrollBar {
			return this._hScroller;
		}
		public get scrollEnabled(): boolean {
			return this._scrollEnabled;
		}

		public set scrollEnabled(value: boolean) {
			value = !!value;
			if (value != this._scrollEnabled) {
				this._scrollEnabled = value;
				this._vScrollPolicy = value ? ScrollBarPolicy.AUTO : ScrollBarPolicy.OFF;
				this._hScrollPolicy = value ? ScrollBarPolicy.AUTO : ScrollBarPolicy.OFF;
			}
		}

		public set scrollBounces(value: boolean) {
			if (this._vScroller)
				this._vScroller.scrollBounces = value;
			if (this._hScroller)
				this._hScroller.scrollBounces = value;
		}
	}
}