namespace LUI {
	export class LabelStyle {
		public static fontFamily: string = "Label#fontFamily";
		public static fontSize: string = "Label#fontSize";
		public static textColor: string = "Label#textColor";
		public static disabledColor: string = "Label#disabledColor";
		public static leading: string = "Label#leading";
	}
	/**
	* Label 是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由 text 属性确定。
	* 如果没有为 Label 指定宽度，则由这些显式换行符确定的最长行确定 Label 的宽度。
	* 如果指定了宽度，则指定文本将在组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。
	*/
	export class Label extends Component {
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

		public constructor(p?: egret.DisplayObjectContainer, text?: string) {
			super(p);
			this.text = text;
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
			this._textField.touchEnabled = false;
			this._textField.type = egret.TextFieldType.DYNAMIC;
			this._styleChanged = true;
		}
		protected draw(): void {
			if (this._styleChanged) {
				this._styleChanged = false;
				this.changeStyle();
			}
			super.draw();
		}
		protected changeStyle(): void {
			this._textField.fontFamily = this._fontFamily || StyleManager.getDefaultStyle(LabelStyle.fontFamily);
			this._textField.size = isNaN(this._fontSize) ? StyleManager.getDefaultStyle(LabelStyle.fontSize) : this._fontSize;
			this._textField.italic = this._italic;
			this._textField.textAlign = this._textAlign;
			this._textField.verticalAlign = this._verticalAlign;
			this._textField.lineSpacing = isNaN(this._leading) ? StyleManager.getDefaultStyle(LabelStyle.leading) : this._leading;
			if (this._enabled)
				this._textField.textColor = isNaN(this._textColor) ? StyleManager.getDefaultStyle(LabelStyle.textColor) : this._textColor;
			else
				this._textField.textColor = isNaN(this._disabledColor) ? StyleManager.getDefaultStyle(LabelStyle.disabledColor) : this._disabledColor;

			this._textField.bold = this._bold;
		}
		protected drawSkin(): void {
			if (this._skin && this._skin.background) {
				StyleManager.assetAdapter.getAsset(this._skin.background, this.skinAssetReadyHandler, this);
			}
		}
		protected skinAssetReadyHandler(data: any, source: any): void {
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
			this._textField.height = !isNaN(this._explicitHeight) ? this._height - this._margin.top - this._margin.bottom : this._textField.textHeight;

			this._textField.x = this._margin.left;
			this._textField.y = (this._height - this._margin.top - this._margin.bottom - this._textField.height) / 2 + this._margin.top;
		}

		public appendElement(element: egret.ITextElement): void {
			this._textField.appendElement(element);
			this._changed = true;
			this.invalidate();
		}

		public appendText(text: string): void {
			this._textField.appendText(text);
			this._changed = true;
			this.invalidate();
		}
		/**Label文本内容 */
		public set text(value: string) {
			this._textField.text = value;
			this._changed = true;
			this.invalidate();
		}
		public get text(): string {
			return this._textField.text;
		}
		public set htmlText(value: string) {
			this.textFlow = new egret.HtmlTextParser().parser(value);
		}
		public set textFlow(textArr: Array<egret.ITextElement>) {
			this._textField.textFlow = textArr;
			this._changed = true;
			this.invalidate();
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
				//微信下游戏移动端字体偏大，调整成差不多的大小
				// let trim = GlobalStaticConfing.platform == PlatformConst.WXGAME && DeviceUtils.IsMobile;
				// this._fontSize = trim ? value - 1.5 : value;
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

		/** 获取文本背景图 */
		public get background(): egret.Bitmap {
			return this._background;
		}

		// protected invalidate(): void {
		// 	if (!this._disposed) {
		// 		// StyleManager.stage.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
		// 		this.drawDirectly();
		// 	}
		// }
	}
}