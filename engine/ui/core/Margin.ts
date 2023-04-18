namespace LUI {
	export class Margin {
		public top: number;
		public left: number;
		public bottom: number;
		public right: number;
		public constructor(top: number = 0, left: number = 0, bottom: number = 0, right: number = 0) {
			this.top = top;
			this.left = left;
			this.bottom = bottom;
			this.right = right;
		}

		public reset(top: number, left: number, bottom: number, right: number): void {
			this.top = top;
			this.left = left;
			this.bottom = bottom;
			this.right = right;
		}

		public copyForm(margin: Margin): void {
			this.top = margin.top;
			this.left = margin.left;
			this.bottom = margin.bottom;
			this.right = margin.right;
		}
	}
}