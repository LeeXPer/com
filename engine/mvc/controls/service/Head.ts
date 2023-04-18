class Head extends Proto{
	/**消息体类型
	 * 发送到其他模块、发送到服务器
	 */
	messageType:string;
	/**消息接收者 */
	geters:Array<string>;
	/**消息发送者 */
	sender:string;
	public constructor() {
		super();
	}
}