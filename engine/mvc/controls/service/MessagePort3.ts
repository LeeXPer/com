class MessagePort3 {
	private static _instance: MessagePort3;

	static getInstance(): MessagePort3 {
		if (!this._instance) {
			this._instance = new MessagePort3();
		}
		return this._instance;
	}
	/**发送消息 */
	send(message: IMessage): void {
		if (message.messageType == MessageConstant.MODULE_TO_SERVICE) {
			this.moduleToSevrice(message);
		}
		else {
			this.moduleToModule(message);
		}
	}
	/**发送消息到模块 */
	private moduleToModule(message: IMessage): void {
		let geters: Array<string>;
		let geter: IModule;
		let module: IModule = ModuleMonitor.getInstance().takeModule(message.sender);
		if (module) {
			geters = message.geters;
			let geterId: string;
			for (let i: number = 0; i < geters.length; i++) {
				geterId = geters[i];
				if (geterId) {
					geter = ModuleMonitor.getInstance().takeModule(geterId);
					if (geter)
						geter.proxy.subHandler0(message);
				}
			}
		}
	}
	/**发送消息到server模块 */
	private moduleToSevrice(message: IMessage): void {
		var module: IModule = ModuleMonitor.getInstance().takeModule(ServerProtModule.NAME);
		module.proxy.subHandler0(message);
	}
	public constructor() {
	}
}