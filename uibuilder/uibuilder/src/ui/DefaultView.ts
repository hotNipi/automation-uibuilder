/// <reference path="cards/ICard.ts" />
/// <reference path="cards/BaseCard.ts"/>
/// <reference path="cards/GaugeCard.ts" />
/// <reference path="cards/ControllerCard.ts" />

class DefaultView implements IView {
	private root: HTMLDivElement;
	constructor(root: HTMLDivElement) {
		this.root = root;
	}
	build(): void {
		var cards: any = [
			{
				label: 'saun',
				sublabel: 'leiliruum',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.SaunaTemp,
				options: {min: 15, max: 100, color: '#007800', unit: '°C', image: 'images/saun.jpg'},
				layout: false,
			},

			{
				label: 'saun',
				sublabel: 'eesruum',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.LobbyTemp,
				options: {min: 15, max: 30, color: '#007800', unit: '°C', image: 'images/eesruum.jpg'},
			},
			{
				label: 'saun',
				sublabel: 'niiskus',
				icon: 'fa fa-tint',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.SaunaHum,
				options: {
					min: 30,
					max: 100,
					color: '#005599',
					unit: '%',
					image: 'images/niiskus.jpg',
				},
			},
			{
				label: 'vannituba',
				sublabel: 'temperatuur',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.BathroomTemp,
				options: {min: 15, max: 30, color: '#007800', unit: '°C', image: 'images/vannituba.jpg'},
			},
			{
				label: 'vannituba',
				sublabel: 'niiskus',
				icon: 'fa fa-tint',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.BathroomHum,
				options: {
					min: 30,
					max: 100,
					color: '#005599',
					unit: '%',
					image: 'images/vannituba-niiskus.jpg',
				},
			},

			{
				label: 'põrandaküte',
				sublabel: 'pealevool',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.FloorHeatSupply,
				options: {min: 18, max: 30, color: '#770099', unit: '°C', image: 'images/pk-pealevool.jpg'},
			},
			{
				label: 'põrandaküte',
				sublabel: 'tagasivool',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.FloorHeatReturn,
				options: {
					min: 18,
					max: 30,
					color: '#770099',
					unit: '°C',
					image: 'images/pk-tagasivool.jpg',
				},
			},
			{
				label: 'lisaküte',
				sublabel: 'pealevool',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.ExtrHeatSupply,
				options: {min: 18, max: 50, unit: '°C', image: 'images/lisa-peale.jpg'},
			},
			{
				label: 'lisaküte',
				sublabel: 'tagasivool',
				icon: 'fa fa-thermometer',
				type: Cards.GaugeCard,
				grow: GrowMode.Both,
				protocol: Protocol.ExtraHeatReturn,
				options: {min: 18, max: 50, unit: '°C', image: 'images/lisa-tagasi.jpg'},
			},
			{
				label: 'Taustvalgus',
				sublabel: 'Televiisori taustvalgus',
				icon: 'fa fa-lightbulb-o',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Light,
				protocol: Protocol.TvBackLight,
			},
			{
				label: 'Võimendi',
				sublabel: 'Puhkeruumi sound',
				icon: 'fa fa-music',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Sound,
				protocol: Protocol.Amplifier,
			},
			{
				label: 'Mini ventilaatorid',
				sublabel: 'Puhkeruumi õhuringlus',
				icon: 'fa fa-crosshairs',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Vent,
				protocol: Protocol.MiniVent,
			},
			{
				label: 'Ventilaator',
				sublabel: 'Väljatõmbe ventilaator',
				icon: 'fa fa-crosshairs',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Vent,
				protocol: Protocol.Vent,
			},
			{
				label: 'Köögi töövalgus',
				sublabel: 'Tööpinna valgusti',
				icon: 'fa fa-lightbulb-o',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Light,
				protocol: Protocol.KitchenWorkLight,
			},
			{
				label: 'Köögi õhtuvalgus',
				sublabel: 'Meeleolu valgustid',
				icon: 'fa fa-lightbulb-o',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Light,
				protocol: Protocol.KitchenTopLight,
			},
			{
				label: 'Voodi õhtuvalgus',
				sublabel: 'Meeleolu valgustid',
				icon: 'fa fa-lightbulb-o',
				type: Cards.ControllerCard,
				grow: GrowMode.Width,
				deviceType: DeviceType.Light,
				protocol: Protocol.BedUnderLight,
			},
		];

		for (let i = 0; i < cards.length; i++) {
			let card: ICard;
			let c: any = cards[i];
			switch (c.type) {
				case Cards.GaugeCard: {
					card = new GaugeCard();
					(card as GaugeCard).setOptions(
						c.options.min,
						c.options.max,
						c.options.color,
						c.options.unit,
						c.options.image
					);
					break;
				}
				case Cards.ControllerCard: {
					card = new ControllerCard(c.deviceType);
					break;
				}
			}
			card.setHeader(c.label, c.sublabel, c.icon);
			card.setProtocol(c.protocol);
			card.setGrowMode(c.grow);
			if (c.layout) {
				card.getHTML().style.gridColumn = c.layout.column;
				card.getHTML().style.gridRow = c.layout.row;
			}
			this.root.appendChild(card.getHTML());
		}
	}
}
