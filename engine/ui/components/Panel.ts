namespace LUI {
	export class PanelStyle {
		/**margin */
		public static margin: string = "Panel#margin";
		/**背景皮肤 */
		public static skin: string = "Panel#skin";
		/**关闭按钮皮肤 */
		public static closeSkin: string = "Panel#close#skin";
		/**标题大小 */
		public static titleFontSize: string = "Panel#title#fontSize";
		/**标题颜色 */
		public static titleColor: string = "Panel#title#color";
		/**标题栏底图 */
		public static titleSkin: string = "Panel#title#skin";
	}
	export class Panel extends Component {
		protected _bgCon: Component;
		protected _titleCon: Component;
		/**内容容器 */
		protected _container: Component;
		protected _titleDisplay: Component;
		protected _title: string;
		/**0文字，1图片 */
		protected _titleMode: number ;
		protected _titleColor: number;
		protected _titleFontSize: number;
		protected _closeBtn: Button;
		protected _titleChanged: boolean;
		protected _escClose: boolean;
		/**标题栏底图 */
		protected _titleSkin: ISkin;
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
			if(this._escClose){
				KeyboardUtils.getInstance().addKeyDown((keyCode: number)=>{
					if(keyCode == Keyboard.ESC && GlobalStaticConfig.debug)
						this.closeHandler(null);
				}, this);
			}
		}
		protected preinitialize(): void {
			super.preinitialize();
			this._defaultWidth = 100;
			this._defaultHeight = 100;
			this._width = this._defaultWidth;
			this._height = this._defaultHeight;
			this._margin.reset(35, 8, 8, 8);
			this._titleMode = 1;
			this._escClose = false;
		}
		/**创建组件对象*/
		protected createChildren(): void {
			super.createChildren();
			this._bgCon = new Component();
			this.addChild(this._bgCon);
			this._titleCon = new Component();
			this.addChild(this._titleCon);
			this._titleCon.y = 0;
			this._container = new Component();
			this.addChild(this._container);
			this.createCloseButton();			
		}
		protected createCloseButton(): void {
			this._closeBtn = new Button();
			this.addChild(this._closeBtn);
			this._closeBtn.addEventListener(ResizeEvent.RESIZE, this.closeBtnResizeHandler, this);
			this._closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(PanelStyle.margin))
				this.margin.copyForm(StyleManager.getDefaultStyle(PanelStyle.margin));
			if (StyleManager.hasDefaultStyle(PanelStyle.skin))
				this.skin = StyleManager.getDefaultStyle(PanelStyle.skin);
			if (StyleManager.hasDefaultStyle(PanelStyle.closeSkin)) {
				if (this._closeBtn != null)
					this._closeBtn.skin = StyleManager.getDefaultStyle(PanelStyle.closeSkin);
			}
			if (StyleManager.hasDefaultStyle(PanelStyle.titleSkin)) {
				this.titleSkin = StyleManager.getDefaultStyle(PanelStyle.titleSkin);
			}
		}
		protected draw(): void {
			if (this._changed) {
				// let scrollRect: egret.Rectangle = new egret.Rectangle(0, 0, this._width - this._margin.left - this._margin.right, this._height - this._margin.top - this._margin.bottom);
				// this._container.scrollRect = scrollRect;
				this._container.x = this._margin.left;
				this._container.y = this._margin.top;
				this._skinChanged = true;
				if (!this._titleChanged) {
					if (this._titleDisplay != null) {
						this.titleResizeHandler();
					}
				}
			}
			if (this._titleChanged) {
				this._titleChanged = false;
				this.createTitle();
			}
			super.draw();
		}
		/**title */
		protected createTitle(): void {
			if (this._titleDisplay != null) {
				if (this._titleCon.contains(this._titleDisplay))
					this._titleCon.removeChild(this._titleDisplay);
				this._titleDisplay.dispose();
				this._titleDisplay.removeEventListener(ResizeEvent.RESIZE, this.titleResizeHandler, this);
			}
			if (this._title) {
				if (this._titleMode == 0) {
					let titleLab = new Label();
					titleLab.fontSize = isNaN(this._titleFontSize) ? StyleManager.getDefaultStyle(PanelStyle.titleFontSize) : this._titleFontSize;
					titleLab.textColor = isNaN(this._titleColor) ? StyleManager.getDefaultStyle(PanelStyle.titleColor) : this._titleColor;
					titleLab.htmlText = this._title;
					// titleLab.bold = true;
					this._titleDisplay = titleLab;
				}
				else {
					let titleImg: Image = new Image();
					titleImg.source = this._title;
					this._titleDisplay = titleImg;
				}
				this._titleCon.addChild(this._titleDisplay);
				this._titleDisplay.addEventListener(ResizeEvent.RESIZE, this.titleResizeHandler, this);
				this.titleResizeHandler();
			}
		}
		/**回执皮肤 */
		protected drawSkin(): void {
			this.drawBackground();
			this.drawTitleBackground();
		}
		/**绘制背景**/
		protected drawBackground(): void {
			while (this._bgCon.numChildren > 0) {
				this._bgCon.removeChildAt(0);
			}
			this._bgCon.graphics.clear();
			if (this._skin && this._skin.background) {
				let bgImg: Image = new Image(this._bgCon, this._skin.background);
				bgImg.maintainAspectRatio = false;
				bgImg.scale9Grid = this._skin.scale9Grid;
				bgImg.size(this._width, this._height);
				bgImg.drawDirectly();
			}
			else {
				this._bgCon.graphics.beginFill(0xffffff, 0.5);
				this._bgCon.graphics.drawRect(0, 0, this._width, this._height);
				this._bgCon.graphics.endFill();
			}
		}
		protected drawTitleBackground(): void {
			this._titleCon.graphics.clear();
			for (let i: number = 0; i < this._titleCon.numChildren; i++) {
				let disp: Component = <Component>this._titleCon.getChildAt(i);
				if (disp != this._titleDisplay) {
					this._titleCon.removeChild(disp);
					i--;
				}
			}
			// if (this._titleSkin && this._titleSkin.background) {
			// 	let titleBg: Image = new Image();
			// 	titleBg.maintainAspectRatio = false;
			// 	titleBg.source = this._titleSkin.background;
			// 	this._titleCon.addChildAt(titleBg, 0);
			// 	if (this._titleSkin.scale9Grid) {
			// 		titleBg.scale9Grid = this._titleSkin.scale9Grid;
			// 		titleBg.size(this._width, this._margin.top);
			// 		titleBg.drawDirectly();
			// 	}
			// 	else {
			// 		titleBg.addEventListener(ResizeEvent.RESIZE, this.titleBgResizeEventHandler, this);
			// 		titleBg.move((this._width - titleBg.width) / 2, 0);
			// 	}
			// } else {
			// 	// this._titleCon.graphics.beginFill(0x999999, 0.8);
			// 	// this._titleCon.graphics.drawRect(0, 0, this._width, this._margin.top);
			// 	// this._titleCon.graphics.endFill();
			// }
		}
		protected closeBtnResizeHandler(evt: ResizeEvent): void {
			this.reposCloseButton();
		}
		private titleResizeHandler(evt?: ResizeEvent): void {
			this.reposTitle();
		}
		protected titleBgResizeEventHandler(evt: ResizeEvent): void {
			let titleBg: Component = <Component>evt.currentTarget;
			titleBg.move((this._width - titleBg.width) / 2, 0);
			titleBg.removeEventListener(ResizeEvent.RESIZE, this.titleBgResizeEventHandler, this);
		}
		/**可重写改变按钮位置 */
		protected reposCloseButton(): void {
			// this._closeBtn.move(this._width - this._closeBtn.width - 1,10);
			this._closeBtn.move(3,10);
		}
		/**可重写改变title位置 */
		protected reposTitle(): void {
			this._titleDisplay.move((this._width - this._titleDisplay.width) / 2, (this._margin.top - this._titleDisplay.height) / 2);
		}
		protected closeHandler(e: egret.TouchEvent): void {
			this.closePanel();
		}
		/**关闭窗口 */
		public closePanel(): void {
			if (this.parent)
				this.parent.removeChild(this)
		}

		///////////////////////////////////////////////////////////////////
		//addElement removeElement
		///////////////////////////////////////////////////////////////////
		public get numElements(): number {
			return this._container.numChildren;
		}
		public addElement(child: Component): void {
			if (child && (!this._container.contains(child))) {
				this._container.addChild(child);
			}
		}
		public addElementAt(child: Component, index: number): void {
			if (child && (!this._container.contains(child))) {
				if (index < 0)
					index = 0;
				if (index > this._container.numChildren - 1)
					index = this._container.numChildren - 1;
				this._container.addChildAt(child, index);
			}
		}
		public removeElement(child: Component): void {
			if (child && this._container.contains(child)) {
				this._container.removeChild(child);
			}
		}
		public removeElementAt(index: number): void {
			if (index >= 0 && index < this._container.numChildren) {
				this._container.removeChildAt(index)
			}
		}
		public removeAllElements(gc: Boolean = false): void {
			while (this._container.numChildren > 0) {
				var _icomp: Component = this._container.removeChildAt(0) as Component;
				if (gc)
					_icomp.dispose();
			}
		}
		public containsElement(child: Component): Boolean {
			if (child != null) {
				return this._container.contains(child);
			}
			return false;
		}
		/////////////////////////////////////////////////////////////////////////
		public get closeButton(): Button {
			return this._closeBtn;
		}
		public set titleMode(value: number) {
			this._titleMode = value;
		}
		public get titleMode() {
			return this._titleMode;
		}
		public set title(value: string) {
			if (this._title != value) {
				this._title = value;
				this._titleChanged = true;
				this.invalidate();
			}
		}
		public get title(): string {
			return this._title;
		}
		public get titleColor(): number {
			return this._titleColor
		}
		public set titleColor(value: number) {
			this._titleColor = value;
		}
		public get titleFontSize(): number {
			return this._titleFontSize;
		}
		public set titleFontSize(value: number) {
			this._titleFontSize = value;
		}
		public set titleSkin(value: ISkin) {
			if (value != this._titleSkin) {
				this._titleSkin = value;
				this._skinChanged = true;
				this.invalidate();
			}
		}
		public get titleSkin(): ISkin {
			return this._titleSkin;
		}
	}
}