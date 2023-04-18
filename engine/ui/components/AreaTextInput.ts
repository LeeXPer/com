module LUI {
	export class AreaTextInput extends Component {
		protected _textField: egret.TextField;

		protected _fontFamily: string = "";
		protected _italic: boolean = false;
		protected _fontSize: number;
		protected _bold: boolean;
		protected _textAlign: string = "left";
		protected _verticalAlign: string = "top";
		protected _textColor: number;
		protected _disabledColor: number;
		protected _leading: number;
		protected _styleChanged: boolean;
		protected _background: egret.Bitmap;
		protected _prompt: string;
		protected _promptColor: number;
		protected _bgVisible: boolean = true;

		public constructor(p?: egret.DisplayObjectContainer, promptText?: string) {
			super(p);
			if (promptText) {
				this._prompt = promptText;
				this.text = this._prompt;
			}
		}
		protected preinitialize(): void {
			super.preinitialize();
			this._defaultHeight = 30;
			this._defaultWidth = 100;
			this._width = this._defaultWidth;
			this._height = this._defaultHeight;
		}
		protected createChildren(): void {
			super.createChildren();
			this._textField = new egret.TextField();
			this.addChild(this._textField);
			this._textField.height = 22;
			this._textField.filters = StyleManager.defaultTextFilter;
		}
		protected initialize(): void {
			super.initialize();
			this._styleChanged = true;
			this._textField.touchEnabled = true;
			this._textField.type = egret.TextFieldType.INPUT;
			this._textField.multiline = true;
			this._textField.wordWrap = true;
			this._textField.addEventListener(egret.FocusEvent.FOCUS_IN, this.focusInHandler, this);
			this._textField.addEventListener(egret.FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
			this._textField.addEventListener(egret.Event.CHANGE, this.changedHandler, this);
			if (PublicUtils.checkWX())
				this._textField.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.focusInHandler, this);
		}
		protected draw(): void {
			if (this._styleChanged) {
				this._styleChanged = false;
				this.changeStyle();
			}
			super.draw();
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(TextInputStyle.skin))
				this.skin = StyleManager.getDefaultStyle(TextInputStyle.skin);
			if (StyleManager.hasDefaultStyle(TextInputStyle.margin))
				this.margin.copyForm(StyleManager.getDefaultStyle(TextInputStyle.margin));
		}
		protected changeStyle(): void {
			this._textField.fontFamily = this._fontFamily || StyleManager.getDefaultStyle(LabelStyle.fontFamily);
			this._textField.size = isNaN(this._fontSize) ? StyleManager.getDefaultStyle(LabelStyle.fontSize) : this._fontSize;
			this._textField.italic = this._italic;
			this._textField.textAlign = this._textAlign;
			this._textField.verticalAlign = this._verticalAlign;
			this._textField.lineSpacing = isNaN(this._leading) ? StyleManager.getDefaultStyle(LabelStyle.leading) : this._leading;
			if (this._enabled) {
				if (this.text == this._prompt) {
					if (!isNaN(this._promptColor))
						this._textField.textColor = this._promptColor;
					else if (StyleManager.hasDefaultStyle(TextInputStyle.promptColor))
						this._textField.textColor = StyleManager.getDefaultStyle(TextInputStyle.promptColor);
					else
						this._textField.textColor = 0x999999;
				}
				else {
					this._textField.textColor = isNaN(this._textColor) ? StyleManager.getDefaultStyle(LabelStyle.textColor) : this._textColor;
				}
			}
			else
				this._textField.textColor = isNaN(this._disabledColor) ? StyleManager.getDefaultStyle(LabelStyle.disabledColor) : this._disabledColor;

			this._textField.bold = this._bold;
		}
		protected drawSkin(): void {
			if (this._skin && this._skin.background) {
				StyleManager.assetAdapter.getAsset(this._skin.background, this.skinAssetReadyHandler, this);
			} else {
				if (this._background && this.contains(this._background)) {
					this.removeChild(this._background);
					this._background = null;
				}
			}
		}
		private skinAssetReadyHandler(data: any, source: any): void {
			if (source !== this._skin.background)
				return;
			if (!egret.is(data, "egret.Texture")) {
				return;
			}
			if (this._background == null) {
				this._background = new egret.Bitmap();
				this.addChildAt(this._background, 0);
			}
			else {
			}
			this._background.scale9Grid = this.scale9Grid;
			this._background.width = this.width;
			this._background.height = this.height;
			this._background.$setBitmapData(<egret.Texture>data);
			this._background.visible = this.bgVisible;
		}
		protected measureSize(): void {
			if (!isNaN(this._explicitWidth))
				this._textField.width = this._width - this._margin.left - this._margin.right;
			else
				this._textField.width = 1000;

			if (isNaN(this._explicitWidth)) {
				if (isNaN(this._defaultWidth))
					this._width = this._textField.textWidth + this._margin.left + this._margin.right;
				else
					this._width = this._defaultWidth;
			}

			if (isNaN(this._explicitHeight)) {
				if (isNaN(this._defaultHeight))
					this._height = this._textField.textHeight + this._margin.bottom + this._margin.top;
				else
					this._height = this._defaultHeight;
			}

			this._textField.width = this._width - this._margin.left - this._margin.right;
			this._textField.height = this._height - this._margin.top - this._margin.bottom;

			this._textField.x = this._margin.left;
			this._textField.y = this._margin.top;
		}

		public appendElement(element: egret.ITextElement): void {
			this._textField.appendElement(element);
			this._changed = true;
			// this.invalidate();
			this.drawDirectly();
		}

		public appendText(text: string): void {
			this._textField.appendText(text);
			this._changed = true;
			// this.invalidate();
			this.drawDirectly();
		}
		public set text(value: string) {
			this._textField.text = value;
			this._changed = true;
			// this.invalidate();
			this.drawDirectly();
		}
		public get text(): string {
			return this._textField.text;
		}
		//用于赋值text触发egret.Event.CHANGE调用
		public setText(value: string) {
			this.text = value;
			let stageText = this._textField.inputUtils.stageText;
			egret.Event.dispatchEvent(stageText, "updateText", false);
		}
		public set htmlText(value: string) {
			this.textFlow = new egret.HtmlTextParser().parser(value);
		}
		public set textFlow(textArr: Array<egret.ITextElement>) {
			this._textField.textFlow = textArr;
			this._changed = true;
			// this.invalidate();
			this.drawDirectly();
		}
		public get textFlow(): Array<egret.ITextElement> {
			return this._textField.textFlow;
		}
		public get textField(): egret.TextField {
			return this._textField;
		}
		/**
		 * 字体
		 */
		public get fontFamily(): string {
			return this._fontFamily;
		}

		public set fontFamily(value: string) {
			if (this._fontFamily != value) {
				this._fontFamily = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		/**
		 * 字号大小
		 */
		public get fontSize(): number {

			return this._fontSize;
		}

		public set fontSize(value: number) {
			if (value === undefined)
				value = 0;
			if (value != this._fontSize) {
				this._fontSize = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		/**
		 * 是否显示为粗体，默认false。
		 */
		public get bold(): boolean {
			return this._bold;
		}

		public set bold(value: boolean) {
			if (this._bold != value) {
				this._bold = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		/**
		 * 是否显示为斜体，默认false。
		 * @member egret.gui.TextBase#italic
		 */
		public get italic(): boolean {
			return this._italic;
		}

		public set italic(value: boolean) {
			if (this._italic != value) {
				this._italic = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		/**
		 * 文字的水平对齐方式 ,请使用HorizontalAlign中定义的常量。
		 * 默认值：HorizontalAlign.LEFT。
		 * @member egret.gui.TextBase#textAlign
		 */
		public get textAlign(): string {
			return this._textAlign;
		}

		public set textAlign(value: string) {
			if (this._textAlign != value) {
				this._textAlign = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}
		public get verticalAlign(): string {
			return this._verticalAlign;
		}

		public set verticalAlign(value: string) {
			if (this._verticalAlign != value) {
				this._verticalAlign = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}
		/**
		 * 文本颜色
		 */
		public get textColor(): number {
			return this._textColor;
		}

		public set textColor(value: number) {
			if (this._textColor != value) {
				this._textColor = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		/**
		 * 文本颜色(enabled=false时文本颜色);
		 */
		public get disabledColor(): number {
			return this._disabledColor;
		}

		public set disabledColor(value: number) {
			if (this._disabledColor != value) {
				this._disabledColor = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		/**
		 * 行间距
		 */
		public get leading(): number {
			return this._leading;
		}
		public set leading(value: number) {
			if (this._leading != value) {
				this._leading = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}

		public set filters(value: Array<egret.Filter>) {
			this._textField.filters = value;
		}
		public get filter(): Array<egret.Filter> {
			return this._textField.filters;
		}
		/**
		 * 文本全部显示时的高度（无行间距）
		 */
		public get textHeight(): number {
			return this._textField.textHeight;
		}

        /**
         * 文本全部显示时宽
         */
		public get textWidth(): number {
			return this._textField.textWidth;
		}
		/**设置此组件的焦点 */
		public setFocus(): void {
			if (this._enabled)
				this._textField.setFocus();
		}
		public set strokeColor(v: number) {
			this._textField.strokeColor = v;
		}
		public set stroke(v: number) {
			this._textField.stroke = v;
		}
		// protected invalidate(): void {
		// 	if (!this._disposed) {
		// 		// StyleManager.stage.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
		// 		this.drawDirectly();
		// 	}
		// }

		protected focusInHandler(evt: egret.FocusEvent): void {
			if (this.text == this._prompt) {
				this.text = "";
			}
			this.changeStyle();
			if(window['inputFocusIn'])
				window['inputFocusIn'](evt);
		}
		protected focusOutHandler(evt: egret.FocusEvent): void {
			if (this.text == "") {
				this.text = this._prompt;
			}
			this.changeStyle();
			if(window['inputFocusOut'])
				window['inputFocusOut'](evt);
		}
		protected changedHandler(evt: egret.Event): void {
			this.dispatchEvent(evt);
		}
		public get restrict(): string {
			return this._textField.restrict;
		}
		public set restrict(value: string) {
			this._textField.restrict = value;
		}
		public get maxChars(): number {
			return this._textField.maxChars;
		}
		public set maxChars(value: number) {
			this._textField.maxChars = value;
		}
		public set displayAsPassword(value: boolean) {
			this._textField.displayAsPassword = value;
		}
		public get displayAsPassword(): boolean {
			return this._textField.displayAsPassword;
		}
		public get prompt(): string {
			return this._prompt;
		}
		public set prompt(value: string) {
			this._prompt = value;
			if (this.text == "") {
				this.text = this._prompt;
			}
		}
		public get promptColor(): number {
			return this._promptColor;
		}
		public set promptColor(value: number) {
			if (this._promptColor != value) {
				this._promptColor = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}
		public get realText(): string {
			return this.text == this.prompt ? "" : this.text;
		}

		public get bgVisible(): boolean {
			return this._bgVisible;
		}
		public set bgVisible(value: boolean) {
			this._bgVisible = value;
			if (this._background) this._background.visible = value;
		}

		public dispose() {
			if (!this._disposed) {
				this._textField.removeEventListener(egret.FocusEvent.FOCUS_IN, this.focusInHandler, this);
				this._textField.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
				if (PublicUtils.checkWX())
					this._textField.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.focusInHandler, this);
				super.dispose();
			}
		}
		public reset() {
			this.text = this._prompt;
			this.changeStyle();
		}
	}
}