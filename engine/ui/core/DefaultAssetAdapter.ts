namespace LUI {
	let loaderPool: egret.ImageLoader[] = [];
    let callBackMap: any = {};
    let loaderMap: any = {};
	export class DefaultAssetAdapter {
		 /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param callBack 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        public getAsset(source: string, callBack: (data: any, source: string) => void, thisObject: any): void {
            let list = callBackMap[source];
            if (list) {
                list.push([callBack, thisObject]);
                return;
            }
            let loader = loaderPool.pop();
            if (!loader) {
                loader = new egret.ImageLoader();
            }
            callBackMap[source] = [[callBack, thisObject]];
            loaderMap[loader.$hashCode] = source;

            loader.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            loader.load(source);
        }

        /**
         * @private
         * @param event 
         */
        private onLoadFinish(event: egret.Event): void {
            let loader = event.currentTarget;
            loader.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            let data: egret.Texture;
            if (event.$type == egret.Event.COMPLETE) {
                data = new egret.Texture();
                data._setBitmapData(loader.data);
                loader.data = null;
            }
            loaderPool.push(loader);
            let source = loaderMap[loader.$hashCode];
            delete loaderMap[loader.$hashCode];
            let list: any[] = callBackMap[source];
            delete callBackMap[source];
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let arr: any[] = list[i];
                arr[0].call(arr[1], data, source);
            }
        }
	}
}