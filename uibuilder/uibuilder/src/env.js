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
        this.icon = null;
        this.head = null;
        this.html = null;
    };
    BaseCard.prototype.getHTML = function () {
        return this.html;
    };
    BaseCard.prototype.setGrowMode = function (mode) {
        this.growMode = mode;
    };
    BaseCard.prototype.setProtocol = function (src) { };
    BaseCard.prototype.setHeader = function (main, sub, icon) {
        if (icon) {
            var ic = document.createElement('i');
            ic.className = icon;
            this.icon.appendChild(ic);
        }
    };
    BaseCard.prototype.init = function () {
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
    };
    BaseCard.prototype.resize = function () {
        if (this.large) {
            this.large = false;
            this.html.classList.remove(this.growMode);
        }
        else {
            this.large = true;
            this.html.classList.add(this.growMode);
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
        ClientEventDispacher.unregister(2, this.onSensorUpdate, this);
        COM.removeProtocolFilter(this.protocol);
        this.content.dispose();
        this.content = null;
        this.header = null;
        this.subheader = null;
        this.image = null;
        _super.prototype.dispose.call(this);
    };
    GaugeCard.prototype.getHTML = function () {
        return this.html;
    };
    GaugeCard.prototype.setProtocol = function (p) {
        this.protocol = p;
        COM.setProtocolFilter(this.protocol);
    };
    GaugeCard.prototype.setHeader = function (main, sub, icon) {
        _super.prototype.setHeader.call(this, main, sub, icon);
        this.header.innerHTML = main;
        this.subheader.innerHTML = sub;
    };
    GaugeCard.prototype.setOptions = function (min, max, color, unit, image) {
        this.content.setOptions(min, max, color, unit);
        if (image) {
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
        this.content = new FillGauge(15, 100);
        this.html.appendChild(this.content.getHTML());
        ClientEventDispacher.register(2, this.onSensorUpdate, this);
    };
    GaugeCard.prototype.onSensorUpdate = function (msg) {
        if (msg.protocol == this.protocol) {
            this.content.update(msg.data);
        }
    };
    return GaugeCard;
}(BaseCard));
var DeviceControls = (function () {
    function DeviceControls(iconState) {
        this.init();
        this.iconsStateHandler = iconState;
    }
    DeviceControls.prototype.dispose = function () {
        ClientEventDispacher.unregister(3, this.onDeviceUpdate, this);
        COM.removeProtocolFilter(this.protocol);
        while (this.html.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }
        this.updateField = null;
        this.powerButton = null;
        this.autoButton = null;
        this.html = null;
    };
    DeviceControls.prototype.getHtml = function () {
        return this.html;
    };
    DeviceControls.prototype.setProtocol = function (p) {
        this.protocol = p;
        COM.setProtocolFilter(this.protocol);
        ClientEventDispacher.register(3, this.onDeviceUpdate, this);
    };
    DeviceControls.prototype.init = function () {
        this.html = document.createElement('div');
        this.html.className = 'devicecontrols';
        this.powerButton = document.createElement('div');
        this.powerButton.className = 'button ripple';
        this.autoButton = document.createElement('div');
        this.autoButton.className = 'button ripple';
        this.updateField = document.createElement('div');
        this.updateField.className = 'datefield';
        this.autoButton.classList.add('hidden');
        this.autoButton.onclick = this.onAutoClick.bind(this);
        this.powerButton.onclick = this.onPowerClick.bind(this);
        this.html.appendChild(this.powerButton);
        this.html.appendChild(this.autoButton);
        this.powerButton.innerHTML = "ON";
        this.autoButton.innerHTML = "AUTO";
        this.html.appendChild(this.updateField);
    };
    DeviceControls.prototype.onDeviceUpdate = function (msg) {
        if (msg.protocol != this.protocol) {
            return;
        }
        this.powerButton.innerHTML = msg.state;
        this.powerButton.classList.remove('on', 'off');
        this.autoButton.classList.remove('auto', 'manual');
        this.powerButton.classList.add(msg.state.toLowerCase());
        this.updateField.innerHTML =
            "Uuendatud: " + new Date(msg.lastupdate).toLocaleTimeString();
        this.autoButton.innerHTML = msg.auto == true ? "AUTO" : "MANUAL";
        this.autoButton.classList.add(this.autoButton.innerHTML.toLowerCase());
        if (this.large) {
            this.autoButton.classList.remove('hidden');
        }
        else {
            this.autoButton.classList.add('hidden');
        }
        this.iconsStateHandler(msg.state.toLowerCase());
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
    function ControllerCard(deviceType) {
        var _this = _super.call(this) || this;
        _this.deviceType = deviceType;
        return _this;
    }
    ControllerCard.prototype.dispose = function () {
        this.content.dispose();
        this.content = null;
        this.header = null;
        this.html = null;
        _super.prototype.dispose.call(this);
    };
    ControllerCard.prototype.setProtocol = function (src) {
        this.content.setProtocol(src);
    };
    ControllerCard.prototype.setHeader = function (main, sub, icon) {
        _super.prototype.setHeader.call(this, main, sub, icon);
        this.header.innerHTML = main;
        this.subheader.innerHTML = sub;
    };
    ControllerCard.prototype.iconsState = function (state) {
        if (this.deviceType == 0) {
            if (state == 'on') {
                this.icon.classList.add('bulbshine');
                this.icon.classList.remove('iconcolor');
            }
            else {
                this.icon.classList.remove('bulbshine');
                this.icon.classList.add('iconcolor');
            }
        }
        if (this.deviceType == 3) {
            if (state == 'on') {
                this.icon.classList.add('iconcolor-on');
                this.icon.classList.remove('iconcolor');
            }
            else {
                this.icon.classList.remove('iconcolor-on');
                this.icon.classList.add('iconcolor');
            }
        }
        if (this.deviceType == 1) {
            if (state == 'on') {
                this.icon.classList.add('ventrun', 'rotate');
                this.icon.classList.remove('iconcolor');
            }
            else {
                this.icon.classList.remove('ventrun', 'rotate');
                this.icon.classList.add('iconcolor');
            }
        }
    };
    ControllerCard.prototype.init = function () {
        _super.prototype.init.call(this);
        this.header = document.createElement('header');
        this.subheader = document.createElement('header');
        this.subheader.className = 'subheader';
        this.head.appendChild(this.header);
        this.head.appendChild(this.subheader);
        this.html.appendChild(this.head);
        this.content = new DeviceControls(this.iconsState.bind(this));
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
                icon: 'fa fa-thermometer',
                type: 1,
                grow: "large",
                protocol: "sonoff-saun.DS18B20.Temperature",
                options: { min: 15, max: 100, color: '#007800', unit: '°C', image: 'images/saun.jpg' },
                layout: false,
            },
            {
                label: 'saun',
                sublabel: 'eesruum',
                icon: 'fa fa-thermometer',
                type: 1,
                grow: "large",
                protocol: "sonoff-floorheating-temps.DS18B20-5.Temperature",
                options: { min: 15, max: 30, color: '#007800', unit: '°C', image: 'images/eesruum.jpg' },
            },
            {
                label: 'saun',
                sublabel: 'niiskus',
                icon: 'fa fa-tint',
                type: 1,
                grow: "large",
                protocol: "sonoff-saun.AM2301.Humidity",
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
                type: 1,
                grow: "large",
                protocol: "sonoff-th-wc.AM2301.Temperature",
                options: { min: 15, max: 30, color: '#007800', unit: '°C', image: 'images/vannituba.jpg' },
            },
            {
                label: 'vannituba',
                sublabel: 'niiskus',
                icon: 'fa fa-tint',
                type: 1,
                grow: "large",
                protocol: "sonoff-th-wc.AM2301.Humidity",
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
                type: 1,
                grow: "large",
                protocol: "sonoff-floorheating-temps.DS18B20-2.Temperature",
                options: { min: 18, max: 30, color: '#770099', unit: '°C', image: 'images/pk-pealevool.jpg' },
            },
            {
                label: 'põrandaküte',
                sublabel: 'tagasivool',
                icon: 'fa fa-thermometer',
                type: 1,
                grow: "large",
                protocol: "sonoff-floorheating-temps.DS18B20-1.Temperature",
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
                type: 1,
                grow: "large",
                protocol: "sonoff-floorheating-temps.DS18B20-4.Temperature",
                options: { min: 18, max: 50, unit: '°C', image: 'images/lisa-peale.jpg' },
            },
            {
                label: 'lisaküte',
                sublabel: 'tagasivool',
                icon: 'fa fa-thermometer',
                type: 1,
                grow: "large",
                protocol: "sonoff-floorheating-temps.DS18B20-3.Temperature",
                options: { min: 18, max: 50, unit: '°C', image: 'images/lisa-tagasi.jpg' },
            },
            {
                label: 'Taustvalgus',
                sublabel: 'Televiisori taustvalgus',
                icon: 'fa fa-lightbulb-o',
                type: 2,
                grow: "wide",
                deviceType: 0,
                protocol: "tvbacklight",
            },
            {
                label: 'Võimendi',
                sublabel: 'Puhkeruumi sound',
                icon: 'fa fa-music',
                type: 2,
                grow: "wide",
                deviceType: 3,
                protocol: "amplifier",
            },
            {
                label: 'Mini ventilaatorid',
                sublabel: 'Puhkeruumi õhuringlus',
                icon: 'fa fa-crosshairs',
                type: 2,
                grow: "wide",
                deviceType: 1,
                protocol: "minivent",
            },
            {
                label: 'Ventilaator',
                sublabel: 'Väljatõmbe ventilaator',
                icon: 'fa fa-crosshairs',
                type: 2,
                grow: "wide",
                deviceType: 1,
                protocol: "vent",
            },
            {
                label: 'Köögi töövalgus',
                sublabel: 'Tööpinna valgusti',
                icon: 'fa fa-lightbulb-o',
                type: 2,
                grow: "wide",
                deviceType: 0,
                protocol: "kitchenworklight",
            },
            {
                label: 'Köögi õhtuvalgus',
                sublabel: 'Meeleolu valgustid',
                icon: 'fa fa-lightbulb-o',
                type: 2,
                grow: "wide",
                deviceType: 0,
                protocol: "kitchentoplight",
            },
            {
                label: 'Voodi õhtuvalgus',
                sublabel: 'Meeleolu valgustid',
                icon: 'fa fa-lightbulb-o',
                type: 2,
                grow: "wide",
                deviceType: 0,
                protocol: "bedunderlight",
            },
        ];
        for (var i = 0; i < cards.length; i++) {
            var card = void 0;
            var c = cards[i];
            switch (c.type) {
                case 1: {
                    card = new GaugeCard();
                    card.setOptions(c.options.min, c.options.max, c.options.color, c.options.unit, c.options.image);
                    break;
                }
                case 2: {
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
    };
    return DefaultView;
}());
var Layout = (function () {
    function Layout(container) {
        this.root = container;
        this.onConnectionLost();
        this.init();
    }
    Layout.prototype.init = function () {
        ClientEventDispacher.register(0, this.onConnection, this);
        ClientEventDispacher.register(1, this.onConnectionLost, this);
        this.view = new DefaultView(this.root);
        this.view.build();
    };
    Layout.prototype.onConnection = function () {
        this.root.style.filter = 'unset';
    };
    Layout.prototype.onConnectionLost = function () {
        this.root.style.filter = 'sepia(100%) blur(1px)';
    };
    return Layout;
}());
var COM;
var Communcator = (function () {
    function Communcator() {
        this.receiver = null;
        this.protocolfilter = [];
    }
    Communcator.prototype.connection = function (flag) {
        this.connected = flag;
        if (flag) {
            ClientEventDispacher.dispatch({ type: 0 });
        }
        else {
            ClientEventDispacher.dispatch({ type: 1 });
        }
    };
    Communcator.prototype.setProtocolFilter = function (p) {
        if (!this.protocolfilter.includes(p)) {
            this.protocolfilter.push(p);
        }
        console.log('PROTOCOLS', this.protocolfilter);
    };
    Communcator.prototype.removeProtocolFilter = function (p) {
        var index = this.protocolfilter.indexOf(p, 0);
        if (index > -1) {
            this.protocolfilter.splice(index, 1);
        }
    };
    Communcator.prototype.in = function (msg) {
        if (!msg.protocol) {
            return;
        }
        if (!this.protocolfilter.includes(msg.protocol)) {
            return;
        }
        if (msg.topic == "sensorUpdate") {
            this.toSensorEvent(msg);
            return;
        }
        if (msg.topic == "deviceUpdate") {
            this.toDeviceEvent(msg);
            return;
        }
    };
    Communcator.prototype.out = function (msg) {
        if (!this.connected) {
            console.log('[COM] no connection');
        }
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
            type: 2,
            protocol: m.protocol,
            data: m.payload,
        };
        ClientEventDispacher.dispatch(u);
    };
    Communcator.prototype.toDeviceEvent = function (m) {
        var u = {
            type: 3,
            protocol: m.protocol,
            state: m.payload.state,
            auto: m.payload.auto,
            lastupdate: m.payload.lastupdate,
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
    Env.prototype.connection = function (flag) {
        COM.connection(flag);
    };
    Env.prototype.setReceiver = function (f) {
        COM.setReceiver(f);
    };
    return Env;
}());
window.env = Env;
