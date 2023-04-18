namespace LUI {
	export class LabelItemRenderer extends ItemRenderer {
		protected _label: Label;
		protected _colors: Array<number>;
		protected _sizes: Array<number>;
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
		}
		protected createChildren(): void {
			super.createChildren();
			this._label = new Label(this);
			this._colors = [0xffffff, 0xd6d6d6];
			let fontSize = StyleManager.getDefaultStyle(LabelStyle.fontSize);
			this._sizes = [fontSize, fontSize];
		}
		protected draw(): void {
			if (this._changed) {
				this._label.textAlign = "center";
				this._label.size(this._width, this._height);
				this._stateChanged = true;
			}
			super.draw();
		}
		protected drawStateView(): void {
			super.drawStateView();
			this.graphics.clear();
			this._label.textColor = this._colors[this._selected ? 1 : 0];
			this._label.fontSize = this._sizes[this._selected ? 1 : 0];
		}
		protected drawDataView(): void {
			super.drawDataView();
			if (this._data != null && this._data.hasOwnProperty("label"))
				this._label.htmlText = this.data.label;
		}
	}
}