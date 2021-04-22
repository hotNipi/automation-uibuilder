"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseCard = (function () {
    function BaseCard() {
        this.init();
    }
    BaseCard.prototype.dispose = function () {
        while (this.html.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }
        this.head = null;
        this.html = null;
    };
    BaseCard.prototype.getHTML = function () {
        return this.html;
    };
    BaseCard.prototype.setProtocol = function (src) { };
    BaseCard.prototype.setHeader = function (main, sub, icon) { };
    BaseCard.prototype.init = function () {
        this.large = false;
        this.html = document.createElement('div');
        this.html.className = 'card';
        this.head = document.createElement('div');
        this.head.className = 'cardhead';
        this.head.onclick = this.resize.bind(this);
    };
    BaseCard.prototype.resize = function () {
        if (this.large) {
            this.large = false;
            this.html.classList.remove('large');
        }
        else {
            this.large = true;
            this.html.classList.add('large');
        }
    };
    return BaseCard;
}());
var Calc = (function () {
    function Calc() {
    }
    Calc.range = function (n, p, type, round, fixto) {
        if (type == 'clamp') {
            if (n < p.minin) {
                n = p.minin;
            }
            if (n > p.maxin) {
                n = p.maxin;
            }
        }
        if (type == 'roll') {
            var d = p.maxin - p.minin;
            n = ((((n - p.minin) % d) + d) % d) + p.minin;
        }
        var v = ((n - p.minin) / (p.maxin - p.minin)) * (p.maxout - p.minout) + p.minout;
        if (round) {
            v = Math.round(v);
        }
        else {
            if (fixto) {
                v = parseFloat(v.toFixed(fixto));
            }
        }
        return v;
    };
    return Calc;
}());
var FillGauge = (function () {
    function FillGauge(min, max) {
        this.min = min;
        this.max = max;
        this.color = '#FF0000';
        this.unit = '';
        this.animation = -1;
        this.init();
    }
    FillGauge.prototype.dispose = function () {
        while (this.html.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }
        this.content = null;
        this.content = null;
        this.content = null;
        this.fields = null;
        this.field = null;
        this.minfield = null;
        this.maxfield = null;
        this.unitfield = null;
        this.html = null;
    };
    FillGauge.prototype.init = function () {
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
    };
    FillGauge.prototype.update = function (value) {
        this.field.innerText = value.toString();
        var p = Calc.range(value, { minin: this.min, maxin: this.max, minout: 0, maxout: 100 }, 'clamp', false, 2);
        this.content.style.height = p + '%';
        if (this.lastvalue == value) {
            return;
        }
        this.animate();
        this.lastvalue = value;
    };
    FillGauge.prototype.setOptions = function (min, max, color, unit) {
        this.min = min ? min : this.min;
        this.max = max ? max : this.max;
        this.color = color ? color : this.color;
        this.unit = unit ? unit : this.unit;
        this.updateVisual();
        this.update(isNaN(parseFloat(this.field.innerHTML)) ? 0 : parseFloat(this.field.innerHTML));
    };
    FillGauge.prototype.getHTML = function () {
        return this.html;
    };
    FillGauge.prototype.updateVisual = function () {
        this.content.style.backgroundColor = this.color;
        this.unitfield.innerHTML = this.unit;
        this.minfield.innerHTML = this.min.toString();
        this.maxfield.innerHTML = this.max.toString();
    };
    FillGauge.prototype.animate = function () {
        var _this = this;
        if (this.animation != -1) {
            clearTimeout(this.animation);
        }
        this.content.style.opacity = '0.7';
        this.animation = setTimeout(function () {
            _this.clearAnimation();
        }, 3000);
    };
    FillGauge.prototype.clearAnimation = function () {
        clearTimeout(this.animation);
        this.content.style.opacity = '0.4';
        this.animation = -1;
    };
    return FillGauge;
}());
var GaugeCard = (function (_super) {
    __extends(GaugeCard, _super);
    function GaugeCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GaugeCard.prototype.dispose = function () {
        ClientEventDispacher.unregister(0, this.onSensorUpdate, this);
        this.content.dispose();
        while (this.html.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }
        this.content = null;
        this.header = null;
        this.subheader = null;
    };
    GaugeCard.prototype.getHTML = function () {
        return this.html;
    };
    GaugeCard.prototype.setProtocol = function (src) {
        this.protocol = src;
    };
    GaugeCard.prototype.setHeader = function (main, sub) {
        this.header.innerHTML = main;
        this.subheader.innerHTML = sub;
    };
    GaugeCard.prototype.setOptions = function (min, max, color, unit, image) {
        this.content.setOptions(min, max, color, unit);
        if (image) {
            console.log('image', image);
            this.image.style.backgroundImage = 'url(' + image + ')';
        }
    };
    GaugeCard.prototype.init = function () {
        _super.prototype.init.call(this);
        this.image = document.createElement('div');
        this.image.className = 'img';
        this.html.appendChild(this.image);
        this.header = document.createElement('header');
        this.subheader = document.createElement('header');
        this.subheader.className = 'subheader';
        this.head.appendChild(this.header);
        this.head.appendChild(this.subheader);
        this.html.appendChild(this.head);
        this.content = new FillGauge(15, 100);
        this.html.appendChild(this.content.getHTML());
        ClientEventDispacher.register(0, this.onSensorUpdate, this);
    };
    GaugeCard.prototype.onSensorUpdate = function (msg) {
        if (msg.protocol == this.protocol) {
            this.content.update(msg.data);
        }
    };
    return GaugeCard;
}(BaseCard));
var DeviceControls = (function () {
    function DeviceControls() {
        this.init();
    }
    DeviceControls.prototype.dispose = function () {
        while (this.html.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }
        this.powerButton = null;
        this.autoButton = null;
        this.html = null;
    };
    DeviceControls.prototype.getHtml = function () {
        return this.html;
    };
    DeviceControls.prototype.setProtocol = function (p) {
        this.protocol = p;
        ClientEventDispacher.register(1, this.onDeviceUpdate, this);
    };
    DeviceControls.prototype.init = function () {
        this.html = document.createElement('div');
        this.html.className = 'devicecontrols';
        this.powerButton = document.createElement('div');
        this.powerButton.className = 'button ripple';
        this.autoButton = document.createElement('div');
        this.autoButton.className = 'button ripple';
        this.autoButton.classList.add('hidden');
        this.autoButton.onclick = this.onAutoClick.bind(this);
        this.powerButton.onclick = this.onPowerClick.bind(this);
        this.html.appendChild(this.powerButton);
        this.html.appendChild(this.autoButton);
        this.powerButton.innerHTML = "ON";
        this.autoButton.innerHTML = "AUTO";
    };
    DeviceControls.prototype.onDeviceUpdate = function (msg) {
        if (msg.protocol == this.protocol) {
            console.log('onDeviceUpdate', msg);
            this.powerButton.innerHTML = msg.state;
            this.powerButton.classList.remove('on', 'off');
            this.powerButton.classList.add(msg.state.toLowerCase());
            this.autoButton.innerHTML =
                msg.auto == true ? "AUTO" : "MANUAL";
            this.autoButton.classList.add(this.autoButton.innerHTML.toLowerCase());
            if (this.large) {
                this.autoButton.classList.remove('hidden');
            }
            else {
                this.autoButton.classList.add('hidden');
            }
        }
    };
    DeviceControls.prototype.onAutoClick = function () {
        COM.out({ topic: "deviceUpdate", protocol: this.protocol, payload: 'auto' });
    };
    DeviceControls.prototype.onPowerClick = function () {
        COM.out({ topic: "deviceUpdate", protocol: this.protocol, payload: 'power' });
    };
    DeviceControls.prototype.resize = function (large) {
        this.large = large;
        if (large) {
            this.autoButton.classList.remove('hidden');
        }
        else {
            this.autoButton.classList.add('hidden');
        }
    };
    return DeviceControls;
}());
var ControllerCard = (function (_super) {
    __extends(ControllerCard, _super);
    function ControllerCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerCard.prototype.dispose = function () {
        while (this.html.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }
        this.content = null;
        this.header = null;
        this.field = null;
        this.html = null;
    };
    ControllerCard.prototype.setProtocol = function (src) {
        this.content.setProtocol(src);
    };
    ControllerCard.prototype.setHeader = function (main, sub) {
        this.header.innerHTML = main;
        this.subheader.innerHTML = sub;
    };
    ControllerCard.prototype.init = function () {
        _super.prototype.init.call(this);
        this.header = document.createElement('header');
        this.subheader = document.createElement('header');
        this.subheader.className = 'subheader';
        this.head.appendChild(this.header);
        this.head.appendChild(this.subheader);
        this.html.appendChild(this.head);
        this.content = new DeviceControls();
        this.html.appendChild(this.content.getHtml());
    };
    ControllerCard.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.content.resize(this.large);
    };
    return ControllerCard;
}(BaseCard));
var DefaultView = (function () {
    function DefaultView(root) {
        this.root = root;
    }
    DefaultView.prototype.build = function () {
        var cards = [
            {
                label: 'saun',
                sublabel: 'leiliruum',
                type: 1,
                protocol: 'sonoff-saun.DS18B20.Temperature',
                options: { min: 15, max: 100, color: '#007800', unit: '°C', image: 'images/saun.jpg' },
                layout: false,
            },
            {
                label: 'saun',
                sublabel: 'eesruum',
                type: 1,
                protocol: 'sonoff-floorheating-temps.DS18B20-5.Temperature',
                options: { min: 15, max: 30, color: '#007800', unit: '°C' },
            },
            {
                label: 'saun',
                sublabel: 'niiskus',
                type: 1,
                protocol: 'sonoff-saun.AM2301.Humidity',
                options: { min: 30, max: 100, color: '#005599', unit: '%' },
            },
            {
                label: 'vannituba',
                sublabel: 'temperatuur',
                type: 1,
                protocol: 'sonoff-th-wc.AM2301.Temperature',
                options: { min: 15, max: 30, color: '#007800', unit: '°C' },
            },
            {
                label: 'vannituba',
                sublabel: 'niiskus',
                type: 1,
                protocol: 'sonoff-th-wc.AM2301.Humidity',
                options: { min: 30, max: 100, color: '#005599', unit: '%' },
            },
            {
                label: 'põrandaküte',
                sublabel: 'pealevool',
                type: 1,
                protocol: 'sonoff-floorheating-temps.DS18B20-2.Temperature',
                options: { min: 18, max: 30, color: '#770099', unit: '°C' },
            },
            {
                label: 'põrandaküte',
                sublabel: 'tagasivool',
                type: 1,
                protocol: 'sonoff-floorheating-temps.DS18B20-1.Temperature',
                options: { min: 18, max: 30, color: '#770099', unit: '°C' },
            },
            {
                label: 'lisaküte',
                sublabel: 'pealevool',
                type: 1,
                protocol: 'sonoff-floorheating-temps.DS18B20-4.Temperature',
                options: { min: 18, max: 50, unit: '°C' },
            },
            {
                label: 'lisaküte',
                sublabel: 'tagasivool',
                type: 1,
                protocol: 'sonoff-floorheating-temps.DS18B20-3.Temperature',
                options: { min: 18, max: 50, unit: '°C' },
            },
            {
                label: 'Taustvalgus',
                sublabel: 'Televiisori taustvalgus',
                type: 2,
                protocol: 'tvbacklight',
            },
            {
                label: 'Võimendi',
                sublabel: 'Puhkeruumi sound',
                type: 2,
                protocol: 'amplifier',
            },
            {
                label: 'Mini ventilaatorid',
                sublabel: 'Puhkeruumi õhuringlus',
                type: 2,
                protocol: 'minivent',
            },
            {
                label: 'Ventilaator',
                sublabel: 'Väljatõmbe ventilaator',
                type: 2,
                protocol: 'vent',
            },
            {
                label: 'Köögi töövalgus',
                sublabel: 'Tööpinna valgusti',
                type: 2,
                protocol: 'kitchenworklight',
            },
            {
                label: 'Köögi õhtuvalgus',
                sublabel: 'Meeleolu valgustid',
                type: 2,
                protocol: 'kitchentoplight',
            },
            {
                label: 'Voodi õhtuvalgus',
                sublabel: 'Meeleolu valgustid',
                type: 2,
                protocol: 'bedunderlight',
            },
        ];
        for (var index = 0; index < cards.length; index++) {
            var card;
            switch (cards[index].type) {
                case 1: {
                    card = new GaugeCard();
                    card.setHeader(cards[index].label, cards[index].sublabel);
                    card.setProtocol(cards[index].protocol);
                    card.setOptions(cards[index].options.min, cards[index].options.max, cards[index].options.color, cards[index].options.unit, cards[index].options.image);
                    if (cards[index].layout) {
                        card.getHTML().style.gridColumn = cards[index].layout.column;
                        card.getHTML().style.gridRow = cards[index].layout.row;
                    }
                    this.root.appendChild(card.getHTML());
                    break;
                }
                case 2: {
                    card = new ControllerCard();
                    card.setHeader(cards[index].label, cards[index].sublabel);
                    card.setProtocol(cards[index].protocol);
                    this.root.appendChild(card.getHTML());
                }
            }
        }
    };
    return DefaultView;
}());
var Layout = (function () {
    function Layout(container) {
        this.root = container;
        this.init();
    }
    Layout.prototype.init = function () {
        this.view = new DefaultView(this.root);
        this.view.build();
    };
    return Layout;
}());
var COM;
var Communcator = (function () {
    function Communcator() {
        this.receiver = null;
    }
    Communcator.prototype.in = function (msg) {
        if (msg.topic == "sensorUpdate") {
            this.toSensorEvent(msg);
        }
        if (msg.topic == "deviceUpdate") {
            console.log('[COM]in:', msg);
            this.toDeviceEvent(msg);
        }
    };
    Communcator.prototype.out = function (msg) {
        console.log('[COM]out', msg);
        if (!this.receiver) {
            console.log('NO RECEIVER');
            return;
        }
        this.receiver(msg);
    };
    Communcator.prototype.setReceiver = function (r) {
        this.receiver = r;
    };
    Communcator.prototype.toSensorEvent = function (m) {
        var u = {
            type: 0,
            protocol: m.protocol,
            data: m.payload,
        };
        ClientEventDispacher.dispatch(u);
    };
    Communcator.prototype.toDeviceEvent = function (m) {
        var u = {
            type: 1,
            protocol: m.protocol,
            state: m.payload.state,
            auto: m.payload.auto,
        };
        ClientEventDispacher.dispatch(u);
    };
    return Communcator;
}());
var ListenerRecord = (function () {
    function ListenerRecord(t) {
        this.disposed = false;
        this.dispatching = false;
        this.listeners = [];
        this.scopes = [];
        this.type = t;
    }
    ListenerRecord.prototype.dispose = function () {
        this.disposed = true;
        this.listeners = null;
        this.scopes = null;
    };
    ListenerRecord.prototype.add = function (listener, scope) {
        if (listener == null) {
            throw new Error("listener can't be null");
        }
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] == listener && this.scopes[i] == scope) {
                return;
            }
        }
        this.listeners.push(listener);
        this.scopes.push(scope);
    };
    ListenerRecord.prototype.remove = function (listener, scope) {
        if (listener == null) {
            return;
        }
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] == listener && this.scopes[i] == scope) {
                if (this.dispatching == true) {
                    this.listeners[i] = null;
                    this.scopes[i] = null;
                }
                else {
                    this.listeners.splice(i, 1);
                    this.scopes.splice(i, 1);
                }
                return;
            }
        }
    };
    ListenerRecord.prototype.invoke = function (re) {
        this.dispatching = true;
        var needCleanup = false;
        var i;
        for (i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] == null) {
                needCleanup = true;
                continue;
            }
            this.listeners[i].call(this.scopes[i], re);
            if (this.listeners[i] == null) {
                needCleanup = true;
            }
            if (this.disposed == true) {
                return;
            }
        }
        this.dispatching = false;
        if (needCleanup == true) {
            for (i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == null) {
                    this.listeners.splice(i, 1);
                    this.scopes.splice(i, 1);
                    i--;
                }
            }
        }
    };
    ListenerRecord.prototype.getType = function () {
        return this.type;
    };
    return ListenerRecord;
}());
var ClientEventDispacher;
var EventBus = (function () {
    function EventBus() {
        this.listeners = [];
    }
    EventBus.prototype.dispose = function () {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].dispose();
        }
    };
    EventBus.prototype.once = function (type, handler, scope) {
    };
    EventBus.prototype.register = function (type, handler, scope) {
        var lr = this.getHandlerByType(type);
        if (lr == null) {
            lr = new ListenerRecord(type);
            this.listeners.push(lr);
        }
        lr.add(handler, scope);
    };
    EventBus.prototype.dispatch = function (re) {
        var lr = this.getHandlerByType(re.type);
        if (lr == null) {
            return;
        }
        lr.invoke(re);
    };
    EventBus.prototype.unregister = function (type, handler, scope) {
        var lr = this.getHandlerByType(type);
        if (lr == null) {
            return;
        }
        lr.remove(handler, scope);
    };
    EventBus.prototype.getHandlerByType = function (type) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].getType() == type) {
                return this.listeners[i];
            }
        }
        return null;
    };
    return EventBus;
}());
var Env = (function () {
    function Env() {
        this.communicator = new Communcator();
        COM = this.communicator;
        ClientEventDispacher = new EventBus();
    }
    Env.prototype.layout = function (container) {
        this.display = new Layout(container);
    };
    Env.prototype.incoming = function (msg) {
        COM.in(msg);
    };
    Env.prototype.setReceiver = function (f) {
        COM.setReceiver(f);
    };
    return Env;
}());
window.env = Env;
