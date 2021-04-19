/// <reference path="../components/DeviceControls.ts" />
class ControllerCard implements ICard {
	private html: HTMLDivElement;
	private content: DeviceControls;
	private header: HTMLElement;
	private head: HTMLDivElement;
	private subheader: HTMLElement;
	private field: HTMLParagraphElement;
	private protocol: string;
	constructor() {
		this.init();
	}
	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.content = null;
		this.header = null;
		this.field = null;
		this.html = null;
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setProtocol(src: string): void {
		this.content.setProtocol(src);
	}
	setHeader(main: string, sub: string): void {
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}

	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'card';
		this.head = document.createElement('div');
		this.header = document.createElement('header');
		this.subheader = document.createElement('header');
		this.subheader.className = 'subheader';
		this.head.appendChild(this.header);
		this.head.appendChild(this.subheader);
		this.html.appendChild(this.head);
		this.content = new DeviceControls();

		this.html.appendChild(this.content.getHtml());
	}
}
