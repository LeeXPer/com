/// <reference path="ModuleProxy.ts" /> 
/// <reference path="ModuleMonitor.ts" /> 
class Module extends BaseModule {
	/**发消息到所有模块 */
	sendToTotalModules(actionType: string, data?: any): void {
		ModuleMonitor.getInstance().sendToTotalModules(actionType, this.id, data);
	}
	/**发消息到指定模块 */
	sendToModules(actionType: string, geter: Array<string>, data?: any): void {
		let message: Message = new Message();
		if (data && (data instanceof Body)) {
			message.setUp(this.id, geter, MessageConstant.MODULE_TO_MODULE, <Body>data);
		}
		else {
			message.setUp(this.id, geter, MessageConstant.MODULE_TO_MODULE);
			message.proto = data;
		}
		message.actionType = actionType;
		message.send();
	}
	/**发消息到server模块 */
	sendToService(service: string, data: any): void {
		let body: Body;
		if (data && (data instanceof Body)) {
			body =<Body>data;
			body.type = service;
		}
		else {
			body = new Body();
			body.type = service;
			body.proto = data;
		}
		let message: Message = new Message();
		message.setUp(this.id, [ServerProtModule.NAME], MessageConstant.MODULE_TO_SERVICE, body);
		message.send();
	}
	/**模块名 */
	get moduleName(): string {
		return "Module";
	}
	public constructor() {
		super();
		this.register(this.moduleName);//注册模块
	}
}