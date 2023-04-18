namespace LUI {
	export class HScrollBarStyle {
		public static skin: string = "HScrollBar#skin";
		public static thumbSkin: string = "HScrollBar#thumb#skin";
		public static upButton: string = "HScrollBar#upButton#skin";
		public static downButton: string = "HScrollBar#downButton#skin";
	}

	export class HScrollBar extends ScrollBar {
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
			this.orientation = SliderOrientation.HORIZONTAL;
		}
		protected preinitialize(): void {
			super.preinitialize();
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(HScrollBarStyle.skin))
				this.skin = StyleManager.getDefaultStyle(HScrollBarStyle.skin);
			if (StyleManager.hasDefaultStyle(HScrollBarStyle.thumbSkin))
				this.slider.thumb.skin = StyleManager.getDefaultStyle(HScrollBarStyle.thumbSkin);
			if (StyleManager.hasDefaultStyle(HScrollBarStyle.upButton))
				this.upButton.skin = StyleManager.getDefaultStyle(HScrollBarStyle.upButton);
			if (StyleManager.hasDefaultStyle(HScrollBarStyle.downButton))
				this.downButton.skin = StyleManager.getDefaultStyle(HScrollBarStyle.downButton);
		}
	}
}