namespace LUI {
	export class VSliderStyle {
		public static skin: string = "VSlider#skin";
		public static thumbSkin: string = "VSlider#thumb#skin";
	}
	export class VSlider extends Slider {
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
			this.orientation=SliderOrientation.VERTICAL;
		}
		protected preinitialize(): void {
			super.preinitialize();
		}
		protected setDefaultStyle(): void {
			if (StyleManager.hasDefaultStyle(VSliderStyle.skin))
				this.skin = StyleManager.getDefaultStyle(VSliderStyle.skin);
			if (StyleManager.hasDefaultStyle(VSliderStyle.thumbSkin))
				this._thumb.skin = StyleManager.getDefaultStyle(VSliderStyle.thumbSkin);
		}
	}
}