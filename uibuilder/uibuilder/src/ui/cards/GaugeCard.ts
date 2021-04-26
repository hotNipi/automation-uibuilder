/// <reference path="../components/FillGauge.ts" />

class GaugeCard extends BaseCard implements IGaugeCard {
	private content: FillGauge;
	private header: HTMLElement;
	private image: HTMLDivElement;
	private subheader: HTMLElement;
	private protocol: Protocol;

	dispose(): void {
		ClientEventDispacher.unregister(ClientEvents.SensorUpdate, this.onSensorUpdate, this);
		COM.removeProtocolFilter(this.protocol);
		this.content.dispose();
		this.content = null;
		this.header = null;
		this.subheader = null;
		this.image = null;
		super.dispose();
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setProtocol(p: Protocol): void {
		this.protocol = p;
		COM.setProtocolFilter(this.protocol);
	}

	setHeader(main?: string, sub?: string, icon?: string): void {
		super.setHeader(main, sub, icon);
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}
	setOptions(min: number, max: number, color?: string, unit?: string, image?: string): void {
		this.content.setOptions(min, max, color, unit);
		if (image) {
			this.image.style.backgroundImage = 'url(' + image + ')';
		}
	}
	protected init(): void {
		super.init();
		this.image = document.createElement('div');
		this.image.className = 'img';
		this.html.appendChild(this.image);

		this.header = document.createElement('header');
		this.subheader = document.createElement('header');
		this.subheader.className = 'subheader';
		this.head.appendChild(this.header);
		this.head.appendChild(this.subheader);

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
