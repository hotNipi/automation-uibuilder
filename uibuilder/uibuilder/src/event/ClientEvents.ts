/// <reference path="../protocol/Protocol.ts" />
const enum ClientEvents {
	Connected,
	Disconnected,
	SensorUpdate,
	DeviceUpdate,
	ControllerConnection,
}
interface ControllerConnection {
	type: ClientEvents.ControllerConnection;
	protocol: Protocol;
	data: ControllerConnectionData;
}

interface ControllerConnectionData {
	status: string;
	ip: string;
	ap: string;
	RSSI: number;
	name: string;
}
interface SensorUpdate {
	type: ClientEvents.SensorUpdate;
	protocol: Protocol;
	data: number;
}
interface DeviceUpdate {
	type: ClientEvents.DeviceUpdate;
	protocol: Protocol;
	state: string;
	auto: boolean;
	lastupdate: number;
}
