/// <reference path="ui/Layout.ts" />
/// <reference path="Communicator.ts" />
/// <reference path="EventBus.ts" />

declare interface Window {
	env: new () => void;
}

class Env {
	private display: ILayout;
	private communicator: COM;
	private receiver: any;
	constructor() {
		this.communicator = new Communcator();
		COM = this.communicator;
		ClientEventDispacher = new EventBus();
	}
	layout(container: HTMLDivElement): void {
		this.display = new Layout(container);
	}
	incoming(msg: any): void {
		COM.in(msg);
	}
	setReceiver(f: any): void {
		COM.setReceiver(f);
	}
}
window.env = Env;
