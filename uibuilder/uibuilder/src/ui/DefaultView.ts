/// <reference path="cards/ICard.ts" />
/// <reference path="cards/DefaultCard.ts" />

class DefaultView implements IView {
	private root: HTMLDivElement;
	constructor(root: HTMLDivElement) {
		this.root = root;
	}
	build(): void {
		var cards = ['saun', 'eesruum', 'vannituba', 'küte'];
		var protocols = [
			'sonoff-saun.DS18B20.Temperature',
			'sonoff-saun.AM2301.Temperature',
			'sonoff-th-wc.AM2301.Temperature',
			'sonoff-floorheating-temps.DS18B20-1.Temperature',
		];
		for (let index = 0; index < cards.length; index++) {
			var card: ICard = new DefaultCard();
			card.setHeader(cards[index]);
			card.setProtocol(protocols[index]);
			this.root.appendChild(card.getHTML());
		}
	}
}
