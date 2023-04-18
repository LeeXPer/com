class BaseRender {
	protected _running: boolean = false;
	// protected _readyOk: boolean = false;
	public constructor() {
		this.play();
	}
	public play(): void {
		if (this._running)
			return;
		this._running = true;
		this.renderMe();
		Global.stage.addEventListener(egret.Event.ENTER_FRAME, this.renderMe, this, false, 10000);
	}
	/**
	 * 停止运行
	 */
	public stop(): void {
		this._running = false;
		Global.stage.removeEventListener(egret.Event.ENTER_FRAME, this.renderMe, this);
	}
	/**
	 * 渲染(每一帧都渲染)
	 */
	private renderMe(e: Event = null): void {
		// if (this._readyOk) {
			this.updateTime();		
		// }
	}

	/**更新时间（每一帧都会更新）
	 */
	private updateTime(): void {
		if (Global.lashFrameTimer == 0) {
			Global.lashFrameTimer = egret.getTimer();
			Global.timer = egret.getTimer();
		}
		else {
			Global.lashFrameTimer = Global.timer;
			Global.timer = egret.getTimer();
		}
	}
	
}