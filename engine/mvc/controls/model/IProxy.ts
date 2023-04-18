interface IProxy {
	/**proxy set up */
	setUp(id:string,oid:string,subHandler?:(message:IMessage)=>void):void;
}