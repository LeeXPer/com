/// <reference path="ModuleProxy.ts" /> 
/// <reference path="ModuleMonitor.ts" /> 
class BaseModule implements IModule {
	/**唯一id  */
	id: string;
	/**拥有者id */
	oid: string;
	/**数据*/
	proto: any;
	/**模块总代理 */
	protected _proxy: ModuleProxy;
	/**模块View */
	protected _view: IModuleView;
	/**注册模块 */
    register(moduleId: string) {
		if (!this._proxy) {
			this.id = moduleId;
			this._proxy = new ModuleProxy();
			this._proxy.setUp(null, moduleId, (message: IMessage) => { this.subHandler0(message) });
			ModuleMonitor.getInstance().addModule(this);
		}
		else {
			this.id = moduleId;
			this._proxy.oid = moduleId;
		}
	}
	/**注册子代理 */
    registerSub(...args: any[]): void {
		if (this._proxy) {
			for (var i: number = 0; i < args.length; i++) {
				let subClz = args[i];
				let sub: SubProxy = <SubProxy>(new subClz());
				if (sub) {
					sub.oid=this.id;
					this._proxy.addSub(sub);
				}
			}
		}
	}
	/**框架内调用 */
	subHandler0(message: IMessage): void {
		this.subHandler(message);
	}
	/**消息处理 */
    subHandler(message: IMessage): void {

	}
	/**发消息 */
	send(message: IMessage) {
		MessagePort3.getInstance().send(message);
	}
	/**模块代理 */
	get proxy(): ModuleProxy {
		return this._proxy;
	}
	/**模块View */
	get view(): IModuleView {
		return this._view;
	}
	/**模块View */
	set view(value: IModuleView) {
		this._view = value;
	}
	/**模块名 */
	get moduleName(): string {
		return "BaseModule";
	}
	public constructor() {
	}
}