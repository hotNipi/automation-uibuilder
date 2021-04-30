/// <reference path="protocol/NodeRedMessage.ts" />
interface COM {
	in: (msg: any) => void;
	out: (msg: any) => void;
	setProtocolFilter: (p: Protocol) => void;
	removeProtocolFilter: (p: Protocol) => void;
	sendProtocolChannelRequest: (p: Protocol) => void;
	sendProtocolChannelClose: (p: Protocol) => void;
	sendProtocolValueRequest: (p: Protocol) => void;
	sessionEstablished: () => boolean;
	setReceiver: (r: any) => void;
	connection: (flag: boolean) => void;
}
var COM: COM;
class Communcator implements COM {
	private receiver: any;
	private protocolfilter: Protocol[];
	private connected: boolean;
	constructor() {
		this.receiver = null;
		this.connected = false;
		this.protocolfilter = [Protocol.ProtocolFilter];
	}
	connection(flag: boolean): void {
		this.connected = flag;
		if (flag) {
			ClientEventDispacher.dispatch({type: ClientEvents.Connected});
		} else {
			ClientEventDispacher.dispatch({type: ClientEvents.Disconnected});
		}
	}
	sessionEstablished(): boolean {
		return this.connected;
	}
	setProtocolFilter(p: Protocol): void {
		if (!this.protocolfilter.includes(p)) {
			this.protocolfilter.push(p);
		}
	}
	removeProtocolFilter(p: Protocol): void {
		const index: number = this.protocolfilter.indexOf(p, 0);
		if (index > -1) {
			this.protocolfilter.splice(index, 1);
		}
	}
	sendProtocolChannelRequest(p: Protocol): void {
		this.setProtocolFilter(p);
		this.out({
			topic: NodeRedMessage.RequestProtocolChannel,
			protocol: p,
		});
	}
	sendProtocolChannelClose(p: Protocol): void {
		this.removeProtocolFilter(p);
		this.out({
			topic: NodeRedMessage.CloseProtocolChannel,
			protocol: p,
		});
	}
	sendProtocolValueRequest(p: Protocol): void {
		this.out({
			topic: NodeRedMessage.RequestProtocolValue,
			protocol: p,
		});
	}
	sendProtocolFilter(): void {
		this.out({
			topic: NodeRedMessage.ProtocolFilter,
			protocol: Protocol.ProtocolFilter,
			payload: this.protocolfilter,
		});
	}
	in(msg: any): void {
		if (!msg.protocol) {
			return;
		}
		if (!this.connected) {
			this.connection(true);
		}
		if (!this.protocolfilter.includes(msg.protocol)) {
			return;
		}
		if (msg.topic == NodeRedMessage.ProtocolFilter) {
			this.sendProtocolChannelRequest(Protocol.ProtocolFilter);
			return;
		}
		if (msg.topic == NodeRedMessage.SensorUpdate) {
			this.toSensorEvent(msg);
			return;
		}
		if (msg.topic == NodeRedMessage.DeviceUpdate) {
			//console.log('[COM]in:', msg);
			this.toDeviceEvent(msg);
			return;
		}
		if (msg.topic == NodeRedMessage.ControllerConnection) {
			//console.log('[COM]in:', msg);
			this.toControllerConnectionEvent(msg);
			return;
		}
	}
	out(msg: any): void {
		if (!this.connected) {
			console.log('[COM] no connection');
			return;
		}
		//console.log('[COM]out', msg);
		if (!this.receiver) {
			console.log('NO RECEIVER');
			return;
		}
		this.receiver(msg);
	}
	setReceiver(r: any): void {
		this.receiver = r;
	}

	private toSensorEvent(m: any): void {
		var u: SensorUpdate = {
			type: ClientEvents.SensorUpdate,
			protocol: m.protocol,
			data: m.payload,
		};
		ClientEventDispacher.dispatch(u);
	}
	private toDeviceEvent(m: any): void {
		var u: DeviceUpdate = {
			type: ClientEvents.DeviceUpdate,
			protocol: m.protocol,
			state: m.payload.state,
			auto: m.payload.auto,
			lastupdate: m.payload.lastupdate,
		};
		ClientEventDispacher.dispatch(u);
	}
	private toControllerConnectionEvent(m: any): void {
		var u: ControllerConnection = {
			type: ClientEvents.ControllerConnection,
			protocol: m.protocol,
			data: m.payload,
		};
		ClientEventDispacher.dispatch(u);
	}
}
