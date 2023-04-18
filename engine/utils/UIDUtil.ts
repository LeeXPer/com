class UIDUtil {

	private static INSTANCE_INDEX:number=9999999999;

	static nextInstanceIndex():string
	{
			if(this.INSTANCE_INDEX<=0)this.INSTANCE_INDEX=9999999999;
			this.INSTANCE_INDEX--;
			return "#"+this.INSTANCE_INDEX.toString(16);
	}
	public constructor() {
	}
}