namespace LUI {
	export class StyleManager {
		private static _stage: egret.Stage;
		/**默认文本滤镜**/
		public static defaultTextFilter: Array<egret.Filter> = null;
		public static defaultStyle: Object = {};
		public static defaultAssetAdapter: LUI.IAssetAdapter;
		public static defaultGrayFilter: Array<egret.Filter> = null;
		public static textureMap: any;
		public static defaultUIFont: string;
		public constructor() {
		}
		public static init(stage: egret.Stage, defaultUIFont: string = "simsun", defaultTextFilter: Array<egret.Filter> = null, defaultGrayFilter: Array<egret.Filter> = null): void {
			this._stage = stage;
			this.defaultUIFont = defaultUIFont;
			this.defaultGrayFilter = defaultGrayFilter;
			this.defaultTextFilter = defaultTextFilter;

			this.registerDefaultStyle(LabelStyle.textColor, 0xffffff);
			this.registerDefaultStyle(LabelStyle.disabledColor, 0x6f6a6a);
			this.registerDefaultStyle(LabelStyle.fontSize, 18);
			this.registerDefaultStyle(LabelStyle.leading, 4);
			this.registerDefaultStyle(LabelStyle.fontFamily, defaultUIFont);

			this.registerDefaultStyle(ButtonStyle.colors, [0xffffff, 0xffffcc, 0xd8d8d8]);
			this.registerDefaultStyle(ButtonStyle.margin, new Margin(10, 10, 10, 10));
			this.registerDefaultStyle(ButtonStyle.fontSize, 18);
			this.registerDefaultStyle(ButtonStyle.fontFamily, defaultUIFont);
			this.registerDefaultStyle(ButtonStyle.stroke, 1);
			this.registerDefaultStyle(ButtonStyle.strokeColors, [0x88591b, 0x88591b, 0x333333]);

			this.registerDefaultStyle(TextInputStyle.margin, new Margin(0, 5, 0, 5));
			this.registerDefaultStyle(TextInputStyle.promptColor, 0xeeeeee);

			this.defaultAssetAdapter = new DefaultAssetAdapter();
			this.textureMap = {};
		}
		public static registerDefaultStyle(styleName: string, value: any): void {
			this.defaultStyle[styleName] = value;
		}
		public static getDefaultStyle(styleName: string): any {
			if (this.defaultStyle.hasOwnProperty(styleName))
				return this.defaultStyle[styleName];
			else
				return null;
		}
		public static hasDefaultStyle(styleName: string): boolean {
			return this.defaultStyle.hasOwnProperty(styleName);
		}
		public static get stage(): egret.Stage {
			return this._stage;
		}
		public static get assetAdapter(): LUI.IAssetAdapter {
			let adapter: LUI.IAssetAdapter = egret.getImplementation("LUI.IAssetAdapter");
			if (!adapter) {
				adapter = StyleManager.defaultAssetAdapter;
			}
			return adapter;
		}
	}
}