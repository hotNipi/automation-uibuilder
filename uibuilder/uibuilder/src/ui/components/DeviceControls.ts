const enum ButtonLabelState {
	ON = 'ON',
	OFF = 'OFF',
	AUTO = 'AUTO',
	MANUAL = 'MANUAL',
}
class DeviceControls {
	private html: HTMLDivElement;
	private powerButton: HTMLDivElement;
	private autoButton: HTMLDivElement;
	private protocol: string;

	constructor() {
		this.init();
	}
	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.powerButton = null;
		this.autoButton = null;
		this.html = null;
	}
	getHtml(): HTMLDivElement {
		return this.html;
	}
	setProtocol(p: string): void {
		console.log('setproto', p);
		this.protocol = p;
		ClientEventDispacher.register(ClientEvents.DeviceUpdate, this.onDeviceUpdate, this);
	}
	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'devicecontrols';
		this.powerButton = document.createElement('div');
		this.powerButton.className = 'button ripple';
		this.autoButton = document.createElement('div');
		this.autoButton.className = 'button ripple';

		this.autoButton.onclick = this.onAutoClick.bind(this);
		this.powerButton.onclick = this.onPowerClick.bind(this);
		this.html.appendChild(this.powerButton);
		this.html.appendChild(this.autoButton);

		this.powerButton.innerHTML = ButtonLabelState.ON;
		this.autoButton.innerHTML = ButtonLabelState.AUTO;
	}
	private onDeviceUpdate(msg: DeviceUpdate): void {
		if (msg.protocol == this.protocol) {
			this.powerButton.innerHTML = msg.state;
			this.autoButton.innerHTML =
				msg.auto == true ? ButtonLabelState.AUTO : ButtonLabelState.MANUAL;
		}
	}
	private onAutoClick(): void {
		COM.out({topic: NodeRedMessage.DeviceUpdate, protocol: this.protocol, payload: 'auto'});
	}
	private onPowerClick(): void {
		COM.out({topic: NodeRedMessage.DeviceUpdate, protocol: this.protocol, payload: 'power'});
	}
}
