/// <reference path="ClientEvents.ts" />
interface ClientEventDispatcher{
    register<T extends {type:ClientEvents}>(type:ClientEvents,handler:(ev:T) => void,scope:object):void
    unregister<T extends {type:ClientEvents}>(type:ClientEvents,handler:(ev:T) => void,scope:object):void
    dispatch<T extends {type:ClientEvents}>(e:T):void
}
var ClientEventDispacher:ClientEventDispatcher