namespace LUI {
	export class ItemRenderer extends Component implements IItemRenderer {
		protected _selected: boolean = false;
		protected _itemIndex: number = -1;
		protected _touchCaptured: boolean;
		protected _stateChanged: boolean;
		protected _dataChanged: boolean;

		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
		}
		protected initialize(): void {
			super.initialize();
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			this._stateChanged = true;
		}
		protected draw(): void {
			if (this._stateChanged) {
				this.drawStateView();
			}
			if (this._dataChanged) {
				this.drawDataView();
			}
			super.draw();
		}
		protected drawStateView(): void {
			this._stateChanged = false;
		}
		protected drawDataView(): void {
			this._dataChanged = false;
		}
		protected onTouchBegin(event: egret.TouchEvent): void {
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._touchCaptured = true;
			this._stateChanged = true;
			this.invalidate();
			event.updateAfterEvent();
		}
		private onStageTouchEnd(event: egret.Event): void {
			let stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._touchCaptured = false;
			this._stateChanged = true;
			this.invalidate();
		}
		protected onTouchCancle(event: egret.TouchEvent): void {
			this._touchCaptured = false;
			let stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			this._stateChanged = true;
			this.invalidate();
		}
		public get selected(): boolean {
			return this._selected;
		}

		public set selected(value: boolean) {
			if (this._selected != value) {
				this._selected = value;
				this._stateChanged = true;
				this.invalidate();
			}
		}
		public get itemIndex(): number {
			return this._itemIndex;
		}

		public set itemIndex(value: number) {
			if (this._itemIndex == value)
				return;
			this._itemIndex = value;
		}
		/**填充数据 */
		public get data(): any {
			return this._data;
		}
		public set data(value: any) {
			if (this._data !== value) {
				this._data = value;
			}
			this._dataChanged = true;
			this.invalidate();
		}
		protected getCurrentState(): string {
			let state = "up";
			if (this._touchCaptured) {
				state = "down";
			}
			if (this._selected) {
				return state == "disabled" ? "disabled" : "down";
			}
			return state;
		}
		public dispose() {
			if (!this._disposed) {
				this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
				super.dispose();
			}
		}
		public reset(): void {
			this._data = null;
			this._itemIndex = -1;
			this.selected = false;
		}

	}
}