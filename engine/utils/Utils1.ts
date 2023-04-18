class Utils1 {

	/**按zIndex深度排序显示列表 */
	public static sortChildIndex(list: egret.DisplayObject[], agr: any) {
		list.sort((a: LUI.Component, b: LUI.Component) => {
			let az = a.zIndex;
			let bz = b.zIndex;
			if (az > bz) return 1;
			else if (az < bz) return -1;
			else return 0;
		})
		let self = agr;
		let index = -1;
		list.forEach(function (obj: egret.DisplayObject) {
			let curIndex: number = obj.parent.getChildIndex(obj);
			index++;
			if (curIndex != index) {
				obj.parent.setChildIndex(obj, index);
			}
		}, self);
	}

	/**
	 * 居中布局
	 * @param pTotalW 
	 * @param gap 
	 * @param startX 
	 * @param cellW 
	 * @param rest 
	 */
	public static centerX(pTotalW: number, gap: number, startX: number = 0, cellW?: number, ...rest): void {
		let len: number = rest.length;
		let args: Array<any>;

		if (len == 1 && rest[0] instanceof Array) {
			args = rest[0] as Array<any>;
			len = args.length;
		}
		else {
			args = rest;
		}
		if (len <= 0) return;

		let itemW = cellW ? cellW : args[0].width; // 格子宽
		let itemTotalW = len * (itemW + gap) - gap; // 格子+间隙总宽
		let itemFirstX = pTotalW - itemTotalW >> 1; // 首个item的x轴
		for (let i = 0; i < len; i++) {
			args[i].x = startX + itemFirstX + i * (itemW + gap);
		}

	}

	/**延迟处理函数 */
	public static delayRunFun(fun: Function, funObj?: Object, delay = 1000): any {
		let delayFun = setTimeout(() => {
			fun.call(funObj);
			clearTimeout(delayFun);
		}, delay);
		return delayFun;
	}

	/**格式化时间,time(ms) */
	public static formatTime(time?: number): string {
		let t = time || Global.serverTime;
		return new Date(t).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ") + "." + (t % 1000);
	}

	/**数字转英文单词[分包用] */
	public static numToEn(n: number): string {
		let words = ["one", "two", "three", "four", "five"];
		return words[n - 1];
	}

	/**
	 * 数字转中文
	 * @param num 数字
	 * @param traditional 是否繁体
	 */
	public static numberToCN(num: number, traditional: boolean = false): string {
		let targetStr: string = "";
		let lan1 = "零|一|二|三|四|五|六|七|八|九|十";
		let lan2 = "零|壹|贰|叁|肆|伍|陆|柒|捌|玖|拾";
		let words = traditional ? lan2.split("|") : lan1.split("|");
		if (num >= 10) {
			if (Math.floor(num / 10) > 1)
				targetStr += words[Math.floor(num / 10)];
			targetStr += words[10];
			if (num % 10 != 0)
				targetStr += words[num % 10];
		} else {
			targetStr = words[num];
		}
		return targetStr;
	}
}