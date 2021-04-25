/// <reference path="../protocol/Sensor.ts" />
const enum ClientEvents {
	Connected,
	Disconnected,
	SensorUpdate,
	DeviceUpdate,
}
interface SensorUpdate {
	type: ClientEvents.SensorUpdate;
	protocol: string;
	data: number;
}
interface DeviceUpdate {
	type: ClientEvents.DeviceUpdate;
	protocol: string;
	state: string;
	auto: boolean;
	lastupdate: number;
}
