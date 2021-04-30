const enum ButtonLabelState {
	ON = 'ON',
	OFF = 'OFF',
	AUTO = 'AUTO',
	MANUAL = 'MANUAL',
	UPDATED = 'Uuendatud: ',
}
class DeviceControls {
	private html: HTMLDivElement;
	private powerButton: HTMLDivElement;
	private autoButton: HTMLDivElement;
	private updateField: HTMLDivElement;
	private protocol: Protocol;
	private large: boolean;
	private iconsStateHandler: (state: string) => void;

	constructor(iconState: (state: string) => void) {
		this.init();
		this.iconsStateHandler = iconState;
	}
	dispose(): void {
		ClientEventDispacher.unregister(ClientEvents.DeviceUpdate, this.onDeviceUpdate, this);
		COM.sendProtocolChannelClose(this.protocol);
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.updateField = null;
		this.powerButton = null;
		this.autoButton = null;
		this.html = null;
	}
	getHtml(): HTMLDivElement {
		return this.html;
	}
	setProtocol(p: Protocol[]): void {
		this.protocol = p[0];
		this.connect();
	}
	protected connect(): void {
		ClientEventDispacher.register(ClientEvents.DeviceUpdate, this.onDeviceUpdate, this);
		if (COM.sessionEstablished()) {
			this.onConnection();
		} else {
			ClientEventDispacher.register(ClientEvents.Connected, this.onConnection, this);
		}
	}

	private onConnection(): void {
		COM.sendProtocolChannelRequest(this.protocol);
	}

	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'devicecontrols';
		this.powerButton = document.createElement('div');
		this.powerButton.className = 'button ripple';
		this.autoButton = document.createElement('div');
		this.autoButton.className = 'button ripple';
		this.updateField = document.createElement('div');
		this.updateField.className = 'datefield';

		this.autoButton.classList.add('hidden');

		this.autoButton.onclick = this.onAutoClick.bind(this);
		this.powerButton.onclick = this.onPowerClick.bind(this);

		this.html.appendChild(this.powerButton);
		this.html.appendChild(this.autoButton);

		this.powerButton.innerHTML = ButtonLabelState.ON;
		this.autoButton.innerHTML = ButtonLabelState.AUTO;

		this.html.appendChild(this.updateField);
	}

	private onDeviceUpdate(msg: DeviceUpdate): void {
		if (msg.protocol != this.protocol) {
			return;
		}
		//	console.log('onDeviceUpdate', msg);
		this.powerButton.innerHTML = msg.state;
		this.powerButton.classList.remove('on', 'off');
		this.autoButton.classList.remove('auto', 'manual');
		this.powerButton.classList.add(msg.state.toLowerCase());
		this.updateField.innerHTML =
			ButtonLabelState.UPDATED + new Date(msg.lastupdate).toLocaleTimeString();

		this.autoButton.innerHTML = msg.auto == true ? ButtonLabelState.AUTO : ButtonLabelState.MANUAL;
		this.autoButton.classList.add(this.autoButton.innerHTML.toLowerCase());
		if (this.large) {
			this.autoButton.classList.remove('hidden');
		} else {
			this.autoButton.classList.add('hidden');
		}
		this.iconsStateHandler(msg.state.toLowerCase());
	}
	private onAutoClick(): void {
		COM.out({topic: NodeRedMessage.DeviceUpdate, protocol: this.protocol, payload: 'auto'});
	}
	private onPowerClick(): void {
		COM.out({topic: NodeRedMessage.DeviceUpdate, protocol: this.protocol, payload: 'power'});
	}
	public resize(large: boolean): void {
		this.large = large;
		if (large) {
			this.autoButton.classList.remove('hidden');
		} else {
			this.autoButton.classList.add('hidden');
		}
	}
}
