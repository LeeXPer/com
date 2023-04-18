class StopWatch {
	private _startTime: number;
	private _pauseStart: number;

	public constructor() {
		this.reset();
	}
	public reset(): void {
		this._pauseStart = -1;
		this._startTime = egret.getTimer();
	}

	public get timePassed(): number {
		if (this._pauseStart >= 0) {
			this.restart();
		}
		return egret.getTimer() - this._startTime;
	}
	public pause(): void {
		if (this._pauseStart == -1)
			this._pauseStart = egret.getTimer();
	}
	public restart(): void {
		if (this._pauseStart >= 0) {
			var _pauseDuration: number = egret.getTimer() - this._pauseStart;
			this._pauseStart = -1;
			this._startTime = this._startTime + _pauseDuration;
		}
	}
}