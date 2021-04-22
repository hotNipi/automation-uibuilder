/// <reference path="../components/DeviceControls.ts" />
class ControllerCard extends BaseCard implements ICard {
	private content: DeviceControls;
	private header: HTMLElement;

	private subheader: HTMLElement;
	private field: HTMLParagraphElement;
	private protocol: string;

	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.content = null;
		this.header = null;
		this.field = null;
		this.html = null;
	}

	setProtocol(src: string): void {
		this.content.setProtocol(src);
	}
	setHeader(main: string, sub: string): void {
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}

	protected init(): void {
		super.init();
		this.header = document.createElement('header');

		this.subheader = document.createElement('header');
		this.subheader.className = 'subheader';
		this.head.appendChild(this.header);
		this.head.appendChild(this.subheader);
		this.html.appendChild(this.head);
		this.content = new DeviceControls();

		this.html.appendChild(this.content.getHtml());
	}
	protected resize(): void {
		super.resize();
		this.content.resize(this.large);
	}
}
