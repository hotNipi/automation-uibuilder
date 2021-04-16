/// <reference path="protocol/NodeRedMessage.ts" />
interface COM {
	in: (msg: any) => void;
	out: (msg: any) => void;
}
var COM: COM;
class Communcator implements COM {
	constructor() {}
	in(msg: any): void {
		console.log('[COM]in:', msg);
		if (msg.topic == NodeRedMessage.SensorUpdate) {
			this.toSensorEvent(msg);
		}
	}
	out(msg: any): void {
		return;
	}

	private toSensorEvent(m: any): void {
		var su: SensorUpdate = {
			type: ClientEvents.SensorUpdate,
			protocol: m.protocol,
			data: m.payload,
		};
		ClientEventDispacher.dispatch(su);
	}
}
