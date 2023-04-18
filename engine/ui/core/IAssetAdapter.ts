namespace LUI {
	export interface IAssetAdapter {
		 /**
         * 解析素材。
         * @param source 待解析的新素材标识符。
         * @param callBack 解析完成回调函数，示例：callBack(content:any,source:string):void;。
         * @param thisObject callBack的this引用。
         */
        getAsset(source: string, callBack: (content: any, source: string) => void, thisObject: any): void;
	}
}