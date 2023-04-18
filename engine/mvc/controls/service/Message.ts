class Message extends Proto implements IMessage {
	protected _head: Head;
	protected _body: Body;
	/**消息setup */
	setUp(sender: string, geters: Array<string>, messageType: string, body?: Body) {
		let head: Head = new Head();
		head.geters = geters;
		head.sender = sender;
		head.messageType = messageType;
		this._head = head;//此处的this应该是调用该方法的对象
		this._body = body;
		this.oid = sender;
	}
	/**检查消息是否有效 */
	static check(message: IMessage): boolean {
		if (message && message.sender && message.geters && message.geters.length > 0) {
			return true;
		}
		return false;
	}
	/**发送消息到所有模块 */
	static sendToTotalModules(actionType: string, sender: string, data?: any): void {
		ModuleMonitor.getInstance().sendToTotalModules(actionType, sender, data);
	}
	/**发送消息到指定模块 */
	static sendToModules(actionType: string, sender: string, geter: Array<string>, data?: any, subpack?: number): void {
		//是否要加载分包
		if (!subpack) {
			readyFunc();
		} else {
			GameInstance.getInstance().loadAndSetupSubpackage(readyFunc, subpack);
		}
		//发送消息
		function readyFunc() {
			let message: Message = new Message();
			if (data && (data instanceof Body)) {
				message.setUp(sender, geter, MessageConstant.MODULE_TO_MODULE, <Body>data);
			}
			else {
				message.setUp(sender, geter, MessageConstant.MODULE_TO_MODULE);
				message.proto = data;
			}
			message.actionType = actionType;
			message.send();
		}
	}
	/**发送消息到server模块 */
	static sendToService(service: string, sender: string, data: any): void {
		var body: Body;
		if (data && (data instanceof Body)) {
			body = <Body>data;
			body.type = service;
		}
		else {
			body = new Body();
			body.type = service;
			body.proto = data;
		}
		var message: Message = new Message();
		message.setUp(sender, [ServerProtModule.NAME], MessageConstant.MODULE_TO_SERVICE, body);
		message.send();
	}
	/**发送消息 */
	send(): void {
		if (Message.check(this)) {
			let module: IModule = ModuleMonitor.getInstance().takeModule(this.sender);
			if (module) {
				module.send(this);
			}
		}
	}
	/**消息类型 */
	get actionType(): string {
		return this._body.type;
	}
	/**消息类型 */
	set actionType(actionType: string) {
		if (!this._body) {
			this._body = new Body();
		}
		this._body.type = actionType;
	}
	/**消息发给谁--模块，子模块，server模块 */
	get messageType(): string {
		if (this._head) {
			return this._head.messageType;
		}
		return null;
	}
	/**消息发送者 */
	get sender(): string {
		if (this._head) {
			return this._head.sender;
		}
		return null;
	}
	/**消息接受者 */
	get geters(): Array<string> {
		if (this._head) {
			return this._head.geters;
		}
		return null;
	}
	/**消息携带的数据 */
	set proto(value: any) {
		if (!this._body) {
			this._body = new Body();
		}
		this._body.proto = value;
	}
	/**消息携带的数据 */
	get proto(): any {
		if (this._body) {
			return this._body.proto;
		}
		return null;
	}
	/**消息体 */
	get body(): Body {
		return this._body;
	}
	/**消息头 */
	get head(): Head {
		return this._head;
	}
	public constructor() {
		super();
	}
}