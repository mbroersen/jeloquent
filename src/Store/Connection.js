import ConnectionAdapter from "./Connection/ConnectionAdapter";
import {ConnectionAdapterFactory} from "./Connection/ConnectionAdapterFactory";

export default class Connection {

    constructor(adapter, options)
    {
        if (adapter instanceof ConnectionAdapter) {
            this.adapter = adapter;
        } else {
            this.adapter = ConnectionAdapterFactory.getAdapter(adapter, options);
        }

        this.updateQueue = [];
        this.paused = false;
    }

    processQueue() {
        const nextMessage = (this.updateQueue ?? []).shift();
        if (!nextMessage) {
            return;
        }
        nextMessage.execute();
        setTimeout(() => {
            this.processQueue()
        }, 1);
    }

    addToQueue(...queueMessage) {
        this.updateQueue.push(...queueMessage);
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    load(model) {
        this.adapter.load(model)
            .then((queueMessage) => {
                this.addToQueue(queueMessage);
                setTimeout(() => {
                    this.processQueue()
                }, 1);
            });
    }
}