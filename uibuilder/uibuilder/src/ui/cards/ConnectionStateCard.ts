/// <reference path="../components/connectionstate/ConnectionStateChart.ts" />
/// <reference path="../components/connectionstate/ConnectionStateIcons.ts" />
class ConnectionStateCard extends BaseCard implements ICard {
	private content: ConnectionStateIcons | ConnectionStateChart;
	private header: HTMLElement;

	private subheader: HTMLElement;

	constructor() {
		super();
	}

	dispose(): void {
		this.content.dispose();
		this.content = null;
		this.header = null;
		super.dispose();
	}

	setProtocol(p: Protocol[]): void {
		this.content.setProtocol(p);
	}
	setHeader(main: string, sub?: string, icon?: string): void {
		super.setHeader(main, sub, icon);
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}

	protected iconsState(state: string): void {}

	protected init(): void {
		super.init();
		this.header = document.createElement('header');

		this.subheader = document.createElement('header');
		this.subheader.className = 'subheader';
		this.head.appendChild(this.header);
		this.head.appendChild(this.subheader);
		this.html.appendChild(this.head);

		this.content = new ConnectionStateIcons();

		this.html.appendChild(this.content.getHtml());
	}
	protected resize(): void {
		super.resize();
	}
}
