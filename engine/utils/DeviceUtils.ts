class DeviceUtils {
	 /**
     * 当前是否Html5版本
     * @returns {boolean}
     * @constructor
     */
    public static get IsHtml5():boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
    }

    /**
     * 当前是否是Native版本
     * @returns {boolean}
     * @constructor
     */
    public static get IsNative():boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
    }

    /**
     * 是否是在手机上
     * @returns {boolean}
     * @constructor
     */
    public static get IsMobile():boolean {
        return egret.Capabilities.isMobile;
    }

    /**
     * 是否是在PC上
     * @returns {boolean}
     * @constructor
     */
    public static get IsPC():boolean {
        return !egret.Capabilities.isMobile;
    }

    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsQQBrowser():boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
    }

    /**
     * 是否是IE浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsIEBrowser():boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
    }

    /**
     * 是否是Firefox浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsFirefoxBrowser():boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
    }

    /**
     * 是否是Chrome浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsChromeBrowser():boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
    }

    /**
     * 是否是Safari浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsSafariBrowser():boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
    }

    /**
     * 是否是Opera浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsOperaBrowser():boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
    }

    /**
     * 是否是微信内核浏览器
     * @returns {boolean}
     * @constructor
     */
    public static get IsWechatBrowser():boolean {
        return navigator.userAgent.toLocaleLowerCase().indexOf("micromessenger") != -1;
    }

    /**
     * 是否是IOS
     * @returns {boolean}
     * @constructor
     */
    public static get IsIos():boolean {
        return /(iPhone|iPad|iPod|iOS|Mac)/i.test(navigator.platform);
    }

    /**
     * 是否是Android
     * @returns {boolean}
     * @constructor
     */
    public static get IsAndroid():boolean {
        return /(Android)/i.test(navigator.platform);
    }
}