/// <reference path="protocol/NodeRedMessage.ts" />
interface COM {
	in: (msg: any) => void;
	out: (msg: any) => void;
	setReceiver: (r: any) => void;
}
var COM: COM;
class Communcator implements COM {
	private receiver: any;
	constructor() {
		this.receiver = null;
	}
	in(msg: any): void {
		if (msg.topic == NodeRedMessage.SensorUpdate) {
			this.toSensorEvent(msg);
		}
		if (msg.topic == NodeRedMessage.DeviceUpdate) {
			console.log('[COM]in:', msg);
			this.toDeviceEvent(msg);
		}
	}
	out(msg: any): void {
		console.log('[COM]out', msg);
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
		console.log(m);
		var u: DeviceUpdate = {
			type: ClientEvents.DeviceUpdate,
			protocol: m.protocol,
			state: m.payload.state,
			auto: m.payload.auto,
		};
		ClientEventDispacher.dispatch(u);
	}
}
