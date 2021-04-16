interface ENERGY {
	name: string;
	lastupdate: number;
	Period: number;
	Total: number;
	Today: number;
	Yesterday: number;
	Voltage: number;
	Current: number;
	Power: number;
	Factor: number;
}

interface AM2301 {
	name: string;
	lastupdate: number;
	Temperature: number;
	Humidity: number;
}
interface DS18B20 {
	name: string;
	lastupdate: number;
	Temperature: number;
}
interface SensorUpdate {
	type: ClientEvents.SensorUpdate;
	protocol: string;
	data: number;
}
interface ClientUpdate {
	type: ClientEvents.ClientUpdate;
}
