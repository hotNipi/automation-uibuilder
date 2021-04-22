interface ICard {
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
