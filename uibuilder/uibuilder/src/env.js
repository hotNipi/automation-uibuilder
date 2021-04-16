"use strict";
var DefaultCard = (function () {
    function DefaultCard() {
        this.init();
    }
    DefaultCard.prototype.getHTML = function () {
        return this.html;
    };
    DefaultCard.prototype.setProtocol = function (src) {
        this.protocol = src;
    };
    DefaultCard.prototype.setHeader = function (txt) {
        this.header.innerHTML = txt;
    };
    DefaultCard.prototype.setContent = function (txt) {
        this.field.innerHTML = txt;
    };
    DefaultCard.prototype.init = function () {
        this.html = document.createElement('div');
        this.html.className = 'card';
        this.header = document.createElement('header');
        this.html.appendChild(this.header);
        this.content = document.createElement('div');
        this.field = document.createElement('p');
        this.content.appendChild(this.field);
        this.html.appendChild(this.content);
        ClientEventDispacher.register(0, this.onSensorUpdate, this);
    };
    DefaultCard.prototype.onSensorUpdate = function (msg) {
        if (msg.protocol == this.protocol) {
            this.setContent(msg.data.toString());
        }
    };
    return DefaultCard;
}());
var DefaultView = (function () {
    function DefaultView(root) {
        this.root = root;
    }
    DefaultView.prototype.build = function () {
        var cards = ['saun', 'eesruum', 'vannituba', 'küte'];
        var protocols = [
            'sonoff-saun.DS18B20.Temperature',
            'sonoff-saun.AM2301.Temperature',
            'sonoff-th-wc.AM2301.Temperature',
            'sonoff-floorheating-temps.DS18B20-1.Temperature',
        ];
        for (var index = 0; index < cards.length; index++) {
            var card = new DefaultCard();
            card.setHeader(cards[index]);
            card.setProtocol(protocols[index]);
            this.root.appendChild(card.getHTML());
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
    }
    Communcator.prototype.in = function (msg) {
        console.log('[COM]in:', msg);
        if (msg.topic == "sesnorUpdate") {
            this.toSensorEvent(msg);
        }
    };
    Communcator.prototype.out = function (msg) {
        return;
    };
    Communcator.prototype.toSensorEvent = function (m) {
        var su = {
            type: 0,
            protocol: m.protocol,
            data: m.payload,
        };
        ClientEventDispacher.dispatch(su);
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
    return Env;
}());
window.env = Env;
