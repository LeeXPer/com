namespace LUI {
	export class UUIDUtil {
		/**
		 *  @private
		 *  Char codes for 0123456789ABCDEF
		 */
		private static  ALPHA_CHAR_CODES:Array<number> = [48, 49, 50, 51, 52, 53, 54, 
			55, 56, 57, 65, 66, 67, 68, 69, 70];
		public static  createUID():string
		{
			var uid:Array<number> = new Array(36);
			var index:number = 0;
			
			var i:number;
			var j:number;
			
			for (i = 0; i < 8; i++)
			{
				uid[index++] = this.ALPHA_CHAR_CODES[Math.floor(Math.random() *  16)];
			}
			
			for (i = 0; i < 3; i++)
			{
				uid[index++] = 45; // charCode for "-"
				
				for (j = 0; j < 4; j++)
				{
					uid[index++] = this.ALPHA_CHAR_CODES[Math.floor(Math.random() *  16)];
				}
			}
			
			uid[index++] = 45; // charCode for "-"
			
			var time:number = new Date().getDate();
			// Note: time is the number of milliseconds since 1970,
			// which is currently more than one trillion.
			// We use the low 8 hex digits of this number in the UID.
			// Just in case the system clock has been reset to
			// Jan 1-4, 1970 (in which case this number could have only
			// 1-7 hex digits), we pad on the left with 7 zeros
			// before taking the low digits.
			var timeString:string = ("0000000" + time.toString(16).toUpperCase()).substr(-8);
			
			for (i = 0; i < 8; i++)
			{
				uid[index++] = timeString.charCodeAt(i);
			}
			
			for (i = 0; i < 4; i++)
			{
				uid[index++] = this.ALPHA_CHAR_CODES[Math.floor(Math.random() *  16)];
			}
			
			return String.fromCharCode.apply(null, uid);
		}
	}
}