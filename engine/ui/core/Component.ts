namespace LUI {
	export class Component extends egret.Sprite implements IComponent {
		protected _id: string;
		protected _data: any;
		protected _changed: boolean;
		protected _enabled: boolean = true;
		/**是否已处理 */
		protected _disposed: boolean;
		protected _defaultWidth: number = NaN;
		protected _defaultHeight: number = NaN;
		protected _explicitWidth: number = NaN;
		protected _explicitHeight: number = NaN;
		protected _width: number = 0;
		protected _height: number = 0;
		protected _oldWidth: number = 0;
		protected _oldHeight: number = 0;
		protected _margin: Margin;
		protected _createCompleted: Boolean = false;
		protected _skin: ISkin;
		protected _skinChanged: boolean;
		protected _scale9Grid: egret.Rectangle;
		/**是否已经添加了事件监听*/
        private _listenersAttached:boolean = false;
		public constructor(p?: egret.DisplayObjectContainer) {
			super();
			this.preinitialize();
			this.createChildren();
			this.initialize();
			if (p) {
				if (p instanceof Panel)
					(p as Panel).addElement(this);
				else
					p.addChild(this);
			}
		}
		/**预初始化，这里可以修改属性默认值*/
		protected preinitialize(): void {
			if (!this._id)
				this._id = LUI.UUIDUtil.createUID();
			this.name = NameUtil.createUniqueName(this);
			this.touchEnabled = true;
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this._margin = new Margin();
		}
		/**创建组件对象*/
		protected createChildren(): void {
		}
		/**初始化，这里组件对象已经被创建，可以进行修改操作*/
		protected initialize(): void {
			this.setDefaultStyle();
			//默认已经修改过
			this._changed = true;
		}
		protected setDefaultStyle(): void {

		}
		protected onAddedToStage(e: Event): void {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.invalidate();
		}
		protected draw(): void {
			if (this._changed) {
				this._changed = false;
			}
			this.measureSize();
			let sizeChanged: boolean = this.dispatchResizeEvent();
			if (sizeChanged || this._skinChanged) {
				this.drawSkin();
			}
			if (this._createCompleted == false) {
				this._createCompleted = true;
				LUIEvent.dispatchEvent(this, LUIEvent.CREATION_COMPLETE);
			}
		}
		protected measureSize(): void {

		}
		protected drawSkin(): void {

		}
        /**
         * 添加事件监听
         */
        private attachListeners():void {
            this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
            this.addEventListener(egret.Event.RENDER, this.onInvalidate, this);
            egret.sys.$invalidateRenderFlag = true;
            this._listenersAttached = true;
        }
        /**
         * 移除事件监听
         */
		private dettachListeners():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
            this.removeEventListener(egret.Event.RENDER, this.onInvalidate, this);
            this._listenersAttached = false;
        }
		private onInvalidate(evt: egret.Event): void {
			if (!this._disposed) {
				this.dettachListeners();
				this.draw();
			}
		}
		protected invalidate(): void {
			if (!this._disposed&&!this._listenersAttached) {
				this.attachListeners();
			}
		}
		public drawDirectly(): void {
			this.dettachListeners();
			this.draw();
		}
		/***抛出尺寸改变事件*/
		protected dispatchResizeEvent(): boolean {
			if (this._width != this._oldWidth || this._height != this._oldHeight) {
				if (this.hasEventListener(ResizeEvent.RESIZE)) {
					ResizeEvent.dispatchResizeEvent(this, this._oldWidth, this._oldHeight);
				}
				this._oldWidth = this._width;
				this._oldHeight = this._height;
				return true;
			}
			return false;
		}
		public move(x: number, y: number) {
			this.x = x;
			this.y = y;
		}
		public size(w: number, h: number) {
			this.width = w;
			this.height = h;
		}
		public get enabled(): boolean {
			return this._enabled;
		}
		public set enabled(value: boolean) {
			this._enabled = value;
			this.touchChildren = this.touchEnabled = this._enabled;
		}
		public get id(): string {
			return this._id;
		}
		public set id(value: string) {
			this._id = value;
		}
		public get data(): any {
			return this._data;
		}
		public set data(value: any) {
			this._data = value;
		}
		public set width(value: number) {
			if (this._width != value) {
				this._width = value;
				this._explicitWidth = value;
				this._changed = true;
				this.invalidate();
			}
		}
		public get width(): number {
			return this._width;
		}
		public set height(value: number) {
			if (this._height != value) {
				this._height = value;
				this._explicitHeight = value;
				this._changed = true;
				this.invalidate();
			}
		}
		public get height(): number {
			return this._height;
		}

		public dispose() {
			if (!this._disposed) {
				if (this.parent) {
					this.parent.removeChild(this);
					if(this._listenersAttached){
						this.dettachListeners();
					}
				}
				this._disposed = false;
				this._data = null;
			}
		}
		public get margin(): Margin {
			return this._margin;
		}
		public set margin(value: Margin) {
			this._margin = value;
		}
		public get rect(): egret.Rectangle {
			return new egret.Rectangle(this.x, this.y, this.width, this.height);
		}
		public set skin(value: ISkin) {
			if (this._skin != value) {
				this._skin = value;
				if (this._skin.scale9Grid != null)
					this._scale9Grid = this._skin.scale9Grid;
				else
					this._scale9Grid = null;
				this._skinChanged = true;
				this.invalidate();
			}
		}
		public get skin(): ISkin {
			return this._skin;
		}
		public set scale9Grid(value: egret.Rectangle) {
			if (this._scale9Grid != value) {
				this._scale9Grid = value;
				this._changed = true;
				this.invalidate();
			}
		}
		public get scale9Grid(): egret.Rectangle {
			return this._scale9Grid;
		}
		public toString(): string {
			return NameUtil.displayObjectToString(this);
		}

		public set changed(v: boolean) {
			this._changed = v;
		}
	}
}