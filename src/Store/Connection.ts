import {ConnectionAdapterFactory} from "./Connection/ConnectionAdapterFactory";
import {Connection as NSConnection} from "../JeloquentInterfaces";
import QueueMessage from "./Connection/Queue/QueueMessage";
import AdapterInterface = NSConnection.AdapterInterface;

/**
 *
 */
export default class Connection {

    adapter: AdapterInterface;

    paused: boolean;

    updateQueue: Array<QueueMessage>;

    /**
     *
     * @param adapter
     * @param options
     */
    constructor(adapter:AdapterInterface|string, options) {

        let interfaceAdapter;
        let stringAdapter;

        if (adapter instanceof String) {
            stringAdapter = adapter;
        } else {
            interfaceAdapter = adapter;
        }

        this.adapter = interfaceAdapter ?? ConnectionAdapterFactory.getAdapter(stringAdapter, options);

        this.updateQueue = [];
        this.paused = false;
    }

    addToQueue(...queueMessage) {
        this.updateQueue.push(...queueMessage);
    }

    all(model) {
        return new Promise((resolve) => {
            this.adapter.all(model)
                .then((queueMessage) => {
                    queueMessage.addCallback(resolve);
                    this.addToQueue(queueMessage);
                    setTimeout(() => {
                        this.processQueue()
                    }, 1);
                });
        });
    }

    delete(model) {
        return new Promise((resolve) => {
            this.adapter.delete(model)
                .then((queueMessage) => {
                    queueMessage.addCallback(resolve);
                    this.addToQueue(queueMessage);
                    setTimeout(() => {
                        this.processQueue()
                    }, 1);
                });
        });
    }

    /**
     * @deprecated
     */
    load(model) {
        return this.all(model)
    }

    patch(model) {
        return new Promise((resolve) => {
            this.adapter.patch(model)
                .then((queueMessage) => {
                    queueMessage.addCallback(resolve);
                    this.addToQueue(queueMessage);
                    setTimeout(() => {
                        this.processQueue()
                    }, 1);
                });
        });
    }

    pause() {
        this.paused = true;
    }

    post(model) {
        return new Promise((resolve) => {
            this.adapter.post(model)
                .then((queueMessage) => {
                    queueMessage.addCallback(resolve);
                    this.addToQueue(queueMessage);
                    setTimeout(() => {
                        this.processQueue()
                    }, 1);
                });
        });
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

    put(model) {
        return new Promise((resolve) => {
            this.adapter.put(model)
                .then((queueMessage) => {
                    queueMessage.addCallback(resolve);
                    this.addToQueue(queueMessage);
                    setTimeout(() => {
                        this.processQueue()
                    }, 1);
                });
        });
    }

    resume() {
        this.paused = false;
    }
}