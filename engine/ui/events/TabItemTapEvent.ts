namespace LUI {
    export class TabItemTapEvent extends egret.Event {
        public static TAB_ITEM_TAP: string = "tabItemTap";
        public static TAB_SUB_ITEM_TAP: string = "tabSubItemTap";
        public static TAB_DRAW_COMPLETE: string = "tabDrawComplete";
        public item: any = null;
        public itemRenderer: ISelect = null;
        public itemIndex: number = -1;
        public subIndex: number = -1;
        protected clean(): void {
            super.clean();
            this.item = this.itemRenderer = null;
        }
        public static dispatchItemTapEvent(target: egret.IEventDispatcher, eventType: string, itemRenderer?: IItemRenderer, itemIndex?: number, subIndex?: number): boolean {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            let event = egret.Event.create(ItemTapEvent, eventType);
            event.item = itemRenderer && itemRenderer.data;
            event.itemIndex = itemIndex;
            event.subIndex = subIndex;
            event.itemRenderer = itemRenderer;
            let result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }


    }
}