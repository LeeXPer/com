namespace LUI {
	export interface IViewport extends Component{
		contentWidth:number;
		contentHeight:number;
		scrollV:number;
		scrollH:number;
		scrollEnabled:boolean;
	}
}