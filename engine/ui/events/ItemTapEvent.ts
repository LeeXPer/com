namespace LUI {

    /**
     * 列表项触碰事件
     */
    export class ItemTapEvent extends egret.Event {
       
        public static ITEM_TAP:string = "itemTap";
        public static ITEM_DOWN:string = "itemDown";
        public static ITEM_UP:string = "itemUp";
        public static ITEM_DELAY_DRAG:string = "itemDelayDrag";   // 延迟拖拽
        public static ITEM_DOUBLECLICK:string = "itemDoubleclick";// 双击
        public static LIST_PAGE_CHANGE:string = "listPageChange"; // 列表页事件，需要指定列表一页个数pageNum属性
        public item:any = null;
        public arg:any = null;
        public itemRenderer:IItemRenderer = null;
        public itemIndex:number = -1;
        public subIndex:number = -1;
        protected clean():void{
            super.clean();
            this.item = this.itemRenderer = null;
        }
        public static dispatchItemTapEvent(target:egret.IEventDispatcher, eventType:string, itemRenderer?:IItemRenderer,arg?:any):boolean {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            let event = egret.Event.create(ItemTapEvent, eventType,false,true);
            event.item = itemRenderer.data;
            event.itemIndex = itemRenderer.itemIndex;
            event.itemRenderer = itemRenderer;
            event.arg = arg;
            let result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }
    }

}