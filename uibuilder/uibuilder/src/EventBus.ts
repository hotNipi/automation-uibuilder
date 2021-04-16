/// <reference path="event/ListenerRecord.ts" />
/// <reference path="event/ClientEventDispacher.ts" />

class EventBus implements ClientEventDispatcher {
	private listeners:ListenerRecord[];

	constructor() {
		this.listeners = [];
	}

	dispose():void {
		for (var i:number = 0; i < this.listeners.length; i++) {
			this.listeners[i].dispose();
		}
	}

	once<T extends {type:ClientEvents}>(type:ClientEvents, handler:(ev:T) => void, scope:object):void {
		//todo
	}

	register<T extends {type:ClientEvents}>(type:ClientEvents, handler:(ev:T) => void, scope:object):void {
		var lr:ListenerRecord = this.getHandlerByType(type);

		if (lr == null) {
			lr = new ListenerRecord(type);
			this.listeners.push(lr);
		}

		lr.add(handler, scope);
	}

	dispatch<T extends {type:ClientEvents}>(re:T):void {
		var lr:ListenerRecord = this.getHandlerByType(re.type);

		if (lr == null) {
			return;
		}

		lr.invoke(re);
	}

	unregister<T extends {type:ClientEvents}>(type:ClientEvents, handler:(ev:T) => void, scope:object):void {
		var lr:ListenerRecord = this.getHandlerByType(type);

		if (lr == null) {
			return;
		}

		lr.remove(handler, scope);
	}

	private getHandlerByType(type:ClientEvents):ListenerRecord {
		for (var i:number = 0; i < this.listeners.length; i++) {
			if (this.listeners[i].getType() == type) {
				return this.listeners[i];
			}
		}

		return null;
	}
}