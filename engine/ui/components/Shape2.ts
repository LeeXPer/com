namespace LUI {
	export class Shape2 extends egret.Shape implements IComponent {
		protected _data: any;
		public constructor(p: egret.DisplayObjectContainer = null) {
			super();
			// name = LUI.NameUtil.createUniqueName(this);
			if (p != null) {
				p.addChild(this);
			}
		}
		public get enabled(): boolean {
			return true;
		}
		public set enabled(value: boolean) {

		}
		public get data(): any {
			return this._data;
		}
		public set data(value: any) {
			this._data = value;
		}

		public dispose() {
			this._data = null;
		}
		public move(x: number, y: number) {
			this.x = x;
			this.y = y;
		}
		public get rect(): egret.Rectangle {
			return new egret.Rectangle(this.x, this.y, this.width, this.height);
		}

		public size(w: number, h: number) {
			this.width = w;
			this.height = h;
		}
	}
}