import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';
import ConnectionRequest from "../ConnectionRequest";

/**
 *
 */
export default class JsonRequestAdapter extends ConnectionAdapter {

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
     * @return {Promise<QueueMessage>}
     */
    load(model) {
        return this.all(model);
    }

    /**
     *
     * @param {Response} response
     */
    responseJson(response) {
        return response.json();
    }

    /**
     *
     * @param model
     * @return {Promise<QueueMessage>}
     */
    all(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .all(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'insert', data);
                    resolve(message);
                });
        }));
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<QueueMessage>}
     */
    get(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .get(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }))
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<QueueMessage>}
     */
    post(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .post(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }))
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<QueueMessage>}
     */
    put(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .put(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }));
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<QueueMessage>}
     */
    patch(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .patch(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }));
    }

    /**
     *
     * @param {Model} model
     * @return {Promise<QueueMessage>}
     */
    delete(model) {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .delete(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'delete', data);
                    resolve(message);
                });
        }));
    }
}