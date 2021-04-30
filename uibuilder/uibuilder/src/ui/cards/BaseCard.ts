class BaseCard implements ICard {
	protected html: HTMLDivElement;
	protected head: HTMLElement;
	protected large: boolean;
	protected icon: HTMLDivElement;
	protected growMode: GrowMode;

	constructor() {
		this.init();
	}
	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.icon = null;
		this.head = null;
		this.html = null;
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	setGrowMode(mode: GrowMode): void {
		this.growMode = mode;
	}
	setProtocol(p: Protocol[]): void {}
	setHeader(main: string, sub?: string, icon?: string): void {
		if (icon) {
			var ic = document.createElement('i');
			ic.className = icon;
			this.icon.appendChild(ic);
		}
	}
	protected init(): void {
		this.large = false;
		this.html = document.createElement('div');
		this.html.className = 'card';
		this.head = document.createElement('div');
		this.head.className = 'cardhead';
		this.icon = document.createElement('div');
		this.icon.className = 'cardicon iconcolor';
		this.head.appendChild(this.icon);
		this.head.onclick = this.resize.bind(this);
		this.html.appendChild(this.head);
	}

	protected connect(): void {
		throw Error('not implemented');
	}

	protected resize(): void {
		if (this.large) {
			this.large = false;
			this.html.classList.remove(this.growMode);
		} else {
			this.large = true;
			this.html.classList.add(this.growMode);
		}
	}
}
