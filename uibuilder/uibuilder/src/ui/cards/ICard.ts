interface ICard {
	getHTML(): HTMLDivElement;
	setContent: (txt: string) => void;
	setHeader: (txt: string) => void;
	setProtocol: (src: string) => void;
}
