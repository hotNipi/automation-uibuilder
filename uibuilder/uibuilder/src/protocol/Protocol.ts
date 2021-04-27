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

const enum Protocol {
	ProtocolFilter = 'node-red.protocol',
	SaunaTemp = 'sonoff-saun.DS18B20.Temperature',
	LobbyTemp = 'sonoff-floorheating-temps.DS18B20-5.Temperature',
	SaunaHum = 'sonoff-saun.AM2301.Humidity',
	BathroomTemp = 'sonoff-th-wc.AM2301.Temperature',
	BathroomHum = 'sonoff-th-wc.AM2301.Humidity',
	FloorHeatSupply = 'sonoff-floorheating-temps.DS18B20-2.Temperature',
	FloorHeatReturn = 'sonoff-floorheating-temps.DS18B20-1.Temperature',
	ExtrHeatSupply = 'sonoff-floorheating-temps.DS18B20-4.Temperature',
	ExtraHeatReturn = 'sonoff-floorheating-temps.DS18B20-3.Temperature',
	TvBackLight = 'tvbacklight',
	Amplifier = 'amplifier',
	MiniVent = 'minivent',
	Vent = 'vent',
	KitchenWorkLight = 'kitchenworklight',
	KitchenTopLight = 'kitchentoplight',
	BedUnderLight = 'bedunderlight',
	SonoffBackLightConnection = 'sonoff-backlight.connection',
	SonoffBedConnection = 'sonoff-bed.connection',
	SonoffKitchenShelfConnection = 'sonoff-kitchen-shelf.connection',
	SonoffWashingMashineConnection = 'sonoff-pesumasin.connection',
	SonoffTempRegConnection = 'sonoff-tempreg.connection',
	SonoffExtraHeatConnection = 'sonoff-extraheat.connection',
	SonoffFloorHeatingTempsConnection = 'sonoff-floorheating-temps.connection',
	SonoffSaunConnection = 'sonoff-saun.connection',
	SonoffAmpConnection = 'sonoff-amp.connection',
	SonoffSocketConnction = 'sonoff-socket.connection',
	SonoffThWcConnection = 'sonoff-th-wc.connection',
}
