///<reference path="StateData.ts" />
class ConnectionStateIcons {
	private html: HTMLDivElement;
	private timeout: number;
	private duration: number;
	private current: number;
	private valueField: HTMLSpanElement;
	private nameField: HTMLSpanElement;
	private unitField: HTMLSpanElement;
	private icon: HTMLElement;
	private startInterval: number;
	private getCount: () => number;
	private getItem: (idx: number) => StateData;

	constructor(getItemFromIndex: (idx: number) => StateData, getCount: () => number) {
		this.timeout = -1;
		this.startInterval = -1;
		this.current = -1;
		this.duration = 6000;
		this.getCount = getCount;
		this.getItem = getItemFromIndex;
		this.init();
	}
	dispose(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		if (this.startInterval) {
			clearInterval(this.startInterval);
		}
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.current = -1;
		this.html = null;
	}
	getHtml(): HTMLDivElement {
		return this.html;
	}

	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'wifistate';
		this.icon = document.createElement('i');
		this.icon.className = 'fa fa-wifi wifilevelicon good';
		this.html.appendChild(this.icon);
		this.valueField = document.createElement('span');
		this.valueField.className = 'value';
		this.html.appendChild(this.valueField);
		this.unitField = document.createElement('span');
		this.unitField.className = 'unit';
		this.html.appendChild(this.unitField);
		this.nameField = document.createElement('span');
		this.nameField.className = 'name';
		this.html.appendChild(this.nameField);
		this.html.addEventListener('click', this.onClick.bind(this));
		this.startInterval = setInterval(this.tryToStart.bind(this), 100);
	}

	private tryToStart() {
		var item = this.getItem(0);
		if (!item) {
			return;
		}
		if (item.isReady()) {
			clearInterval(this.startInterval);
			this.showNext();
		}
	}
	private showNext(): void {
		this.current++;
		if (this.current == this.getCount()) {
			this.current = 0;
		}
		this.show(this.current);
		var scope = this;
		this.timeout = setTimeout(() => {
			scope.showNext();
		}, this.duration);
	}
	private show(i: number): void {
		var item = this.getItem(i);
		var val: number = item.getValue();
		this.valueField.innerText = val.toString();
		this.nameField.innerText = item.getName();
		this.unitField.innerText = 'RSSI';
		this.icon.classList.remove('poor', 'good', 'bad');
		var c: string = !item.getStatus() ? 'bad' : val > 20 ? 'good' : val > 10 ? 'poor' : 'bad';
		this.icon.classList.add(c);
	}
	private onClick(): void {
		var item = this.getItem(this.current);
		if (!item) {
			return;
		}
		window.open('http://' + item.getLink());
	}
}
