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
		COM.removeProtocolFilter(item.getProtocol());
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
		ClientEventDispacher.register(ClientEvents.ControllerConnection, this.onUpdate, this);
		this.protocolList = protocol;
		this.protocolList.forEach((p) => this.build(p));
	}
	private build(protocol: Protocol): void {
		COM.setProtocolFilter(protocol);
		var item = new StateData(protocol);
		this.items.push(item);
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
