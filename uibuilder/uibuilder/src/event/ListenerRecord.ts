class ListenerRecord {
	private listeners:Array<(ev:{type:ClientEvents}) => void>;
	private scopes:object[];
	private type:ClientEvents;
	private disposed:boolean;
	private dispatching:boolean;


	constructor(t:ClientEvents) {
		this.disposed = false;
		this.dispatching = false;
		this.listeners = [];
		this.scopes = [];
		this.type = t;
	}

	dispose():void {
		this.disposed = true;
		this.listeners = null;
		this.scopes = null;
	}

	add(listener:(ev:{type:ClientEvents}) => void, scope:object):void {
		if (listener == null) {
			throw new Error("listener can't be null");
		}

		for (var i:number = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] == listener && this.scopes[i] == scope) {
				return;
			}
		}

		this.listeners.push(listener);
		this.scopes.push(scope);
	}

	remove(listener:(ev:{type:ClientEvents}) => void, scope:object):void {
		if (listener == null) {
			return;
		}

		for (var i:number = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] == listener && this.scopes[i] == scope) {
				if(this.dispatching == true) {
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
	}

	invoke(re:{type:ClientEvents}):void {
		this.dispatching = true;

		var needCleanup:boolean = false;
		var i:number;

		for (i = 0; i < this.listeners.length; i++) {
			if(this.listeners[i] == null) {
				needCleanup = true;
				continue;
			}

			this.listeners[i].call(this.scopes[i], re);

			if(this.listeners[i] == null) {
				needCleanup = true;
			}

			if(this.disposed == true) {
				return;
			}
		}

		this.dispatching = false;

		if(needCleanup == true) {
			for (i = 0; i < this.listeners.length; i++) {
				if(this.listeners[i] == null) {
					this.listeners.splice(i, 1);
					this.scopes.splice(i, 1);

					i--;
				}
			}
		}
	}

	getType():ClientEvents {
		return this.type;
	}
}
