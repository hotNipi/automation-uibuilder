/// <reference path="../../utils/Calc.ts" />
class FillGauge {
	private html: HTMLDivElement;
	private content: HTMLDivElement;
	private fields: HTMLDivElement;
	private field: HTMLSpanElement;
	private minfield: HTMLDivElement;
	private maxfield: HTMLDivElement;
	private unitfield: HTMLSpanElement;

	private min: number;
	private max: number;
	private color: string;
	private unit: string;
	private animation: number;
	private lastvalue: number;

	constructor(min: number, max: number) {
		this.min = min;
		this.max = max;
		this.color = '#FF0000';
		this.unit = '';
		this.animation = -1;
		this.init();
	}
	private init(): void {
		this.html = document.createElement('div');
		this.html.className = 'fillgauge';
		this.content = document.createElement('div');
		this.content.className = 'bar';
		this.fields = document.createElement('div');
		this.fields.className = 'value';
		this.field = document.createElement('span');

		this.unitfield = document.createElement('span');
		this.unitfield.className = 'unit';
		this.minfield = document.createElement('div');
		this.minfield.className = 'minmax min';
		this.maxfield = document.createElement('div');
		this.maxfield.className = 'minmax max';
		this.html.appendChild(this.minfield);
		this.html.appendChild(this.maxfield);
		this.html.appendChild(this.content);
		this.fields.appendChild(this.field);
		this.fields.appendChild(this.unitfield);
		this.html.appendChild(this.fields);

		this.minfield.innerHTML = this.min.toString();
		this.maxfield.innerHTML = this.max.toString();
		this.unitfield.innerHTML = this.unit;
	}
	update(value: number): void {
		this.field.innerText = value.toString();
		var p: number = Calc.range(
			value,
			{minin: this.min, maxin: this.max, minout: 0, maxout: 100},
			'clamp',
			false,
			2
		);
		this.content.style.height = p + '%';
		if (this.lastvalue == value) {
			return;
		}
		this.animate();
		this.lastvalue = value;
	}

	setOptions(min?: number, max?: number, color?: string, unit?: string): void {
		this.min = min ? min : this.min;
		this.max = max ? max : this.max;
		this.color = color ? color : this.color;
		this.unit = unit ? unit : this.unit;
		this.updateVisual();
		this.update(isNaN(parseFloat(this.field.innerHTML)) ? 0 : parseFloat(this.field.innerHTML));
	}
	getHTML(): HTMLDivElement {
		return this.html;
	}
	private updateVisual(): void {
		this.content.style.backgroundColor = this.color;
		this.unitfield.innerHTML = this.unit;
		this.minfield.innerHTML = this.min.toString();
		this.maxfield.innerHTML = this.max.toString();
	}
	private animate() {
		if (this.animation != -1) {
			clearTimeout(this.animation);
		}
		this.content.style.opacity = '0.7';
		this.animation = setTimeout(() => {
			this.clearAnimation();
		}, 3000);
	}
	private clearAnimation(): void {
		clearTimeout(this.animation);
		this.content.style.opacity = '0.4';
		this.animation = -1;
	}
}
