namespace LUI {
	/**
	 * @class egret.gui.ResizeEvent
	 * @classdesc
	 * 尺寸改变事件
	 * @extends egret.Event
	 */
  export class ResizeEvent extends egret.Event {
		/**
		 * @constant egret.gui.ResizeEvent.RESIZE
		 */
    public static RESIZE: string = "resize";

		/**
		 * @method egret.gui.ResizeEvent#constructor
		 * @param type {string} 
		 * @param oldWidth {number} 
		 * @param oldHeight {number} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
    public constructor(type: string,
      bubbles: boolean = false, cancelable: boolean = false) {
      super(type, bubbles, cancelable);
    }

		/**
		 * 旧的高度 
		 * @member egret.gui.ResizeEvent#oldHeight
		 */
    public oldHeight: number = NaN;

		/**
		 * 旧的宽度 
		 * @member egret.gui.ResizeEvent#oldWidth
		 */
    public oldWidth: number = NaN;

    /**
     * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
     * @method egret.gui.ResizeEvent.dispatchResizeEvent
     */
    public static dispatchResizeEvent(target: egret.IEventDispatcher, oldWidth: number = NaN, oldHeight: number = NaN): boolean {
      let event: ResizeEvent = egret.Event.create(ResizeEvent, ResizeEvent.RESIZE);
      event.oldWidth = oldWidth;
      event.oldHeight = oldHeight;
      let result = target.dispatchEvent(event);
      egret.Event.release(event);
      return result;
    }
  }
}