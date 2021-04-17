/// <reference path="cards/ICard.ts" />
/// <reference path="cards/DefaultCard.ts" />
/// <reference path="cards/GaugeCard.ts" />

class DefaultView implements IView {
	private root: HTMLDivElement;
	constructor(root: HTMLDivElement) {
		this.root = root;
	}
	build(): void {
		/* var cards = ['saun', 'eesruum', 'vannituba', 'küte'];
		var protocols = [
			'sonoff-saun.DS18B20.Temperature',
			'sonoff-saun.AM2301.Temperature',
			'sonoff-th-wc.AM2301.Temperature',
			'sonoff-floorheating-temps.DS18B20-1.Temperature',
		]; */

		var cards = [
			{
				label: 'saun',
				sublabel: 'leiliruum',
				type: Cards.GaugeCard,
				protocol: 'sonoff-saun.DS18B20.Temperature',
				options: {min: 15, max: 100, color: '#007800', unit: '°C'},
			},
			{
				label: 'saun',
				sublabel: 'puhkeruum',
				type: Cards.GaugeCard,
				protocol: 'sonoff-saun.AM2301.Temperature',
				options: {min: 15, max: 30, color: '#007800', unit: '°C'},
			},
			{
				label: 'saun',
				sublabel: 'eesruum',
				type: Cards.GaugeCard,
				protocol: 'sonoff-floorheating-temps.DS18B20-5.Temperature',
				options: {min: 15, max: 30, color: '#007800', unit: '°C'},
			},
			{
				label: 'saun',
				sublabel: 'niiskus',
				type: Cards.GaugeCard,
				protocol: 'sonoff-saun.AM2301.Humidity',
				options: {min: 30, max: 100, color: '#005599', unit: '%'},
			},
			{
				label: 'vannituba',
				sublabel: 'temperatuur',
				type: Cards.GaugeCard,
				protocol: 'sonoff-th-wc.AM2301.Temperature',
				options: {min: 15, max: 30, color: '#007800', unit: '°C'},
			},
			{
				label: 'vannituba',
				sublabel: 'niiskus',
				type: Cards.GaugeCard,
				protocol: 'sonoff-th-wc.AM2301.Humidity',
				options: {min: 30, max: 100, color: '#005599', unit: '%'},
			},

			{
				label: 'põrandaküte',
				sublabel: 'pealevool',
				type: Cards.GaugeCard,
				protocol: 'sonoff-floorheating-temps.DS18B20-2.Temperature',
				options: {min: 18, max: 30, color: '#770099', unit: '°C'},
			},
			{
				label: 'põrandaküte',
				sublabel: 'tagasivool',
				type: Cards.GaugeCard,
				protocol: 'sonoff-floorheating-temps.DS18B20-1.Temperature',
				options: {min: 18, max: 30, color: '#770099', unit: '°C'},
			},
			{
				label: 'lisaküte',
				sublabel: 'pealevool',
				type: Cards.GaugeCard,
				protocol: 'sonoff-floorheating-temps.DS18B20-4.Temperature',
				options: {min: 18, max: 50, unit: '°C'},
			},
			{
				label: 'lisaküte',
				sublabel: 'tagasivool',
				type: Cards.GaugeCard,
				protocol: 'sonoff-floorheating-temps.DS18B20-3.Temperature',
				options: {min: 18, max: 50, unit: '°C'},
			},
		];

		for (let index = 0; index < cards.length; index++) {
			switch (cards[index].type) {
				case Cards.GaugeCard: {
					var card: ICard = new GaugeCard();
					card.setHeader(cards[index].label, cards[index].sublabel);
					card.setProtocol(cards[index].protocol);
					(card as GaugeCard).setOptions(
						cards[index].options.min,
						cards[index].options.max,
						cards[index].options.color,
						cards[index].options.unit
					);
					this.root.appendChild(card.getHTML());
				}
			}
		}
	}
}
