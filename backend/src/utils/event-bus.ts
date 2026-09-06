import { EventEmitter } from "events"

class MatchEventBus extends EventEmitter{ }

const eventBus = new MatchEventBus();
eventBus.setMaxListeners(100);
export { eventBus };
