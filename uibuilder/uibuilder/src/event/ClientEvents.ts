/// <reference path="../protocol/Sensor.ts" />
const enum ClientEvents {
	SensorUpdate,
	ClientUpdate,
}
interface SensorUpdate {
	type: ClientEvents.SensorUpdate;
	protocol: string;
	data: number;
}
interface ClientUpdate {
	type: ClientEvents.ClientUpdate;
}
