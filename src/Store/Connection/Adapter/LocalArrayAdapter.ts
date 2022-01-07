import QueueMessage from '../Queue/QueueMessage.js';
import {Connection, ModelInterface} from "../../../JeloquentInterfaces";

/**
 *
 */
export default class LocalArrayAdapter implements Connection.AdapterInterface {
    connectionSettings: Connection.AdapterSettings;

    options:object;

    constructor (connectionSettings: Connection.AdapterSettings) {
        this.connectionSettings = connectionSettings;
    }

    all(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    delete(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    get(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    /**
     *
     * @param model
     * @return {Promise<unknown>}
     */
    load(model:ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    patch(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    post(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    put(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }
}