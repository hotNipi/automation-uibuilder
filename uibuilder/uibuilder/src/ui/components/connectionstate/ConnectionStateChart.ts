class ConnectionStateChart {
	private html: HTMLDivElement;

	private protocolList: Protocol[];
	private getCount: () => number;
	private getItem: (p: Protocol) => StateData;

	constructor(getItem: (p: Protocol) => StateData, getCount: () => number, protocol: Protocol[]) {
		this.protocolList = protocol;
		this.getCount = getCount;
		this.getItem = getItem;
		this.init();
	}
	dispose(): void {
		while (this.html.firstChild) {
			this.html.removeChild(this.html.lastChild);
		}
		this.getCount = null;
		this.getItem = null;
		this.html = null;
	}
	getHtml(): HTMLDivElement {
		return this.html;
	}
	update(p: Protocol): void {
		var item = this.getItem(p);
		var e: HTMLElement = document.getElementById('line_' + p);
		e.style.width = item.getValue() + '%';
		e.classList.remove('good-bg', 'poor-bg', 'bad-bg');
		var c: string = !item.getStatus()
			? 'bad-bg'
			: item.getValue() > 20
			? 'good-bg'
			: item.getValue() > 10
			? 'poor-bg'
			: 'bad-bg';
		e.classList.add(c);
		e = document.getElementById('value_' + item.getProtocol());
		e.innerText = item.getValue().toString();
	}
	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'wifichart';
		for (var i = 0; i < this.getCount(); i++) {
			var item = this.getItem(this.protocolList[i]);
			var row: HTMLDivElement = document.createElement('div');
			row.className = 'chartrow';
			this.html.appendChild(row);
			var node: HTMLElement = document.createElement('div');
			node.className = 'rowname';
			node.innerText = item.getName();
			row.appendChild(node);
			node = document.createElement('div');
			node.className = 'rowline';
			node.setAttribute('id', 'line_' + item.getProtocol());
			node.style.width = 0 + '%';
			var c: string = !item.getStatus()
				? 'bad-bg'
				: item.getValue() > 20
				? 'good-bg'
				: item.getValue() > 10
				? 'poor-bg'
				: 'bad-bg';
			node.classList.add(c);
			row.appendChild(node);
			node = document.createElement('div');
			node.className = 'rowvalue';
			node.setAttribute('id', 'value_' + item.getProtocol());
			node.innerText = item.getValue().toString();
			row.appendChild(node);
		}
		setTimeout(this.updateAll.bind(this), 100);
	}
	private updateAll(): void {
		this.protocolList.forEach((p) => this.update(p));
	}
}
