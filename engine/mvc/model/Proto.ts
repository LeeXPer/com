/// <reference path="../../utils/UIDUtil.ts" /> 
class Proto implements IProto {
	/**唯一ID */
	id: string;
	/**拥有者的ID */
	oid: string;
	/**数据 */
	proto: any;
	toString(): string {
		let name: string = egret.getQualifiedClassName(this)
		return name + " " + this.id;
	}
	constructor() {
		this.id = UIDUtil.nextInstanceIndex();		
	}

}