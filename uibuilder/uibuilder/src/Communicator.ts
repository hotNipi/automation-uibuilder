/// <reference path="protocol/NodeRedMessage.ts" />
interface COM {
	in: (msg: any) => void;
	out: (msg: any) => void;
	setReceiver: (r: any) => void;
	connection: (flag: boolean) => void;
}
var COM: COM;
class Communcator implements COM {
	private receiver: any;
	private connected: boolean;
	constructor() {
		this.receiver = null;
	}
	connection(flag: boolean): void {
		this.connected = flag;
		if (flag) {
			ClientEventDispacher.dispatch({type: ClientEvents.Connected});
		} else {
			ClientEventDispacher.dispatch({type: ClientEvents.Disconnected});
		}
	}
	in(msg: any): void {
		if (msg.topic == NodeRedMessage.SensorUpdate) {
			this.toSensorEvent(msg);
		}
		if (msg.topic == NodeRedMessage.DeviceUpdate) {
			//console.log('[COM]in:', msg);
			this.toDeviceEvent(msg);
		}
	}
	out(msg: any): void {
		if (!this.connected) {
			console.log('[COM] no connection');
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
}
