import ConnectionAdapter from "./Connection/ConnectionAdapter";
import {ConnectionAdapterFactory} from "./Connection/ConnectionAdapterFactory";

/**
 *
 */
export default class Connection {

    /**
     *
     * @param adapter
     * @param options
     */
    constructor(adapter, options) {
        if (adapter instanceof ConnectionAdapter) {
            this.adapter = adapter;
        } else {
            this.adapter = ConnectionAdapterFactory.getAdapter(adapter, options);
        }

        this.updateQueue = [];
        this.paused = false;
    }

    /**
     *
     */
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

    /**
     *
     * @param queueMessage
     */
    addToQueue(...queueMessage) {
        this.updateQueue.push(...queueMessage);
    }

    /**
     *
     */
    pause() {
        this.paused = true;
    }

    /**
     *
     */
    resume() {
        this.paused = false;
    }

    /**
     * 
     * @param model
     * @return {Promise<unknown>}
     */
    load(model) {
        return new Promise((resolve) => {
            this.adapter.load(model)
                .then((queueMessage) => {
                    queueMessage.addCallback(resolve);
                    this.addToQueue(queueMessage);
                    setTimeout(() => {
                        this.processQueue(resolve)
                    }, 1);
                });
        });
    }
}