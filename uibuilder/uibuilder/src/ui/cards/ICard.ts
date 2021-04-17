interface ICard {
	getHTML(): HTMLDivElement;
	setHeader: (main: string, sub?: string, icon?: string) => void;
	setProtocol: (src: string) => void;
}
interface IGaugeCard extends ICard {
	setOptions: (min: number, max: number, color: string) => void;
}
const enum Cards {
	DfaultCard,
	GaugeCard,
}
