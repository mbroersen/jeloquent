import {ConnectionAdapterFactory} from "./Connection/ConnectionAdapterFactory";
import QueueMessage from "./Connection/Queue/QueueMessage";
import {AdapterInterface, ModelInterface} from "../JeloquentInterfaces";

/**
 *
 */
export default class Connection {

    private _updateQueue: Array<QueueMessage>;

    private adapter: AdapterInterface;

    private paused: boolean;

    constructor(adapter:AdapterInterface|string, options: object) {
        let interfaceAdapter;
        let stringAdapter;

        if (adapter instanceof String) {
            stringAdapter = adapter;
        } else {
            interfaceAdapter = adapter;
        }

        this.adapter = interfaceAdapter ?? ConnectionAdapterFactory.getAdapter(stringAdapter, options);

        this._updateQueue = [];
        this.paused = false;
    }

    all(model: ModelInterface): Promise<unknown> {
        return new Promise((resolve) => {
            this.adapter.all(model)
                .then((queueMessage) => {
                    this.handleQueueMessage(queueMessage, resolve);
                });
        });
    }

    delete(model: ModelInterface): Promise<unknown> {
        return new Promise((resolve) => {
            this.adapter.delete(model)
                .then((queueMessage) => {
                    this.handleQueueMessage(queueMessage, resolve);
                });
        });
    }

    /**
     * @deprecated
     */
    load(model: ModelInterface): Promise<unknown> {
        return this.all(model)
    }

    patch(model: ModelInterface): Promise<unknown> {
        return new Promise((resolve) => {
            this.adapter.patch(model)
                .then((queueMessage) => {
                    this.handleQueueMessage(queueMessage, resolve);
                });
        });
    }

    pause(): void {
        this.paused = true;
    }

    post(model: ModelInterface): Promise<unknown> {
        return new Promise((resolve) => {
            this.adapter.post(model)
                .then((queueMessage) => {
                    this.handleQueueMessage(queueMessage, resolve);
                });
        });
    }

    put(model): Promise<unknown> {
        return new Promise((resolve) => {
            this.adapter.put(model)
                .then((queueMessage) => {
                    this.handleQueueMessage(queueMessage, resolve);
                });
        });
    }

    resume(): void {
        this.paused = false;
    }

    private addToQueue(...queueMessage: QueueMessage): void {
        this._updateQueue.push(...queueMessage);
    }

    private handleQueueMessage(queueMessage: QueueMessage, resolve: CallableFunction): void {
        queueMessage.addCallback(resolve);
        this.addToQueue(queueMessage);
        queueMicrotask(() => {
            this.processQueue();
        });
    }

    private processQueue(): void {
        const nextMessage = (this._updateQueue ?? []).shift();
        if (!nextMessage) {
            return;
        }
        nextMessage.execute();
        queueMicrotask(() => {
            this.processQueue();
        });
    }
}