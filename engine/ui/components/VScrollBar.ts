namespace LUI {
	export class VScrollBarStyle {
		public static skin: string = "VScrollBar#skin";
		public static thumbSkin: string = "VScrollBar#thumb#skin";
		public static upButton: string = "VScrollBar#upButton#skin";
		public static downButton: string = "VScrollBar#downButton#skin";
	}

	export class VScrollBar extends ScrollBar {
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
			this.orientation = SliderOrientation.VERTICAL;
		}
		protected preinitialize(): void {
			super.preinitialize();
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(VScrollBarStyle.skin))
				this.skin = StyleManager.getDefaultStyle(VScrollBarStyle.skin);
			if (StyleManager.hasDefaultStyle(VScrollBarStyle.thumbSkin))
				this.slider.thumb.skin = StyleManager.getDefaultStyle(VScrollBarStyle.thumbSkin);
			if (StyleManager.hasDefaultStyle(VScrollBarStyle.upButton))
				this.upButton.skin = StyleManager.getDefaultStyle(VScrollBarStyle.upButton);
			if (StyleManager.hasDefaultStyle(VScrollBarStyle.downButton))
				this.downButton.skin = StyleManager.getDefaultStyle(VScrollBarStyle.downButton);
		}
	}
}