namespace LUI {
	export class CheckBoxStyle {
		public static margin: string = "CheckBox#margin";
		public static skin: string = "CheckBox#skin";
		public static colors: string = "CheckBox#label#colors";
		public static fontSize: string = "CheckBox#label#fontSize";
	}
	export class CheckBox extends Component implements ISelect {
		private static SKIN_STATE: number = 2;
		protected _background: egret.Bitmap;
		protected _backgroundTexture: egret.Texture;
		protected _labelDisplay: Label;
		protected _label: string;
		protected _labelChanged: boolean;
		protected _selected: boolean;
		/**
		*[uncheckColor,checkedColor]
		*/
		protected _colors: Array<number>;
		protected _labels: Array<string>;
		protected _fontSize: number;
		protected _stateChanged: boolean;
		protected _bgWidth: number;
		protected _bgHeight: number;
		public constructor(p?: egret.DisplayObjectContainer, label?: string) {
			super(p);
			if (label) {
				this.label = label;
			}
		}
		protected preinitialize(): void {
			super.preinitialize();
		}
		protected createChildren(): void {
			super.createChildren();
			this._labelDisplay = new Label(this);
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(CheckBoxStyle.margin))
				this.margin.copyForm(StyleManager.getDefaultStyle(CheckBoxStyle.margin));
			if (StyleManager.hasDefaultStyle(CheckBoxStyle.skin))
				this.skin = StyleManager.getDefaultStyle(CheckBoxStyle.skin);
			if (StyleManager.hasDefaultStyle(CheckBoxStyle.colors))
				this.colors = StyleManager.getDefaultStyle(CheckBoxStyle.colors);
			if (StyleManager.hasDefaultStyle(CheckBoxStyle.fontSize)) {
				this.fontSize = StyleManager.getDefaultStyle(CheckBoxStyle.fontSize);
			}
		}
		protected initialize(): void {
			super.initialize();
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		}
		protected draw(): void {
			if (this._labelChanged) {
				this._labelChanged = false;
				this._labelDisplay.textAlign = "left";
				this.updateLabelColor();
				this.updateLable();
				this._labelDisplay.htmlText = this._label;
				if (!isNaN(this._fontSize))//设置了文字大小才用设置的大小，没设置就用label默认大小
					this._labelDisplay.fontSize = this._fontSize;
				this._labelDisplay.drawDirectly();
			}
			if (this._stateChanged) {
				this._stateChanged = false;
				this.updateLabelColor();
				this.updateLable();
				this._skinChanged = true;
			}
			super.draw();
		}
		protected updateLabelColor(): void {
			let state: number = this._selected ? 1 : 0;
			if (this._colors != null && state < this._colors.length) {
				this._labelDisplay.textColor = this._colors[state];
			}
		}
		protected updateLable() {
			let state: number = this._selected ? 1 : 0;
			if (this._labels && state < this._labels.length) {
				this.label = this._labels[state];
			}
		}

		protected drawSkin(): void {
			if (this._skin && this._skin.background) {
				StyleManager.assetAdapter.getAsset(this._skin.background, this.skinAssetReadyHandler, this);
			}
			else {
			}
		}
		private skinAssetReadyHandler(data: any, source: any): void {
			if (source !== this._skin.background)
				return;
			if (!egret.is(data, "egret.Texture")) {
				return;
			}
			this._backgroundTexture = data;
			let currentState: number = 0;
			if (this._selected)
				currentState = 1;
			if (this._background == null) {
				this._background = new egret.Bitmap();
				this.addChildAt(this._background, 0);
			}
			else {
			}
			let textureKey: string = source + "_" + currentState;
			let texture: egret.Texture = StyleManager.textureMap[textureKey];
			if (texture == null) {
				texture = new egret.Texture();
				texture.bitmapData = this._backgroundTexture.bitmapData;
				let bitmapWidth = this._backgroundTexture.$bitmapWidth;
				let bitmapHeight = this._backgroundTexture.$bitmapHeight / 2;
				texture.$initData(this._backgroundTexture.$bitmapX, this._backgroundTexture.$bitmapY + bitmapHeight * currentState, bitmapWidth, bitmapHeight, this._backgroundTexture.$offsetX, this._backgroundTexture.$offsetY, bitmapWidth, bitmapHeight, this._backgroundTexture.$sourceWidth, this._backgroundTexture.$sourceHeight);
				StyleManager.textureMap[textureKey] = texture;
			}
			this._background.$setBitmapData(texture);
			if (this._bgWidth && this._bgHeight) {
				this._background.width = this._bgWidth;
				this._background.height = this._bgHeight;
			}
			this.measureSize();
			this.dispatchResizeEvent();
		}
		protected measureSize(): void {
			if (this._background) {
				this._height = Math.max(this._background.height, this._labelDisplay.height);
				this._width = this._background.width + this._margin.left + this._labelDisplay.width;
				this._labelDisplay.move(this._background.width + this._margin.left, ((this._height - this._labelDisplay.height) / 2) + this._margin.top);
				this._background.y = (this._height - this._background.height) / 2;
			}
			else {
				this._height = this._labelDisplay.height;
				this._width = this._margin.left + this._labelDisplay.width;
				this._labelDisplay.move(this._margin.left, 0);
			}
		}
		protected onTouchBegin(event: egret.TouchEvent): void {
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._stateChanged = true;
			this.invalidate();
			event.updateAfterEvent();
		}
		protected onTouchCancle(event: egret.TouchEvent): void {
			let stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._stateChanged = true;
			this.invalidate();
		}
		private onStageTouchEnd(event: egret.Event): void {
			let stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			if (this.contains(event.target)) {
				this.buttonReleased();
			}
			this._stateChanged = true;
			this.invalidate();
		}
		protected buttonReleased(): void {
			this._selected = !this._selected;
			this.dispatchEventWith(egret.Event.CHANGE);
		}
		public get selected(): boolean {
			return this._selected;
		}
		public set selected(value: boolean) {
			if (this._selected != value) {
				this._selected = value;
				this._stateChanged = true;
				this.invalidate();
			}
		}
		public set colors(value: Array<number>) {
			this._colors = value;
		}
		public get colors(): Array<number> {
			return this._colors;
		}
		public get fontSize(): number {
			return this._fontSize;
		}
		public set fontSize(value: number) {
			this._fontSize = value;
		}
		public get textField(): Label {
			return this._labelDisplay;
		}
		public get label(): string {
			return this._label;
		}
		public set label(value: string) {
			if (this._label != value) {
				this._label = value;
				this._labelChanged = true;
				this.invalidate();
			}
		}
		public set labels(value: string[]) {
			this._labels = value;
			this.label = this._labels[this._selected ? 1 : 0];
		}
		public get enabled(): boolean {
			return this._enabled;
		}
		public set enabled(value: boolean) {
			if (this._enabled != value) {
				this._enabled = value;
				if (!this._enabled)
					this.filters = StyleManager.defaultGrayFilter;
				else
					this.filters = null;
			}
		}
		public sizeBg(w: number, h: number) {
			this._bgWidth = w;
			this._bgHeight = h;
			if (this._background) {
				this._background.width = w;
				this._background.height = h;
			}
		}
	}
}