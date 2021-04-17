/// <reference path="../components/FillGauge.ts" />
class DefaultCard implements ICard {
	private html: HTMLDivElement;
	private content: FillGauge;
	private header: HTMLElement;
	private field: HTMLParagraphElement;
	private protocol: string;
	constructor() {
		this.init();
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setProtocol(src: string): void {
		this.protocol = src;
	}
	setHeader(txt: string): void {
		this.header.innerHTML = txt;
	}
	setContent(txt: string): void {
		this.field.innerHTML = txt;
	}
	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'card';
		this.header = document.createElement('header');
		this.html.appendChild(this.header);
		this.content = new FillGauge(15, 100);
		this.field = document.createElement('p');
		this.html.appendChild(this.field);
		this.html.appendChild(this.content.getHTML());

		ClientEventDispacher.register(ClientEvents.SensorUpdate, this.onSensorUpdate, this);
	}
	private onSensorUpdate(msg: SensorUpdate): void {
		if (msg.protocol == this.protocol) {
			this.content.update(msg.data);
		}
	}
}
