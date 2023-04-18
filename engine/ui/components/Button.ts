namespace LUI {
	export enum ButtonState {
		UP,
		DOWN,
		DISABLED
	}
	export class ButtonStyle {
		public static margin: string = "Button#margin";
		public static skin: string = "Button#skin";
		public static colors: string = "Button#label#colors";
		public static fontSize: string = "Button#label#fontSize";
		public static fontFamily: string = "Button#label#fontFamily";
		public static stroke: string = "Button#label#stroke";
		public static strokeColors: string = "Button#label#strokeColors";
	}
	export class Button extends Component implements ISelect {
		protected _background: egret.Bitmap;
		protected _backgroundTexture: egret.Texture;
		protected _labelDisplay: Label;
		// protected _labelDisplay2: Label;	//label阴影
		protected _label: string;
		protected _fontSize: number;
		protected _fontFamily: string;
		protected _stroke: number;
		protected _strokeColor: number = 0;
		protected _strokeColors: Array<number>;
		protected _bold: boolean;
		/**up，down,disabled */
		protected _stateNum: number = 3;
		protected _touchCaptured: boolean = false;
		protected _stateChanged: boolean;
		/**
		*[upColor,downColor,disableColor]
		*/
		protected _colors: Array<number>;
		protected _toggle: boolean;
		protected _selected: boolean;
		protected _downShiftX: number = 0;//按下X轴偏移量
		protected _downShiftY: number = 0;//按下Y轴偏移量
		protected _fontNumWidthCfgs: number[];  // 依据汉字个数决定宽度的配置
		private _isLableReplace2Zh: boolean; // 是否呈现文本

		public constructor(p?: egret.DisplayObjectContainer, label?: string) {
			super(p);
			if (label) {
				this.label = label;
			}
		}

		protected preinitialize(): void {
			super.preinitialize();
			this._defaultWidth = 0;
			this._defaultHeight = 0;
			this._width = this._defaultWidth;
			this._height = this._defaultHeight;
			this.touchChildren = false;
		}
		protected initialize(): void {
			super.initialize();
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(ButtonStyle.margin))
				this.margin.copyForm(StyleManager.getDefaultStyle(ButtonStyle.margin));
			// if (StyleManager.hasDefaultStyle(ButtonStyle.skin))
			// 	this.skin = StyleManager.getDefaultStyle(ButtonStyle.skin);
			if (StyleManager.hasDefaultStyle(ButtonStyle.colors))
				this.colors = StyleManager.getDefaultStyle(ButtonStyle.colors);
			if (StyleManager.hasDefaultStyle(ButtonStyle.fontSize))
				this.fontSize = StyleManager.getDefaultStyle(ButtonStyle.fontSize);
			if (StyleManager.hasDefaultStyle(ButtonStyle.fontFamily))
				this.fontFamily = StyleManager.getDefaultStyle(ButtonStyle.fontFamily);
			if (StyleManager.hasDefaultStyle(ButtonStyle.stroke))
				this.stroke = StyleManager.getDefaultStyle(ButtonStyle.stroke);
			if (StyleManager.hasDefaultStyle(ButtonStyle.strokeColors))
				this.strokeColors = StyleManager.getDefaultStyle(ButtonStyle.strokeColors);
			//FIXME----
			// this.stroke = 0; 
			// this.strokeColor = 0xffffff;
			this.bold = false;
		}
		protected draw(): void {
			if (this._changed) {
				if (this._label) {
					// if (this._labelDisplay2 == null)
					// 	this._labelDisplay2 = new Label(this);
					if (this._labelDisplay == null) {
						this._labelDisplay = new Label(this);
						this._labelDisplay.textAlign = "center";
					}

					this.updateLabelColor();
					// this._labelDisplay.text = this._label;
					this._labelDisplay.text = this.isLableReplace2Zh ? TextFlowMaker.zh2ButtonLableReplace(this._label) : this._label; // 修改呈现文本
					this._labelDisplay.stroke = this._stroke;
					this._labelDisplay.strokeColor = this._strokeColor;
					this._labelDisplay.bold = this._bold;
					this._labelDisplay.fontFamily = this._fontFamily;
					if (!isNaN(this._fontSize))//设置了文字大小才用设置的大小，没设置就用label默认大小
						this._labelDisplay.fontSize = this._fontSize;
					this._labelDisplay.drawDirectly();

					//copy
					// this._labelDisplay2.textAlign = "center";
					// this._labelDisplay2.textColor = 0x333333;	//阴影颜色
					// this._labelDisplay2.text = this._label;
					// this._labelDisplay2.bold = this._bold;
					// this._labelDisplay2.fontFamily = this._fontFamily;
					// if (!isNaN(this._fontSize))//设置了文字大小才用设置的大小，没设置就用label默认大小
					// 	this._labelDisplay2.fontSize = this._fontSize;
					// this._labelDisplay2.drawDirectly();
				}
				else {
					if (this._labelDisplay != null && this.contains(this._labelDisplay)) {
						this.removeChild(this._labelDisplay);
					}
				}
			}
			if (this._stateChanged) {
				this._stateChanged = false;
				if (this._labelDisplay != null && this.contains(this._labelDisplay)) {
					this.updateLabelColor();
				}
				this._skinChanged = true;
			}
			super.draw();
		}
		protected updateLabelColor(): void {
			let state: number = this.getCurrentState();
			if (this._colors != null && state < this._colors.length) {
				this._labelDisplay.textColor = this._colors[state];
			}
			if (this._strokeColors != null && state < this._strokeColors.length) {
				this._strokeColor = this._strokeColors[state];
				this._labelDisplay.strokeColor = this._strokeColor;
			}
		}
		protected drawSkin(): void {
			if (this._skin && this._skin.background) {
				if (this._skin.stateNum) {
					this._stateNum = this._skin.stateNum;
				}
				StyleManager.assetAdapter.getAsset(this._skin.background, this.skinAssetReadyHandler, this);
			}
			else {
				this.drawDefaultBackground();
			}
		}
		protected drawDefaultBackground(): void {
			let currentState: number = this.getCurrentState();
			if (currentState == 0) {
				this.graphics.beginFill(0x52b4f2);
			}
			else if (currentState == 1) {
				this.graphics.beginFill(0x429bed);
			}
			else {
				this.graphics.beginFill(0xaeaeae);
			}
			this.graphics.drawRect(0, 0, this._width, this._height);
			this.graphics.endFill();
		}
		private skinAssetReadyHandler(data: any, source: any): void {
			if (source !== this._skin.background)
				return;
			if (!egret.is(data, "egret.Texture")) {
				return;
			}
			this.graphics.clear();
			this._backgroundTexture = data;
			this.measureSize();
			let currentState: number = this.getCurrentState();
			if (this._stateNum <= 2 && this.enabled == false) {
				currentState = ButtonState.UP;
				if (StyleManager.defaultGrayFilter) {
					this.filters = this.filters ? this.filters.concat(StyleManager.defaultGrayFilter) : StyleManager.defaultGrayFilter;
				}
			}
			if (currentState >= this._stateNum)
				currentState = 0;
			if (this._background == null) {
				this._background = new egret.Bitmap();
				this.addChildAt(this._background, 0);
			}
			else {
			}
			this._background.scale9Grid = this._scale9Grid;
			this._background.width = this._width;
			this._background.height = this._height;
			let textureKey: string = source + "_" + currentState;
			let texture: egret.Texture = StyleManager.textureMap[textureKey];
			if (texture == null) {
				texture = new egret.Texture();
				texture.bitmapData = this._backgroundTexture.bitmapData;
				let bitmapWidth = this._backgroundTexture.textureWidth;
				let bitmapHeight = this._backgroundTexture.textureHeight / this._stateNum;
				texture.$initData(this._backgroundTexture.$bitmapX, this._backgroundTexture.$bitmapY + bitmapHeight * currentState, bitmapWidth, bitmapHeight, this._backgroundTexture.$offsetX, this._backgroundTexture.$offsetY, bitmapWidth, bitmapHeight, this._backgroundTexture.$sourceWidth, this._backgroundTexture.$sourceHeight);
				StyleManager.textureMap[textureKey] = texture;
			}
			this._background.$setBitmapData(texture);
			this.dispatchResizeEvent();
			LUIEvent.dispatchEvent(this, LUIEvent.SKIN_COMPLETE);
		}
		protected measureSize(): void {
			if (isNaN(this._explicitWidth)) {
				if (this._labelDisplay != null && this.contains(this._labelDisplay)) {
					let ws = this._fontNumWidthCfgs;
					let matchArr = this._label.match(/[\u4e00-\u9fa5]/g);
					let numArr = this._label.match(/[0-9]/g);
					if (ws && matchArr) {
						let editorIndex = matchArr.length - 2 < ws.length ? Math.max(0, matchArr.length - 2) : 0;
						this._width = ws[editorIndex];
						if (numArr)
							this._width += numArr.length * this.fontSize;
					}
					else
						this._width = this._labelDisplay.width + this._margin.left + this._margin.right;
				}
				else {
					if (this._backgroundTexture != null)
						this._width = this._backgroundTexture.textureWidth;
					else
						this._width = this._defaultWidth;
				}
			}
			if (isNaN(this._explicitHeight)) {
				if (this._labelDisplay != null && this.contains(this._labelDisplay)) {
					this._height = this._labelDisplay.height + this._margin.top + this._margin.bottom;
				}
				else {
					if (this._backgroundTexture != null)
						this._height = this._backgroundTexture.textureHeight / this._stateNum;
					else
						this._height = this._defaultHeight;
				}
			}
			if (this._labelDisplay != null && this.contains(this._labelDisplay)) {
				let labelW = this._fontNumWidthCfgs ? this._labelDisplay.width : this._width - this._margin.left - this._margin.right;
				this._labelDisplay.width = labelW;
				let labelShiftX = this.getCurrentState() == ButtonState.DOWN ? this._downShiftX : 0;	//按下label X轴偏移量
				let labelShiftY = this.getCurrentState() == ButtonState.DOWN ? this._downShiftY : 0;	//按下label Y轴偏移量
				let labelDx = this._fontNumWidthCfgs ? this._width - labelW >> 1 : this._margin.left + labelShiftX;
				let labelDy = this._fontNumWidthCfgs ? this._height - this._labelDisplay.height >> 1 : (this._height - this._labelDisplay.height - this._margin.top - this._margin.bottom) / 2 + this._margin.top + labelShiftY;
				this._labelDisplay.move(labelDx, labelDy);
				this._labelDisplay.drawDirectly();
				// if (this.contains(this._labelDisplay2)) {
				// 	this._labelDisplay2.size(this._labelDisplay.width, this._labelDisplay.height);
				// 	this._labelDisplay2.move(this._labelDisplay.x + 1, this._labelDisplay.y + 1);
				// }
			}
		}
		protected onTouchBegin(event: egret.TouchEvent): void {
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._touchCaptured = true;
			this._stateChanged = true;
			this.invalidate();
			event.updateAfterEvent();
		}
		protected onTouchCancle(event: egret.TouchEvent): void {
			let stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._touchCaptured = false;
			this._stateChanged = true;
			this.invalidate();
		}
        /**
         * 舞台上触摸弹起事件
         */
		protected onStageTouchEnd(event: egret.Event): void {
			let stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			if (this.contains(event.target)) {
				this.buttonReleased();
			}
			this._touchCaptured = false;
			this._stateChanged = true;
			this.invalidate();
		}
		protected getCurrentState(): number {
			if (!this._enabled)
				return ButtonState.DISABLED;

			if ((!this._toggle) || (!this._selected)) {
				if (this._touchCaptured)
					return ButtonState.DOWN;
				else
					return ButtonState.UP;
			}
			else {
				return ButtonState.DOWN;
			}
		}
		/**
		* 当在用户单击按钮之后处理egret.TouchEvent.TOUCH_END事件时，将调用此方法。
		* 仅当以按钮为目标，并且touchCaptured为true时，才会调用此方法。
		*/
		protected buttonReleased(): void {
			if (this._toggle) {
				this._selected = !this._selected;
				this.dispatchEventWith(egret.Event.CHANGE);
			}
		}
		public get label(): string {
			return this._label;
		}
		public set label(value: string) {
			if (this._label != value) {
				this._label = value;
				this._changed = true;
				this.invalidate();
			}
		}
		public get fontSize(): number {
			return this._fontSize;
		}
		public set fontSize(value: number) {
			this._fontSize = value;
		}
		public get fontFamily(): string {
			return this._fontFamily;
		}
		public set fontFamily(value: string) {
			this._fontFamily = value;
		}
		public get textField(): Label {
			return this._labelDisplay;
		}

		public get toggle(): boolean {
			return this._toggle;
		}
		public set toggle(value: boolean) {
			this._toggle = value;
		}
		public get selected(): boolean {
			return this._selected;
		}
		public set selected(value: boolean) {
			if (this._selected != value) {
				this._selected = value;
				if (this._toggle) {
					this._changed = true;
					this.invalidate();
				}
			}
		}
		public set colors(value: Array<number>) {
			this._colors = value;
		}
		public get colors(): Array<number> {
			return this._colors;
		}
		public set stateNum(value: number) {
			this._stateNum = value;
		}
		public get stateNum(): number {
			return this._stateNum;
		}
		public dispose(): void {
			if (!this._disposed) {
				this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			}
		}
		public get enabled(): boolean {
			return this._enabled;
		}
		public set enabled(value: boolean) {
			if (this._enabled != value) {
				this._enabled = value;
				this.touchChildren = this.touchEnabled = this._enabled;
				this._stateChanged = true;
				this.invalidate();
			}
		}

		public get stroke(): number {
			return this._stroke;
		}
		public set stroke(value: number) {
			if (this._stroke != value) {
				this._stroke = value;
				this.invalidate();
			}
		}

		public get strokeColor(): number {
			return this._strokeColor;
		}
		public set strokeColor(value: number) {
			if (this._strokeColor != value) {
				this._strokeColor = value;
				this.invalidate();
			}
		}
		public get strokeColors(): number[] {
			return this._strokeColors;
		}
		public set strokeColors(value: number[]) {
			if (this._strokeColors != value) {
				this._strokeColors = value;
			}
		}
		public get bold(): boolean {
			return this._bold;
		}
		public set bold(value: boolean) {
			if (this._bold != value) {
				this._bold = value;
				this.invalidate();
			}
		}

		public get fontNumWidthCfgs(): number[] {
			return this._fontNumWidthCfgs;
		}
		public set fontNumWidthCfgs(value: number[]) {
			this._fontNumWidthCfgs = value;
		}

		public get isLableReplace2Zh(): boolean {
			return this._isLableReplace2Zh;
		}
		public set isLableReplace2Zh(value: boolean) {
			this._isLableReplace2Zh = value;
		}

	}
}