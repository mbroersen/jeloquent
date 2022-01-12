import {AdapterInterface, ModelInterface, ModelStaticInterface, QueueAble} from "../JeloquentInterfaces";

/**
 *
 */
export default class Connection {

    private _updateQueue: Array<QueueAble>;

    private adapter: AdapterInterface;

    private paused: boolean;

    constructor(adapter:AdapterInterface) {
        this.adapter = adapter;
        this._updateQueue = [];
        this.paused = false;
    }

    all(model: ModelStaticInterface): Promise<unknown> {
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
    load(model: ModelStaticInterface): Promise<unknown> {
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

    private addToQueue(...queueMessage: Array<QueueAble>): void {
        this._updateQueue.push(...queueMessage);
    }

    private handleQueueMessage(queueMessage: QueueAble, resolve: CallableFunction): void {
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