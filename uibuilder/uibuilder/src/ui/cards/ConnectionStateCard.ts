/// <reference path="../components/connectionstate/ConnectionStateChart.ts" />
/// <reference path="../components/connectionstate/ConnectionStateIcons.ts" />
/// <reference path="../components/connectionstate/ConnectionStateController.ts" />
class ConnectionStateCard extends BaseCard implements ICard {
	private content: ConnectionStateIcons | ConnectionStateChart;
	private controller: ConnectionStateController;
	private header: HTMLElement;
	private protocol: Protocol[];

	private subheader: HTMLElement;

	constructor() {
		super();
		this.controller = new ConnectionStateController();
	}

	dispose(): void {
		this.disposeContent();
		this.controller.setUpdateListener(null);
		this.controller.dispose();
		this.controller = null;
		this.header = null;
		super.dispose();
	}
	private disposeContent(): void {
		if (!this.content) {
			return;
		}
		this.content.dispose();
		this.content = null;
	}
	getItemFromIndex(idx: number): StateData {
		return this.controller.getItemFromIndex(idx);
	}
	getItem(p: Protocol): StateData {
		return this.controller.getItem(p);
	}
	getCount(): number {
		return this.controller.getCount();
	}

	setProtocol(p: Protocol[]): void {
		this.controller.setProtocol(p);
		this.protocol = p;
	}
	setHeader(main: string, sub?: string, icon?: string): void {
		super.setHeader(main, sub, icon);
		this.header.innerHTML = main;
		this.subheader.innerHTML = sub;
	}

	protected init(): void {
		super.init();
		this.header = document.createElement('header');
		this.subheader = document.createElement('header');
		this.subheader.className = 'subheader';
		this.head.appendChild(this.header);
		this.head.appendChild(this.subheader);
		this.html.appendChild(this.head);

		this.content = new ConnectionStateIcons(
			this.getItemFromIndex.bind(this),
			this.getCount.bind(this)
		);

		this.html.appendChild(this.content.getHtml());
	}
	protected resize(): void {
		super.resize();
		if (this.large) {
			if (this.content) {
				this.html.removeChild(this.content.getHtml());
				this.disposeContent();
				this.content = new ConnectionStateChart(
					this.getItem.bind(this),
					this.getCount.bind(this),
					this.protocol
				);
				this.controller.setUpdateListener(this.content.update.bind(this));

				this.html.appendChild(this.content.getHtml());
			}
		} else {
			if (this.content) {
				this.controller.setUpdateListener(null);
				this.html.removeChild(this.content.getHtml());
				this.disposeContent();
			}
			this.content = new ConnectionStateIcons(
				this.getItemFromIndex.bind(this),
				this.getCount.bind(this)
			);

			this.html.appendChild(this.content.getHtml());
		}
	}
}
