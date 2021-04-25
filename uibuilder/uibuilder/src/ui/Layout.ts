/// <reference path="IView.ts" />
/// <reference path="DefaultView.ts" />
interface ILayout {}
class Layout {
	private root: HTMLDivElement;
	private view: IView;

	constructor(container: HTMLDivElement) {
		this.root = container;
		this.onConnectionLost();
		this.init();
	}

	private init(): void {
		ClientEventDispacher.register(ClientEvents.Connected, this.onConnection, this);
		ClientEventDispacher.register(ClientEvents.Disconnected, this.onConnectionLost, this);
		this.view = new DefaultView(this.root);
		this.view.build();
	}
	private onConnection() {
		this.root.style.filter = 'unset';
	}
	private onConnectionLost() {
		this.root.style.filter = 'sepia(100%) blur(1px)';
	}
}
