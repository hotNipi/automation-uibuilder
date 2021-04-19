class DefaultCard implements ICard {
	private html: HTMLDivElement;
	private content: HTMLDivElement;
	private header: HTMLElement;
	private field: HTMLParagraphElement;
	private protocol: string;
	constructor() {
		this.init();
	}
	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.content = null;
		this.header = null;
		this.field = null;
		this.html = null;
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setProtocol(src: string): void {
		this.protocol = src;
	}
	setHeader(txt: string): void {
		this.header.innerHTML = txt;
	}
	setContent(txt: string): void {
		this.field.innerHTML = txt;
	}
	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'card';
		this.header = document.createElement('header');
		this.html.appendChild(this.header);
		this.content = document.createElement('div');
		this.field = document.createElement('p');
		this.html.appendChild(this.field);
		this.html.appendChild(this.content);
	}
}
