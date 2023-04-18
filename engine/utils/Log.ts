class Log {

    // 外网需要显示，需执行Log.ON = true
    public static ON: boolean = false;
    /**
    * Debug_Log
    * @param messsage 内容
    * @constructor
    */
    public static trace(...optionalParams: any[]): void {
        if (this.ON || GlobalStaticConfig.debug) {
            optionalParams[0] = "[DebugLog]" + optionalParams[0];
            egret.log.apply(console, optionalParams);
        }
    }

    /**
     * 解析消息Log
     */
    public static parseMsg(text: string, vo: Object) {
        if ((this.ON || GlobalStaticConfig.debug) && vo["code"]) {
            Log.trace(text + '【' + vo["code"] + '】' + JSON.stringify(vo) + " %c" + Utils1.formatTime(), 'color: red');
            //  console.dir(vo);
        }
    }

}