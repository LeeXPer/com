namespace LUI {
	export enum ImageAlign {
		TOP_RIGHT,
		BOTTOM_RIGHT,
		BOTTOM_LEFT,
		TOP_LEFT,
		CENTER
	}
	export class Image extends Component {
		protected _source: any;
		protected _defaultSource:any;
		protected _texture: egret.Texture;
		protected _bitmap: egret.Bitmap;
		protected _maintainAspectRatio: boolean = true;
		protected _align: number;
		protected _smoothing: boolean;
		protected _clearBeforeLoadSource: boolean = true;	//是否加载新资源之前需要清空旧资源
		public constructor(p?: egret.DisplayObjectContainer, source?: any) {
			super(p);
			if (source) {
				this.source = source;
			}
		}
		protected createChildren(): void {
			super.createChildren();
			this._bitmap = new egret.Bitmap();
			this.addChild(this._bitmap);
		}
		protected draw(): void {
			if (this._changed) {
				if (this._texture != null) {
					this._skinChanged = true;
				}
			}
			super.draw();
		}
		protected measureSize(): void {
			this._width = this._explicitWidth;
			this._height = this._explicitHeight;
			if (this._texture != null) {
				if (isNaN(this._explicitWidth)) {
					this._width = this._texture.$bitmapWidth;
				}
				if (isNaN(this._explicitHeight)) {
					this._height = this._texture.$bitmapHeight;
				}
			}
			else {
				if (isNaN(this._explicitWidth)) {
					this._width = 0;
				}
				if (isNaN(this._explicitHeight)) {
					this._height = 0;
				}
			}
		}
		protected drawSkin(): void {
			if (this._texture != null) {
				let contentW: number = this._texture.$bitmapWidth;
				let contentH: number = this._texture.$bitmapHeight;
				let drawWidth: number = contentW;
				let drawHeight: number = contentH;
				let tx: number = 0;
				let ty: number = 0;
				drawWidth = (!isNaN(this._explicitWidth)) ? this._explicitWidth : contentW;
				drawHeight = (!isNaN(this._explicitHeight)) ? this._explicitHeight : contentH;
				if(this._maintainAspectRatio){
					if((!isNaN(this._explicitWidth)) || (!isNaN(this._explicitHeight))){
						let scX: number = drawWidth / contentW;
						let scY: number = drawHeight / contentH;
						let min: number;
						if (scX >= scY) {
							min = scY;
							drawWidth = contentW * min;
						}
						else {
							min = scX;
							drawHeight = contentH * min;
						}
					}
				}

				if (this._align == ImageAlign.TOP_RIGHT) {
					tx = this._width - drawWidth;
					ty = 0;
				}
				else if (this._align == ImageAlign.BOTTOM_RIGHT) {
					tx = this._width - drawWidth;
					ty = this._height - drawHeight;
				}
				else if (this._align == ImageAlign.BOTTOM_LEFT) {
					tx = 0;
					ty = this._height - drawHeight;
				}
				else if (this._align == ImageAlign.CENTER) {
					tx = (this._width - drawWidth) >> 1;
					ty = (this._height - drawHeight) >> 1;
				}
				this._bitmap.smoothing = this._smoothing;
				this._bitmap.x = tx;
				this._bitmap.y = ty;
				this._bitmap.scale9Grid = this._scale9Grid;
				this._bitmap.width = drawWidth;
				this._bitmap.height = drawHeight;
				this._bitmap.texture=null;
				this._bitmap.texture=this._texture;
			}
		}
		protected parseSource(): void {
			let source = this._source;
			if (source && typeof source == "string") {
				StyleManager.assetAdapter.getAsset(<string>this._source, this.contentChanged, this);
			}
			else {
				this._texture = <egret.Texture>source;
				this._changed = true;
				this.invalidate();
				// this.drawDirectly();
			}
		}
		protected contentChanged(data: any, source: any): void {
			if (source !== this._source)
				return;
			if(!data){
				if(this._defaultSource){
					this.source=this._defaultSource;
				}
				return;
			}
			if (egret.is(data, "egret.Texture"))
				this._texture = data;
			else if (egret.is(data, "egret.BitmapData")) {
				let texture: egret.Texture = new egret.Texture();
				texture._setBitmapData(data);
				this._texture = texture;
			}
			else
				return;
			this._changed = true;
			this.invalidate();
		}
		public set source(value: any) {
			if (this._source != value) {
				if(this._clearBeforeLoadSource || !value){
					this._texture = null;
					this._bitmap.$setBitmapData(null);
					this._width = 0;
					this._height = 0;
					this._scale9Grid = null;
				}
				this._source = value;
				this.parseSource();
			}
		}
		public get texture(): egret.Texture {
			return this._texture;
		}
		public get source(): any {
			return this._source;
		}
		public set defaultSource(value: any) {
			this._defaultSource=value;
		}
		public get defaultSource(): any {
			return this._defaultSource;
		}
		public set maintainAspectRatio(value: boolean) {
			this._maintainAspectRatio = value;
		}
		public get maintainAspectRatio(): boolean {
			return this._maintainAspectRatio;
		}
		public set align(value: number) {
			this._align = value;
		}
		public get align(): number {
			return this._align;
		}
		public get smoothing(): boolean {
			return this._smoothing;
		}
		public set smoothing(value: boolean) {
			this._smoothing = value;
		}
		public get bitmap(): egret.Bitmap {
			return this._bitmap;
		}
		public set clearBeforeLoadSource(value: boolean){
			this._clearBeforeLoadSource = value;
		}

		/**重置宽度 */
		public resetWH():void
		{
			this._width = this._height = 0;
			this._explicitWidth = this._explicitHeight = NaN;
		}
	}
}