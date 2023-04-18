namespace LUI {
	export class LUIEvent extends egret.Event {
		 /**
         * 组件创建完成
         */
        public static CREATION_COMPLETE:string = "creationComplete";
		/**组件更新完成 */
		public static UPDATE_COMPLETE:string="updateComplete";
		/**皮肤加载并创建完成 */
		public static SKIN_COMPLETE:string="skinLoadAndComplete";

		/**
         * @param type 事件类型；指示触发事件的动作。
         * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
         * @param cancelable 指定是否可以防止与事件相关联的行为。
         */
		public constructor(type:string, bubbles?:boolean, cancelable?:boolean){
            super(type, bubbles, cancelable);
        }

		/**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标。
         * @param eventType 事件类型；指示触发事件的动作。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         */
        public static dispatchUIEvent(target:egret.IEventDispatcher, eventType:string, bubbles?:boolean, cancelable?:boolean):boolean {
            if(!target.hasEventListener(eventType)){
                return true;
            }
            let event = egret.Event.create(LUIEvent, eventType, bubbles, cancelable);
            let result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }
	}
}