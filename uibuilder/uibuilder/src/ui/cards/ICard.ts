interface ICard {
	setGrowMode(grow: GrowMode): void;
	getHTML(): HTMLDivElement;
	setHeader: (main: string, sub?: string, icon?: string) => void;
	setProtocol: (src: string) => void;
	dispose: () => void;
}
interface IGaugeCard extends ICard {
	setOptions: (min: number, max: number, color: string, unit?: string, image?: string) => void;
}
interface IControllerCard extends ICard {}
const enum Cards {
	DfaultCard,
	GaugeCard,
	ControllerCard,
}
const enum DeviceType {
	Light,
	Vent,
	Socket,
	Sound,
}
const enum GrowMode {
	Width = 'wide',
	Height = 'tall',
	Both = 'large',
}
