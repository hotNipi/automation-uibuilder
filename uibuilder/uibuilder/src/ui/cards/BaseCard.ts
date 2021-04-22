class BaseCard implements ICard {
	protected html: HTMLDivElement;
	protected head: HTMLElement;
	protected large: boolean;

	constructor() {
		this.init();
	}
	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.head = null;
		this.html = null;
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setProtocol(src: string): void {}
	setHeader(main: string, sub?: string, icon?: string): void {}
	protected init(): void {
		this.large = false;
		this.html = document.createElement('div');
		this.html.className = 'card';
		this.head = document.createElement('div');
		this.head.className = 'cardhead';
		this.head.onclick = this.resize.bind(this);
	}

	protected resize(): void {
		if (this.large) {
			this.large = false;
			this.html.classList.remove('large');
		} else {
			this.large = true;
			this.html.classList.add('large');
		}
	}
}
