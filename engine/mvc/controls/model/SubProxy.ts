class SubProxy extends Proto implements IProxy {
	setUp(id: string, oid: string, sHandler?: (message: IMessage) => void): void {
		if (id) {
			this.id = id;
		}
		this.oid = oid;
		let module: IModule = ModuleMonitor.getInstance().takeModule(this.oid);
		if (module) {
			module.proxy.addSub(this);
		}
	}
	/**框架内调用 */
	subHandler0(message: IMessage) {
		this.subHandler(message);
	}
	/**需重写，写消息处理逻辑 */
	subHandler(message: IMessage) {
	}
	/**发送消息到所有模块 */
	sendToTotalModules(actionType: string, data?: any): void {
		ModuleMonitor.getInstance().sendToTotalModules(actionType, this.oid, data);
	}
	/**发送消息到指定模块 */
	sendToModules(actionType: string, geter: Array<string>, data?: any): void {
		let message: Message = new Message();
		if (data && (data instanceof Body)) {
			message.setUp(this.oid, geter, MessageConstant.MODULE_TO_MODULE, <Body>data);
		}
		else {
			message.setUp(this.oid, geter, MessageConstant.MODULE_TO_MODULE);
			message.proto = data;
		}
		message.actionType = actionType;
		message.send();
	}
	/**发送消息到server模块 */
	sendToService(service: string, data: any): void {
		let body: Body;
		if (data && (data instanceof Body)) {
			body = <Body>data;
			body.type = service;
		}
		else {
			body = new Body();
			body.type = service;
			body.proto = data;
		}
		let message: Message = new Message();
		message.setUp(this.oid, [ServerProtModule.NAME], MessageConstant.MODULE_TO_SERVICE, body);
		message.send();
	}
	public constructor() {
		super();
	}
}