class TextFlowMaker {
	private STYLE_COLOR:string = "C";
    private STYLE_SIZE:string = "S";
    private STYLE_STROKECOLOR:string = "KC";
    private STYLE_STROKE:string = "K";
    private PROP_TEXT:string = "T";

    /**用于处理按钮中文两个字时，中间加个空格 */
    public static zh2ButtonLableReplace(str:string):string
    {
        return str.replace(/^([\u4e00-\u9fa5])([\u4e00-\u9fa5])$/,'$1 $2');
    }

	/**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    public generateTextFlow(sourceText:string):egret.ITextElement[] {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    }

    private getSingleTextFlow(text:string):egret.ITextElement {
        var textArr = text.split("&");
        var tempArr;
        var textFlow:any = {"style": {}};
        for (var i = 0, len = textArr.length; i < len; i++) {
            tempArr = textArr[i].split(":");
            if (tempArr[0] == this.PROP_TEXT) {
                textFlow.text = tempArr[1];
            } else if (tempArr[0] == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(tempArr[1]);
            } else if (tempArr[0] == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(tempArr[1]);
            }else if(tempArr[0] == this.STYLE_STROKECOLOR)
            {
                textFlow.style.strokeColor = parseInt(tempArr[1]);
            } 
            else if(tempArr[0] == this.STYLE_STROKE)
            {
                textFlow.style.stroke = parseInt(tempArr[1]);
            }
            else {
                textFlow.text = tempArr[0];
            }
        }
        return textFlow;
    }

	private static _instance: TextFlowMaker;
	public static getInstance(): TextFlowMaker {
		if (this._instance == null) {
			this._instance = new TextFlowMaker();
		}
		return this._instance;
	} 
}