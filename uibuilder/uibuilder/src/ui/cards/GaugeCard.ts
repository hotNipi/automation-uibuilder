/// <reference path="../components/FillGauge.ts" />
class GaugeCard implements IGaugeCard {
	private html: HTMLDivElement;
	private content: FillGauge;
	private header: HTMLElement;
	private head: HTMLDivElement;
	private subheader: HTMLElement;

	private protocol: string;
	constructor() {
		this.init();
	}
	dispose(): void {
		ClientEventDispacher.unregister(ClientEvents.SensorUpdate, this.onSensorUpdate, this);
		this.content.dispose();
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.content = null;
		this.header = null;
		this.subheader = null;
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setProtocol(src: string): void {
		this.protocol = src;
	}
	setHeader(main: string, sub: string): void {
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}
	setOptions(min: number, max: number, color?: string, unit?: string): void {
		this.content.setOptions(min, max, color, unit);
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
		this.content = new FillGauge(15, 100);
		this.html.appendChild(this.content.getHTML());

		ClientEventDispacher.register(ClientEvents.SensorUpdate, this.onSensorUpdate, this);
	}
	private onSensorUpdate(msg: SensorUpdate): void {
		if (msg.protocol == this.protocol) {
			this.content.update(msg.data);
		}
	}
}
