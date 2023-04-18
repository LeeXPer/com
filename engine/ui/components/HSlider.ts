namespace LUI {
	export class HSliderStyle {
		public static skin: string = "HSlider#skin";
		public static thumbSkin: string = "HSlider#thumb#skin";
	}
	export class HSlider extends Slider {
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
			this.orientation=SliderOrientation.HORIZONTAL;
		}
		protected preinitialize(): void {
			super.preinitialize();
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(HSliderStyle.skin))
				this.skin = StyleManager.getDefaultStyle(HSliderStyle.skin);
			if (StyleManager.hasDefaultStyle(HSliderStyle.thumbSkin))
				this._thumb.skin = StyleManager.getDefaultStyle(HSliderStyle.thumbSkin);
		}
	}
}