namespace LUI {
	export enum SliderOrientation {
		HORIZONTAL,
		VERTICAL
	}
	export class Slider extends Component {
		protected _value: number = 0;
		protected _max: number = 100;
		protected _min: number = 0;
		/**方向0:水平，1垂直 */
		protected _orientation: number;
		protected _thumb: Button;
		protected _track: Image;
		/**增量 */
		protected _snapInterval: number = 1;
		protected _clickOffsetX: number;
		protected _clickOffsetY: number;
		protected _isReady: boolean = false;
        protected _touchCaptured: boolean = false;
		protected _thumbSize: number = -1;
		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
		}
		protected createChildren(): void {
			super.createChildren();
			this._track = new Image(this);
			this._track.maintainAspectRatio = false;
			this._thumb = new Button(this);
			this._thumb.stateNum = 2;
		}
		protected initialize(): void {
			super.initialize();
			this._thumb.addEventListener(ResizeEvent.RESIZE, this.thumbResizeHandler, this);
			this._track.addEventListener(ResizeEvent.RESIZE, this.trackResizeHandler, this);
			this._thumb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this, true);
			this._track.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this, true);
		}
		public setSliderParams(min: number, max: number, value: number, thumbSize: number = -1): void {
			this._thumbSize = thumbSize;
			if (this._thumbSize > 0) {
				this._thumbSize = Math.max(this._thumbSize, 20);
			}
			this.min = min;
			this.max = max;
			if (this._value != value) {
				this.value = value;
			}
			else {
				this.positionThumb();
			}

		}
		protected draw() {
			if (this._changed) {
				this._thumb.visible = this._max > this._min;
				this._enabled = this._thumb.visible;
			}
			super.draw();
		}
		protected drawSkin(): void {
			if (this._skin) {
				this._track.source = this._skin.background;
				this._track.scale9Grid = this._skin.scale9Grid;
			}
		}
		protected measureSize(): void {
			let oldReady: boolean = this._isReady;
			if (this._orientation == SliderOrientation.VERTICAL) {
				if (!isNaN(this._explicitHeight)) {
					this._track.height = this._height;
				}
				else {
					this._track.height = this._defaultHeight;
				}
				this._width = Math.max(this._track.width, this._thumb.width);
				this._height = this._track.height;
				this._thumb.x = (this._width - this._thumb.width) / 2;
				this._track.x = (this._width - this._track.width) / 2;
				this._isReady = this._thumb.width > 0;
			}
			else {
				if (!isNaN(this._explicitWidth)) {
					this._track.width = this._width;
				}
				else {
					this._track.width = this._defaultWidth;
				}
				this._height = Math.max(this._track.height, this._thumb.height);
				this._width = this._track.width;
				this._thumb.y = (this._height - this._thumb.height) / 2;
				this._track.y = (this._height - this._track.height) / 2;
				this._isReady = this._thumb.height > 0;
			}
			if (oldReady != this._isReady)//强制发送resize事件
			{
				this._oldWidth = 0;
				this._oldHeight = 0;
			}
		}
		private thumbResizeHandler(evt: ResizeEvent): void {
			this.measureSize();
			this.positionThumb();
			this.dispatchResizeEvent();
		}
		private trackResizeHandler(evt: ResizeEvent): void {
			this.measureSize();
			this.dispatchResizeEvent();
		}
		protected onThumbTouchBegin(event: egret.TouchEvent): void {
			if (!this._isReady)
				return;
			this._touchCaptured = true;
            let stage = this.$stage;
            stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            let clickOffset = this.thumb.globalToLocal(event.stageX, event.stageY, egret.$TempPoint);
            this._clickOffsetX = clickOffset.x;
            this._clickOffsetY = clickOffset.y;
			event.stopPropagation();
        }
        private onStageTouchMove(event: egret.TouchEvent): void {
            let moveStageX = event.$stageX;
            let moveStageY = event.$stageY;
            let p = this._track.globalToLocal(moveStageX, moveStageY, egret.$TempPoint);
            let newValue = this.pointToValue(p.x - this._clickOffsetX, p.y - this._clickOffsetY);
			newValue = this.nearestValidValue(newValue, this._snapInterval);
			if (newValue != this._value) {
				this._value = newValue;
				this.positionThumb();
				this.dispatchEventWith(egret.Event.CHANGE);
			}
            event.updateAfterEvent();
        }
		protected onStageTouchEnd(event: egret.Event): void {
			this._touchCaptured = false;
            let stage: egret.Stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
        }
		protected onTrackTouchBegin(event: egret.TouchEvent): void {
			if (!this._isReady)
				return;
            let thumbW = this.thumb ? this.thumb.width : 0;
            let thumbH = this.thumb ? this.thumb.height : 0;
            let offsetX = event.$stageX - (thumbW / 2);
            let offsetY = event.$stageY - (thumbH / 2);
            let p = this._track.globalToLocal(offsetX, offsetY, egret.$TempPoint);

            let newValue = this.pointToValue(p.x, p.y);
            newValue = this.nearestValidValue(newValue, this._snapInterval);
			if (newValue != this._value) {
				this._value = newValue;
				this.positionThumb();
				this.dispatchEventWith(egret.Event.CHANGE);
			}
			event.stopPropagation();
        }
		protected pointToValue(x: number, y: number): number {
            let range = this._max - this._min;
            let thumbRange = 0;
			if (this._orientation == SliderOrientation.HORIZONTAL) {
				thumbRange = this._width - this._thumb.width;
				return this._min + (thumbRange != 0 ? (x / thumbRange) * range : 0);
			}
			else {
				thumbRange = this._height - this._thumb.height;
				return this._min + ((thumbRange != 0) ? ((thumbRange - y) / thumbRange) * range : 0);
			}

        }
		protected nearestValidValue(value: number, interval: number): number {
            if (interval == 0)
                return Math.max(this._min, Math.min(this._max, value));

            let maxValue = this._max - this._min;
            let scale = 1;

            value -= this._min;
            if (interval != Math.round(interval)) {
                let parts = ((1 + interval).toString()).split(".");
                scale = Math.pow(10, parts[1].length);
                maxValue *= scale;
                value = Math.round(value * scale);
                interval = Math.round(interval * scale);
            }

            let lower = Math.max(0, Math.floor(value / interval) * interval);
            let upper = Math.min(maxValue, Math.floor((value + interval) / interval) * interval);
            let validValue = ((value - lower) >= ((upper - lower) / 2)) ? upper : lower;

            return (validValue / scale) + this._min;
        }
		protected correctValue(): void {
			if (this._max > this._min) {
				this._value = Math.min(this._value, this._max);
				this._value = Math.max(this._value, this._min);
			}
			else {
				this._value = Math.max(this._value, this._max);
				this._value = Math.min(this._value, this._min);
			}
		}
		protected positionThumb(): void {
			let range: number;
			if (this._orientation == SliderOrientation.HORIZONTAL) {
				if (this._thumbSize > 0 && this._thumb.width != this._thumbSize)
					this._thumb.width = this._thumbSize;

				range = this._width - this._thumb.width;
				this._thumb.x = (this._value - this._min) / (this._max - this._min) * range;
			}
			else {
				if (this._thumbSize > 0 && this._thumb.height != this._thumbSize)
					this._thumb.height = this._thumbSize;

				range = this._height - this._thumb.height;
				this._thumb.y = range - (this._value - this._min) / (this._max - this._min) * range;
			}
		}

		public get value(): number {
			return this._value;
		}
		public set value(value: number) {
			if (this._value != value) {
				this._value = value;
				this.correctValue();
				this.positionThumb();
				this.dispatchEventWith(egret.Event.CHANGE);
			}
		}

		public get max(): number {
			return this._max;
		}
		public set max(value: number) {
			if (this._max != value) {
				this._max = value;
				this._changed = true;
				this.invalidate();
			}
		}

		public get min(): number {
			return this._min;
		}
		public set min(value: number) {
			if (this._min != value) {
				this._min = value;
				this._changed = true;
				this.invalidate();
			}
		}
		public set orientation(value: number) {
			if (this._orientation != value) {
				this._orientation = value;
				if (this._orientation == SliderOrientation.HORIZONTAL) {
					this._defaultWidth = 150;
					this._defaultHeight = 10;
				}
				else {
					this._defaultWidth = 10;
					this._defaultHeight = 150;
				}
			}
		}
		public get orientation() {
			return this._orientation;
		}
		public get thumb(): Button {
			return this._thumb;
		}
		public get snapInterval(): number {
			return this._snapInterval;
		}
		public set snapInterval(value: number) {
			this._snapInterval = value;
		}
		public get isReady(): boolean {
			return this._isReady;
		}
		public dispose() {
			if (!this._disposed) {
				this._thumb.removeEventListener(ResizeEvent.RESIZE, this.thumbResizeHandler, this);
				this._track.removeEventListener(ResizeEvent.RESIZE, this.trackResizeHandler, this);
				this._thumb.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this, true);
				this._track.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this, true);
				if (this._touchCaptured) {
					let stage = this.$stage;
					if (stage) {
						stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
						stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
					}
				}
				super.dispose();
			}
		}
	}
}