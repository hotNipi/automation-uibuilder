///<reference path="StateData.ts" />
class ConnectionStateIcons {
	private protocolList: Protocol[];
	private html: HTMLDivElement;
	private items: StateData[];
	private timeout: number;
	private duration: number;
	private current: number;
	private valueField: HTMLSpanElement;
	private nameField: HTMLSpanElement;
	private unitField: HTMLSpanElement;
	private icon: HTMLElement;
	private isStarted: boolean;
	private startInterval: number;

	constructor() {
		this.timeout = -1;
		this.startInterval = -1;
		this.current = -1;
		this.duration = 6000;
		this.items = [];
		this.isStarted = false;
		this.init();
	}
	dispose(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		if (this.startInterval) {
			clearInterval(this.startInterval);
		}
		ClientEventDispacher.unregister(ClientEvents.ControllerConnection, this.onUpdate, this);
		this.items.forEach((item) => this.destroy(item));
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.items = null;
		this.html = null;
	}
	private destroy(item: StateData): void {
		COM.removeProtocolFilter(item.getProtocol());
		item.dispose();
		item = null;
	}
	getHtml(): HTMLDivElement {
		return this.html;
	}
	setProtocol(protocol: Protocol[]): void {
		ClientEventDispacher.register(ClientEvents.ControllerConnection, this.onUpdate, this);
		this.protocolList = protocol;
		this.protocolList.forEach((p) => this.build(p));
		this.startInterval = setInterval(this.tryToStart.bind(this), 100);
	}
	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'wifistate';
		this.icon = document.createElement('i');
		this.icon.className = 'fa fa-wifi wifilevelicon good';
		this.html.appendChild(this.icon);
		this.valueField = document.createElement('span');
		this.valueField.className = 'value';
		this.html.appendChild(this.valueField);
		this.unitField = document.createElement('span');
		this.unitField.className = 'unit';
		this.html.appendChild(this.unitField);
		this.nameField = document.createElement('span');
		this.nameField.className = 'name';
		this.html.appendChild(this.nameField);
		this.html.addEventListener('click', this.onClick.bind(this));
	}
	private build(protocol: Protocol): void {
		COM.setProtocolFilter(protocol);
		var item = new StateData(protocol);
		this.items.push(item);
	}

	private tryToStart() {
		if (!this.items) {
			return;
		}
		if (this.items.length == 0) {
			return;
		}
		if (this.items[0].isReady()) {
			this.isStarted = true;
			clearInterval(this.startInterval);
			this.showNext();
		}
	}
	private showNext(): void {
		this.current++;
		if (this.current == this.items.length) {
			this.current = 0;
		}
		this.show(this.current);
		var scope = this;
		this.timeout = setTimeout(() => {
			scope.showNext();
		}, this.duration);
	}
	private show(i: number): void {
		var val: number = this.items[i].getValue();
		this.valueField.innerText = val.toString();
		this.nameField.innerText = this.items[i].getName();
		this.unitField.innerText = 'RSSI';
		this.icon.classList.remove('poor', 'good', 'bad');
		var c: string = !this.items[i].getStatus()
			? 'bad'
			: val > 20
			? 'good'
			: val > 10
			? 'poor'
			: 'bad';
		this.icon.classList.add(c);
	}
	private onClick(): void {
		if (!this.items) {
			return;
		}
		window.open('http://' + this.items[this.current].getLink());
	}
	private onUpdate(msg: ControllerConnection): void {
		if (!this.protocolList.includes(msg.protocol)) {
			return;
		}
		var item = this.items.find((i) => i.getProtocol() == msg.protocol);
		item.update(msg);
	}
}
