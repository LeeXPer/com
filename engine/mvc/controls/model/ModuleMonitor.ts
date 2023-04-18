class ModuleMonitor {
	private static _instance: ModuleMonitor;
	protected _hash: Array<IModule>;
	static getInstance(): ModuleMonitor {
		if (!this._instance) {
			this._instance = new ModuleMonitor();
		}
		return this._instance;
	}
	/**set up */
	setUp(): void {
		new ServerProtModule();//注册server模块
	}
	/**发消息到所有模块 */
	sendToTotalModules(actionType: string, sender: string, data?: any): void {
		let geter: Array<string> = [];
		for (let i: number = 0; i < this._hash.length; i++) {
			let module: IModule = this._hash[i];
			geter.push(module.id);
		}
		let message = new Message();
		if (data && (data instanceof Body)) {
			message.setUp(sender, geter, MessageConstant.MODULE_TO_MODULE, data as Body);
		}
		else {
			message.setUp(sender, geter, MessageConstant.MODULE_TO_MODULE);
			message.proto = data;
		}
		message.actionType = actionType;
		message.send();
	}
	/**添加模块 */
	addModule(module: IModule): void {
		if (module && (!this.takeModule(module.id))) {
			this._hash.push(module);
		}
	}
	/**移除模块 */
	removeModule(id: String): void {
		let module: IModule = this.takeModule(id);
		if (module) {
			let index = this._hash.indexOf(module);
			this._hash.splice(index, 1);
		}
	}
	/**获取模块 */
	takeModule(id: String): IModule {
		for (let i: number = 0; i < this._hash.length; i++) {
			let module: IModule = this._hash[i];
			if (module.id == id) {
				return module;
			}
		}
		return null;
	}
	/**模块列表 */
	get hash(): Array<IModule> {
		return this._hash;
	}
	public constructor() {
		this._hash = [];
	}
}