import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';
import ConnectionRequest from "../ConnectionRequest";

/**
 *
 */
export default class ConnectionAdapterJsonRequest extends ConnectionAdapter {

    /**
     *
     * @param {ConnectionSettings} options
     */
    constructor(options) {
        super(options);
    }

    /**
     *
     * @return {boolean}
     */
    get isRemote() {
        return true;
    }

    /**
     *
     * @return {boolean}
     */
    get isLocal() {
        return false;
    }

    /**
     * @deprecated
     * @param {Model} model
     * @return {Promise}
     */
    load(model) {
        return this.all(model);
    }

    /**
     *
     * @param model
     * @return {Promise<unknown>}
     */
    all(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .all(model)
                .then(response => {
                    const message = new QueueMessage(model, 'insert', response.json());
                    resolve(message);
                });
        }));
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    get(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .get(model)
                .then(response => {
                    const message = new QueueMessage(model, 'fill', response.json());
                    message.addCallback(() => {model.save()});
                    resolve(message);
                });
        }))
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    post(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .post(model)
                .then(response => {
                    const message = new QueueMessage(model, 'fill', response.json());
                    message.addCallback(() => {model.save()});
                    resolve(message);
            });
        }))
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    put(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
            .put(model)
            .then(response => {
                const message = new QueueMessage(model, 'fill', response.json());
                message.addCallback(() => {model.save()});
                resolve(message);
            });
        }));
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    patch(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
            .patch(model)
            .then(response => {
                const message = new QueueMessage(model, 'fill', response.json());
                message.addCallback(() => {model.save()});
                resolve(message);
            });
        }));
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    delete(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
            .delete(model)
            .then(response => {
                const message = new QueueMessage(model, 'delete', response.json());
                resolve(message);
            });
        }));
    }
}