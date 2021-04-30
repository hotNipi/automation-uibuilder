///<reference path="StateData.ts" />
class ConnectionStateController {
	private protocolList: Protocol[];
	private items: StateData[];
	private updateSlave: (p: Protocol) => void;
	constructor() {
		this.items = [];
		this.updateSlave = null;
	}
	dispose(): void {
		ClientEventDispacher.unregister(ClientEvents.ControllerConnection, this.onUpdate, this);
		this.items.forEach((item) => this.destroy(item));
		this.items = null;
		this.protocolList = null;
	}
	private destroy(item: StateData): void {
		COM.sendProtocolChannelClose(item.getProtocol());
		item.dispose();
		item = null;
	}
	setUpdateListener(l: (p: Protocol) => void) {
		this.updateSlave = l;
	}

	getCount(): number {
		return this.items?.length | 0;
	}

	getItemFromIndex(idx: number): StateData {
		if (!this.items) {
			return null;
		}
		if (this.items.length == 0) {
			return null;
		}
		return this.items[idx];
	}

	getItem(p: Protocol): StateData {
		if (!this.items) {
			return null;
		}
		if (this.items.length == 0) {
			return null;
		}

		return this.items.find((i) => i.getProtocol() == p);
	}
	setProtocol(protocol: Protocol[]): void {
		this.protocolList = protocol;

		this.connect();
	}

	private connect(): void {
		ClientEventDispacher.register(ClientEvents.ControllerConnection, this.onUpdate, this);
		if (COM.sessionEstablished()) {
			this.onConnection();
		} else {
			ClientEventDispacher.register(ClientEvents.Connected, this.onConnection, this);
		}
	}
	private onConnection(): void {
		this.protocolList.forEach((p) => this.register(p));
	}

	private register(p: Protocol): void {
		this.build(p);
		COM.sendProtocolChannelRequest(p);
	}

	private build(protocol: Protocol): void {
		if (!this.getItem(protocol)) {
			var item = new StateData(protocol);
			this.items.push(item);
		}
	}
	private onUpdate(msg: ControllerConnection): void {
		if (!this.protocolList.includes(msg.protocol)) {
			return;
		}
		var item = this.items.find((i) => i.getProtocol() == msg.protocol);
		item.update(msg);
		if (this.updateSlave) {
			this.updateSlave(item.getProtocol());
		}
	}
}
