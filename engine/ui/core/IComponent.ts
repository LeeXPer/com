namespace LUI {
	export interface IComponent {
		data: any;
		x: number;
		y: number;
		height: number;
		width: number;
		enabled: boolean;
		dispose(): void;
		move(x: number, y: number): void;
		size(w: number, h: number): void;
	}
}
