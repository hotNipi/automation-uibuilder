/// <reference path="../protocol/Protocol.ts" />
const enum ClientEvents {
	Connected,
	Disconnected,
	SensorUpdate,
	DeviceUpdate,
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
