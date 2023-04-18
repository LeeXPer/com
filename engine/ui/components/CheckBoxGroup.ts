namespace LUI {
	export class CheckBoxGroup extends egret.EventDispatcher {
		private _children: Array<ISelect>;
		private _index: number;
		private _target: ISelect;
		public constructor(index: number = -1, children: Array<ISelect>) {
			super();
			this._index = index;
			this._children = children;
			for (let child of this._children) {
				child.addEventListener(egret.Event.CHANGE, this.onChangedHandler, this);
			}
			if (index >= 0)
				this.update();
		}

		private onChangedHandler(e: egret.Event): void {
			this._index = this._children.indexOf(e.target);
			this.update();
			this.dispatchEvent(e);
		}
		private update(): void {
			for (let child of this._children) {
				child.selected = false;
			}
			if (this._index >= 0 && this._index < this._children.length) {
				this._target = this._children[this._index];
				this._target.selected = true;
			}
			else {
				if(this._target) this._target.selected = false;
				this._index = -1;
				this._target = null;
			}
		}

		public get target(): ISelect {
			return this._target;
		}

		public set index(value: number) {
			if (this._index != value) {
				this._index = value;
				this.update();
			}
		}

		public get index(): number {
			return this._index;
		}

		public get numChildren(): number {
			return this._children.length;
		}

		public get children():Array<ISelect>
		{
			return this._children;
		}
		public dispose(): void {
			for (let child of this._children) {
				child.removeEventListener(egret.Event.CHANGE, this.onChangedHandler, this);
			}
			this._children = null;
			this._target = null;
		}

	}
}