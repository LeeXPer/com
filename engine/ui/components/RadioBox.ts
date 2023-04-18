namespace LUI {
	export class RadioBoxStyle {
		public static margin: string = "RadioBox#margin";
		public static skin: string = "RadioBox#skin";
		public static colors: string = "RadioBox#label#colors";
		public static fontSize: string = "RadioBox#label#fontSize";
	}
	export class RadioBox extends CheckBox {
		public constructor(p?: egret.DisplayObjectContainer, label?: string) {
			super(p, label);
		}
		protected setDefaultStyle(): void {
			super.setDefaultStyle();//继承CheckBox样式
			if (StyleManager.hasDefaultStyle(RadioBoxStyle.skin))
				this.skin = StyleManager.getDefaultStyle(RadioBoxStyle.skin);
			if (StyleManager.hasDefaultStyle(RadioBoxStyle.margin))
				this.margin.copyForm(StyleManager.getDefaultStyle(RadioBoxStyle.margin));
			if (StyleManager.hasDefaultStyle(RadioBoxStyle.colors))
				this.colors = StyleManager.getDefaultStyle(RadioBoxStyle.colors);
			if (StyleManager.hasDefaultStyle(RadioBoxStyle.fontSize)) {
				this.fontSize = StyleManager.getDefaultStyle(RadioBoxStyle.fontSize);
			}
		}
	}
}