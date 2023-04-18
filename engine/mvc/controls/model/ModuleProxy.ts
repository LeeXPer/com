class ModuleProxy extends Proto implements IProxy {
	protected _subHash: Array<SubProxy>;
	protected _subHandler: (message: IMessage) => void;
	/**set up */
	setUp(id: string, oid: string, sHandler?: (message: IMessage) => void): void {
		if (id) {
			this.id = id;
		}
		this.oid = oid;
		this._subHandler = sHandler;
		this._subHash = [];
	}
	/**框架内调用 */
	subHandler0(message: IMessage) {
		if (this._subHandler) {
			this._subHandler(message);
		}
		if (this._subHash) {
			for (let i: number=0; i < this._subHash.length; i++) {
				let sub: SubProxy = this._subHash[i];
				sub.subHandler0(message);
			}
		}
	}
	/**添加子代理 */
	addSub(sub: SubProxy): void {
		if (sub && (this.hasSub(sub.id) == false)) {
			this._subHash.push(sub);
		}
	}
	/**获取子代理 */
	takeSub(id: String): SubProxy {
		for (let i: number=0; i < this._subHash.length; i++) {
			let sub: SubProxy = this._subHash[i];
			if (sub.id == id) {
				return sub;
			}
		}
		return null;
	}
	/**移除子代理 */
	removeSub(id: String): SubProxy {
		let sub: SubProxy = this.takeSub(id);
		if (sub) {
			let index = this._subHash.indexOf(sub);
			this._subHash.splice(index, 1);
		}
		return sub;
	}
	/**是否有添加了某代理 */
	hasSub(id: String): Boolean {
		return this.takeSub(id) != null;
	}
	public constructor() {
		super();
	}
}