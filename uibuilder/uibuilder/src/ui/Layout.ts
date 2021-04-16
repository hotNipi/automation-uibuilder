/// <reference path="IView.ts" />
/// <reference path="DefaultView.ts" />
interface ILayout {}
class Layout {
	private root: HTMLDivElement;
	private view: IView;

	constructor(container: HTMLDivElement) {
		this.root = container;
		this.init();
	}

	private init(): void {
		this.view = new DefaultView(this.root);
		this.view.build();
	}
}
