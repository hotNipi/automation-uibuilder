class ConnectionStateChart {
	private protocolList: Protocol[];
	private html: HTMLDivElement;
	constructor(protocol: Protocol[]) {
		this.protocolList = protocol;
	}
	dispose(): void {}
	getHtml(): HTMLDivElement {
		return this.html;
	}
	setProtocol(protocol: Protocol[]): void {
		ClientEventDispacher.register(ClientEvents.DeviceUpdate, this.onUpdate, this);
		this.protocolList = protocol;
		this.protocolList.forEach((p) => this.build(p));
	}
	private build(protocol: Protocol): void {
		COM.setProtocolFilter(protocol);
	}
	private onUpdate(msg: ControllerConnection): void {
		if (!this.protocolList.includes(msg.protocol)) {
			return;
		}
	}
}
