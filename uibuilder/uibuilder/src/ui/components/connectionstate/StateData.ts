class StateData {
	private protocol: Protocol;
	private data: ControllerConnectionData;
	constructor(protocol: Protocol) {
		this.protocol = protocol;
	}
	getProtocol(): Protocol {
		return this.protocol;
	}
	getName(): string {
		if (!this.data) {
			return '';
		}
		var ret: string = this.data.name;
		if (this.data.status == 'Offline') {
			ret += ' ... ühenduseta';
		}
		return ret;
	}
	isReady(): boolean {
		return this.getName() != '' && this.getValue() != 0;
	}
	getStatus(): boolean {
		return this.data?.status != 'Offline';
	}
	getLink(): string {
		return this.data?.ip || '';
	}
	getValue(): number {
		return this.data?.RSSI || 0;
	}
	dispose(): void {
		this.data = null;
		this.protocol = null;
	}
	update(msg: ControllerConnection): void {
		this.data = msg.data;
	}
}
