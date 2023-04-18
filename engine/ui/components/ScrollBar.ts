namespace LUI {
	export enum ScrollBarPolicy {
		AUTO,
		ON,
		OFF
	}
	export class ScrollBar extends Component {
		/**
	   * 开始触发滚动的阈值（以像素为单位），当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动。
	   */
		public static scrollThreshold: number = 5;
		/**方向0:水平，1垂直 */
		protected _orientation: number;
		protected _slider: Slider;
		/**上按钮 */
		protected _upButton: Button;
		/**下按钮 */
		protected _downButton: Button;
		/**是否显示上下翻页按钮 */
		protected _showButtons: boolean = false;
		/** 是否显示滚动条 */
		protected _needScroller: boolean = true;
		/**滚动条要控制的对象 */
		protected _viewport: IViewport;
		protected _isReady: boolean;
		protected _isUpButtonTouched: boolean;
		protected _scrollBarPolicy: number;
		protected _canScroll: boolean;
		protected _touchScroll: TouchScroll;
		protected _touchStartX: number;
		protected _touchStartY: number;
		protected _touchMoved: boolean;
		protected _touchCancle: boolean;
		/**
		* 记录按下的对象，touchCancle时使用
		*/
		private downTarget: egret.DisplayObject;
		private _changEndFun: Function;
		private _changEndAny: any;
		private _isTouchLoop: boolean;

		public constructor(p?: egret.DisplayObjectContainer) {
			super(p);
		}
		protected preinitialize(): void {
			super.preinitialize();
			this.scrollBarPolicy = ScrollBarPolicy.AUTO;
		}
		protected createChildren(): void {
			super.createChildren();
			this._slider = new Slider(this);
			this._upButton = new Button(this);
			this._downButton = new Button(this);
			this._slider.visible = false;
			this._upButton.visible = false;
			this._downButton.visible = false;
		}
		protected initialize(): void {
			super.initialize();
			this._slider.addEventListener(ResizeEvent.RESIZE, this.sliderResizeHandler, this);
			this._slider.addEventListener(egret.Event.CHANGE, this.sliderValueChangedHandler, this);
			this._upButton.addEventListener(ResizeEvent.RESIZE, this.upButtonResizeHandler, this);
			this._upButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.upButtonTouchedHandler, this);
			this._downButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.downButtonTouchedHandler, this);
			this._touchScroll = new TouchScroll(this.touchScrollUpdateHandler, this.touchScrollEndHandler, this);
			this.isTouchLoop = true;
		}
		protected drawSkin(): void {
			if (this._skin) {
				this._slider.skin = this._skin;
			}
		}
		protected measureSize(): void {
			if (this._orientation == SliderOrientation.VERTICAL) {
				if (isNaN(this._explicitHeight)) {
					this._height = this._defaultHeight;
				}
				if (this._showButtons) {
					this._width = this._upButton.width;
					this._upButton.move(0, 0);
					this._slider.height = this._height - this._upButton.height * 2;
					this._slider.move((this._width - this._slider.width) / 2, this._upButton.height);
					this._downButton.move(0, this._height - this._upButton.height);
					this._isReady = this._slider.isReady && this._upButton.height > 0;
				}
				else {
					this._slider.height = this._height;
					this._width = this._slider.width;
					this._slider.move(0, 0);
					this._isReady = this._slider.isReady;
				}
			}
			else {
				if (isNaN(this._explicitWidth)) {
					this._width = this._defaultWidth;
				}
				if (this._showButtons) {
					this._height = this._upButton.height;
					this._slider.width = this._width - this._upButton.width * 2;
					this._slider.move(this._upButton.width, (this._height - this._slider.height) / 2);
					this._downButton.move(0, 0);
					this._upButton.move(this._width - this._upButton.width, 0);
					this._isReady = this._slider.isReady && this._upButton.width > 0;
				}
				else {
					this._height = this._slider.height;
					this._slider.move(0, 0);
					this._slider.width = this._width;
					this._isReady = this._slider.isReady;
				}
			}
			if (this._isReady) {
				this._slider.visible = this._needScroller;
				this._upButton.visible = this._downButton.visible = this._needScroller && this._showButtons;
			}
		}
		protected sliderResizeHandler(evt: ResizeEvent): void {
			this.measureSize();
			this.dispatchResizeEvent();
		}
		protected upButtonResizeHandler(evt: ResizeEvent): void {
			this.measureSize();
			this.dispatchResizeEvent();
		}
		protected upButtonTouchedHandler(evt: TouchEvent): void {
			if ((!this._isReady) || (!this._slider.enabled))
				return;
			this._isUpButtonTouched = true;
			let stage = this.$stage;
			stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			egret.startTick(this.loopScrollHandler, this);
		}
		protected downButtonTouchedHandler(evt: TouchEvent): void {
			if ((!this._isReady) || (!this._slider.enabled))
				return;
			this._isUpButtonTouched = false;
			let stage = this.$stage;
			stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			egret.startTick(this.loopScrollHandler, this);
		}
		protected loopScrollHandler(time: number): boolean {
			if (this._isUpButtonTouched)
				this._slider.value += this._slider.snapInterval;
			else
				this._slider.value -= this._slider.snapInterval;
			return false;
		}
		protected sliderValueChangedHandler(evt: egret.Event): void {
			if (!this._viewport)
				return;
			if (this._orientation == SliderOrientation.HORIZONTAL) {
				this._viewport.scrollH = this._slider.value + (this._viewport.contentWidth - this._viewport.width);
			}
			else {
				this._viewport.scrollV = -this._slider.value;
			}

			this.dispatchEventWith(egret.Event.CHANGE);
		}
		protected onStageTouchEnd(event: egret.Event): void {
			let stage: egret.Stage = event.$currentTarget;
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
			egret.stopTick(this.loopScrollHandler, this);
		}
		public set orientation(value: number) {
			if (this._orientation != value) {
				this._orientation = value;
				this._slider.orientation = value;
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
		public get orientation(): number {
			return this._orientation;
		}
		public get upButton(): Button {
			return this._upButton;
		}
		public get downButton(): Button {
			return this._downButton;
		}
		public set showButtons(value: boolean) {
			this._showButtons = value;
		}
		public get showButtons(): boolean {
			return this._showButtons;
		}
		/** 是否需要滚动条 */
		public get needScroller(): boolean {
			return this._needScroller;
		}
		/** 是否需要滚动条 */
		public set needScroller(value: boolean) {
			this._needScroller = value;
		}
		public get slider(): Slider {
			return this._slider;
		}
		public set scrollBarPolicy(value: number) {
			this._scrollBarPolicy = value;
		}
		public get scrollBarPolicy(): number {
			return this._scrollBarPolicy;
		}
		public set viewport(value: IViewport) {
			if (value == this._viewport)
				return;
			this.uninstallViewport();
			this._viewport = value;
			this.installViewport();
		}
		public get viewport(): IViewport {
			return this._viewport;
		}
		/**viewport contentHeight/contentWidth改变，需重置 */
		public resetViewPort(): void {
			this.uninstallViewport();
			this.installViewport(true);
		}

		/**
		* 安装并初始化视域组件
		*/
		private installViewport(isReset: boolean = false): void {
			let viewport = this._viewport;
			if (viewport) {
				viewport.scrollEnabled = true;
				viewport.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
				viewport.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
				viewport.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
				viewport.addEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
				if (this._orientation == SliderOrientation.VERTICAL) {
					let realSize = (this._viewport.height * (this._viewport.height - this._upButton.height - this._downButton.height)) / this._viewport.contentHeight;
					this._slider.setSliderParams(-(this._viewport.contentHeight - this._viewport.height), 0, isReset ? this._slider.value : 0, realSize);
				}
				else {
					let realSize = (this._viewport.width * (this._viewport.width - this._upButton.height - this._downButton.height)) / this._viewport.contentWidth;
					this._slider.setSliderParams(-(this._viewport.contentWidth - this._viewport.width), 0, isReset ? this._slider.value : (-(this._viewport.contentWidth - this._viewport.width)), realSize);
				}
				this.visible = this.checkScrollPolicy();
			}
		}

        /**
         * 卸载视域组件
         */
		private uninstallViewport(): void {
			let viewport = this._viewport;
			if (viewport) {
				viewport.scrollEnabled = false;
				viewport.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
				viewport.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
				viewport.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
				viewport.removeEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
			}
		}
		private checkMouseIsInScroller(stageX: number, stageY: number): boolean {
			let p = this.globalToLocal(stageX, stageY, egret.$TempPoint);
			if (p.x >= 0 && p.x <= this._width && p.y >= 0 && p.y <= this._height)
				return true;
			return false;
		}
		private onViewPortRemove(event: egret.Event): void {
			if (event.target == this.viewport) {
				this.viewport = null;
			}
		}
		private onTouchBeginCapture(event: egret.TouchEvent): void {
			if (!this.visible)
				return;
			if (this.checkMouseIsInScroller(event.$stageX, event.$stageY))
				return;
			this._touchCancle = false;
			let canScroll: boolean = this.checkScrollPolicy();
			if (!canScroll) {
				return;
			}
			this.onTouchBegin(event);
		}
		private onTouchEndCapture(event: egret.TouchEvent): void {
			if (!this.visible)
				return;
			if (this.checkMouseIsInScroller(event.$stageX, event.$stageY))
				return;
			if (this._touchCancle) {
				event.stopPropagation();
				this.onTouchEnd(event);
			}
		}
		private onTouchTapCapture(event: egret.TouchEvent): void {
			if (!this.visible)
				return;
			if (this.checkMouseIsInScroller(event.$stageX, event.$stageY))
				return;
			if (this._touchCancle) {
				event.stopPropagation();
			}
		}
		private checkScrollPolicy(): boolean {
			let viewport: IViewport = this._viewport;
			if (!viewport) {
				return false;
			}
			let canScroll: boolean;
			switch (this._scrollBarPolicy) {
				case ScrollBarPolicy.AUTO:
					if (this._orientation == SliderOrientation.HORIZONTAL) {
						if (viewport.contentWidth > viewport.width || viewport.scrollH < 0) {
							canScroll = true;
						}
						else {
							canScroll = false;
						}
					}
					else {
						if (viewport.contentHeight > viewport.height || viewport.scrollV < 0) {
							canScroll = true;
						}
						else {
							canScroll = false;
						}
					}
					break;
				case ScrollBarPolicy.ON:
					canScroll = true;
					break;
				case ScrollBarPolicy.OFF:
					canScroll = false;
					break;
			}
			this._canScroll = canScroll;
			return canScroll;
		}
		public stopAnimation(): void {
			this._touchScroll.stop();
		}
		private onTouchBegin(event: egret.TouchEvent): void {
			if (event.isDefaultPrevented()) {
				return;
			}
			if (!this.checkScrollPolicy()) {
				return;
			}
			this.downTarget = event.target;
			this.stopAnimation();
			this._touchStartX = event.$stageX;
			this._touchStartY = event.$stageY;

			if (this._canScroll) {
				if (this._orientation == SliderOrientation.HORIZONTAL)
					this._touchScroll.start(event.$stageX);
				else
					this._touchScroll.start(event.$stageY);
			}
			let stage = this.$stage;
			this._viewport.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
			this._viewport.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
			this._viewport.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
		}
		private onTouchMove(event: egret.TouchEvent): void {
			if (event.isDefaultPrevented()) {
				return;
			}
			if (!this._touchMoved) {
				let outX: boolean;
				if (Math.abs(this._touchStartX - event.$stageX) < ScrollBar.scrollThreshold) {
					outX = false;
				} else {
					outX = true;
				}
				let outY: boolean;
				if (Math.abs(this._touchStartY - event.$stageY) < ScrollBar.scrollThreshold) {
					outY = false;
				} else {
					outY = true;
				}
				if (!outX && !outY) {
					return;
				}
				if (this._scrollBarPolicy == ScrollBarPolicy.OFF) {
					if (this._orientation == SliderOrientation.HORIZONTAL) {
						if (!outY && outX)
							return;
					}
					else {
						if (!outX && outY)
							return;
					}
				}

				this._touchCancle = true;
				this._touchMoved = true;
				this.dispatchCancelEvent(event);
				if (this.$stage)
					this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			}
			event.preventDefault();
			let viewport = this._viewport;
			if (this._canScroll && viewport) {
				if (this._orientation == SliderOrientation.HORIZONTAL) {
					this._touchScroll.update(event.$stageX, viewport.contentWidth - this._viewport.width, viewport.scrollH);
				}
				else if (this._orientation == SliderOrientation.VERTICAL) {
					this._touchScroll.update(event.$stageY, viewport.contentHeight - this._viewport.height, viewport.scrollV);
				}
			}
		}
		private onTouchCancel(event: egret.TouchEvent): void {
			if (!this._touchMoved) {
				this.onRemoveListeners();
			}
		}
		private onTouchEnd(event: egret.Event): void {
			this._touchMoved = false;
			if (!this._viewport)
				return;
			this.onRemoveListeners();

			let viewport: IViewport = this._viewport;
			if (this._touchScroll.isStarted()) {
				if (this._orientation == SliderOrientation.HORIZONTAL)
					this._touchScroll.finish(viewport.scrollH, this.isTouchLoop ? viewport.contentWidth - this._viewport.width: 0);
				else
					this._touchScroll.finish(viewport.scrollV, this.isTouchLoop ? viewport.contentHeight - this._viewport.height : 0);
			}
		}
		private onRemoveListeners(): void {
			let stage = this.$stage;
			if (!this._viewport)
				return;
			this._viewport.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
			stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			this._viewport.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, true);
			this._viewport.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
		}
		private dispatchCancelEvent(event: egret.TouchEvent) {
			let viewport = this._viewport;
			if (!viewport) {
				return;
			}
			let cancelEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_CANCEL, event.bubbles, event.cancelable);
			let target: egret.DisplayObject = this.downTarget;
			let list = this.$getPropagationList(target);
			let length = list.length;
			let targetIndex = list.length * 0.5;
			let startIndex = -1;

			for (let i = 0; i < length; i++) {
				if (list[i] === viewport) {
					startIndex = i;
					break;
				}
			}
			list.splice(0, startIndex + 1);
			targetIndex -= startIndex + 1;
			this.$dispatchPropagationEvent(cancelEvent, list, targetIndex);
			egret.Event.release(cancelEvent);
		}
		private touchScrollUpdateHandler(scrollPos: number): void {
			let sliderValue: number;
			if (this._orientation == SliderOrientation.HORIZONTAL) {
				this._viewport.scrollH = scrollPos;
				sliderValue = -((this._viewport.contentWidth - this._viewport.width) - scrollPos);
			}
			else {
				this._viewport.scrollV = scrollPos;
				sliderValue = -scrollPos
			}
			if (sliderValue >= this._slider.min && sliderValue <= this._slider.max)
				this._slider.value = sliderValue;
			else
				this.dispatchEventWith(egret.Event.CHANGE);
		}
		private touchScrollEndHandler(): void {
			if (!this._touchScroll.isPlaying()) {
				this.onChangeEnd();
			}
		}
		private onChangeEnd(): void {
			if(this._changEndFun) this._changEndFun.call(this._changEndAny);
		}
		public scrollTo(value:number): void {
			this.stopAnimation();
			if (this.checkScrollPolicy()) {
				this._slider.value = value;
			} else {
				this._slider.value = 0;
			}
		}
		public scrollToMin():void{
			this.stopAnimation();
			this._slider.value = this._slider.min;
		}
		public scrollToBottom(): void {
			this.stopAnimation();
			if (this.checkScrollPolicy()) {
				this._slider.value = this._slider.min;
			} else {
				this._slider.value = 0;
			}
		}
		public scrollToTop(): void {
			this.stopAnimation();
			if (this.checkScrollPolicy()) {
				this._slider.value = this._slider.max;
			} else {
				this._slider.value = 0;
			}
		}
		//滚动到底端
		public scrollTweenToBottom(): void {
			this.stopAnimation();
			let value = this.checkScrollPolicy() ? this._slider.min : 0;
			egret.Tween.get(this._slider).to({ value: value }, 300);
		}
		//滚动到顶端
		public scrollTweenToTop(): void {
			this.stopAnimation();
			let value = this.checkScrollPolicy() ? this._slider.max : 0;
			egret.Tween.get(this._slider).to({ value: value }, 300);
		}

		//是否能滚出底线
		public set scrollBounces(value: boolean) {
			if (this._touchScroll)
				this._touchScroll.$bounces = value;
		}

		//移除监听
		public removeAllLisenter() {
			if (this.viewport) {
				this.onRemoveListeners();
				this.uninstallViewport();
			}
		}

		//恢复监听
		public recoverAllLisenters() {
			if (this.viewport) {
				let viewport = this.viewport;
				viewport.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
				viewport.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
				viewport.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
				viewport.addEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
			}
		}

		public get changEndFun(): Function {
			return this._changEndFun;
		}
		public set changEndFun(value: Function) {
			this._changEndFun = value;
		}
		public get changEndAny(): any {
			return this._changEndAny;
		}
		public set changEndAny(value: any) {
			this._changEndAny = value;
		}

		public get isTouchLoop(): boolean {
			return this._isTouchLoop;
		}
		public set isTouchLoop(value: boolean) {
			this._isTouchLoop = value;
		}
	}
}