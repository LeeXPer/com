namespace LUI {
	export class TextInputStyle {
		public static margin: string = "TextInput#margin";
		public static fontFamily: string = "TextInput#fontFamily";
		public static fontSize: string = "TextInput#fontSize";
		public static textColor: string = "TextInput#textColor";
		public static disabledColor: string = "TextInput#disabledColor";
		public static promptColor: string = "TextInput#promptColor";
		public static skin: string = "TextInput#skin";
	}

	export class TextInput extends Label {
		protected _prompt: string;
		protected _textPromptColor: number;
		protected _verticalTop: boolean;
		protected _focusIn: boolean;
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
		}
		protected initialize(): void {
			super.initialize();
			this._textField.touchEnabled = true;
			this._textField.type = egret.TextFieldType.INPUT;
			this._textField.multiline = false;
			this._textField.wordWrap = false;
			this._textField.addEventListener(egret.FocusEvent.FOCUS_IN, this.focusInHandler, this);
			this._textField.addEventListener(egret.FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
			this._textField.addEventListener(egret.Event.CHANGE, this.changedHandler, this);
			if (PublicUtils.checkWX())
				this._textField.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.focusInHandler, this)
		}
		private isRunInMacOSSafari(): boolean {
			if (egret.Capabilities.os == "Mac OS" && egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
				var ua: string = navigator.userAgent.toString();
				if (ua.indexOf('Safari') != -1 && ua.indexOf('Chrome') == -1)
					return true;
			}
			return false;
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(TextInputStyle.skin))
				this.skin = StyleManager.getDefaultStyle(TextInputStyle.skin);
			if (StyleManager.hasDefaultStyle(TextInputStyle.margin))
				this.margin.copyForm(StyleManager.getDefaultStyle(TextInputStyle.margin));
		}
		protected changeStyle(): void {
			super.changeStyle();
			if (StyleManager.hasDefaultStyle(TextInputStyle.fontFamily))
				this._textField.fontFamily = StyleManager.getDefaultStyle(TextInputStyle.fontFamily);
			if (StyleManager.hasDefaultStyle(TextInputStyle.fontSize))
				this._textField.size = StyleManager.getDefaultStyle(TextInputStyle.fontSize);

			if (this._enabled) {
				if (this.text == this._prompt) {
					if (!isNaN(this._textPromptColor))
						this._textField.textColor = this._textPromptColor;
					else if (StyleManager.hasDefaultStyle(TextInputStyle.promptColor))
						this._textField.textColor = StyleManager.getDefaultStyle(TextInputStyle.promptColor);
					else
						this._textField.textColor = 0x999999;
				}
				else {
					this._textField.textColor = isNaN(this._textColor) ? StyleManager.getDefaultStyle(LabelStyle.textColor) : this._textColor;
				}
			}
			else {
				if (StyleManager.hasDefaultStyle(TextInputStyle.disabledColor))
					this._textField.textColor = StyleManager.getDefaultStyle(TextInputStyle.disabledColor);
			}
		}
		protected measureSize(): void {
			super.measureSize();
			this._textField.height = this._textField.textHeight + 20;
			if (this._verticalTop) {
				this._textField.height = this.height - this._margin.top;
				this._textField.y = this._margin.top;
			}
		}
		protected focusInHandler(evt: egret.FocusEvent): void {
			if (this.text == this._prompt) {
				this.text = "";
			}
			if (this.text == "" && this.isRunInMacOSSafari()) {
				this.text = " ";
			}
			this.changeStyle();
			this._focusIn = true;
			if(window['inputFocusIn'])
				window['inputFocusIn'](evt);
		}
		protected focusOutHandler(evt: egret.FocusEvent): void {
			if (this.isRunInMacOSSafari() && this.text != "" && this.text.charAt(0) == " ") {
				this.text = this.text.substr(1);
			}
			if (this.text == "") {
				this.text = this._prompt;
			}
			this.changeStyle();
			this._focusIn = false;
			if(window['inputFocusOut'])
				window['inputFocusOut'](evt);
		}
		protected changedHandler(evt: egret.Event): void {
			this.dispatchEvent(evt);
		}
		protected skinAssetReadyHandler(data: any, source: any): void 
		{
			super.skinAssetReadyHandler(data,source);
			this._background.visible = this.bgVisible;
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
		public get text(): string {
			return this._textField.text || "";
		}
		public set text(value: string) {
			this._textField.text = value;
			this._changed = true;
			this.invalidate();
		}
		//用于赋值text触发egret.Event.CHANGE调用
		public setText(value: string) {
			this.text = value;
			let stageText = this._textField.inputUtils.stageText;
			egret.Event.dispatchEvent(stageText, "updateText", false);
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
				this._styleChanged = true;
				this.text = this._prompt;
			}
		}
		public setPrompt(value: string){
			this._prompt = value;
			this._styleChanged = true;
			this.text = this._prompt;
		}
		/**
		 * 文本颜色
		 */
		public get textPromptColor(): number {
			return this._textPromptColor;
		}

		public set textPromptColor(value: number) {
			if (this._textPromptColor != value) {
				this._textPromptColor = value;
				this._styleChanged = true;
				this.invalidate();
			}
		}
		public set verticalTop(value: boolean) {
			this._verticalTop = value;
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
		public get focusIn(): boolean {
			return this._focusIn;
		}
	}
}