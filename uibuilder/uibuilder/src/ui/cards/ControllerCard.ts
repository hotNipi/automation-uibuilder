/// <reference path="../components/DeviceControls.ts" />
class ControllerCard extends BaseCard implements ICard {
	private content: DeviceControls;
	private header: HTMLElement;
	protected deviceType: DeviceType;
	private subheader: HTMLElement;

	constructor(deviceType: DeviceType) {
		super();
		this.deviceType = deviceType;
	}

	dispose(): void {
		this.content.dispose();
		this.content = null;
		this.header = null;
		this.html = null;
		super.dispose();
	}

	setProtocol(src: Protocol): void {
		this.content.setProtocol(src);
	}
	setHeader(main: string, sub?: string, icon?: string): void {
		super.setHeader(main, sub, icon);
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}

	protected iconsState(state: string): void {
		if (this.deviceType == DeviceType.Light) {
			if (state == 'on') {
				this.icon.classList.add('bulbshine');
				this.icon.classList.remove('iconcolor');
			} else {
				this.icon.classList.remove('bulbshine');
				this.icon.classList.add('iconcolor');
			}
		}
		if (this.deviceType == DeviceType.Sound) {
			if (state == 'on') {
				this.icon.classList.add('iconcolor-on');
				this.icon.classList.remove('iconcolor');
			} else {
				this.icon.classList.remove('iconcolor-on');
				this.icon.classList.add('iconcolor');
			}
		}
		if (this.deviceType == DeviceType.Vent) {
			if (state == 'on') {
				this.icon.classList.add('ventrun', 'rotate');
				this.icon.classList.remove('iconcolor');
			} else {
				this.icon.classList.remove('ventrun', 'rotate');
				this.icon.classList.add('iconcolor');
			}
		}
	}

	protected init(): void {
		super.init();
		this.header = document.createElement('header');

		this.subheader = document.createElement('header');
		this.subheader.className = 'subheader';
		this.head.appendChild(this.header);
		this.head.appendChild(this.subheader);
		this.html.appendChild(this.head);
		this.content = new DeviceControls(this.iconsState.bind(this));

		this.html.appendChild(this.content.getHtml());
	}
	protected resize(): void {
		super.resize();
		this.content.resize(this.large);
	}
}
