interface IMessage extends IProto
{
	/**消息类型-区分消息要干什么 */
	actionType:string;
	/**消息发给谁--模块，子模块，server模块 */
	messageType:string;
	head:Head;
	body:Body;
	geters:Array<string>;
	sender:string;
	setUp(sender:string,geters:Array<string>,messageType,body?:Body);
	send():void;
}