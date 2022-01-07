import QueueMessage from '../Queue/QueueMessage.js';
import {Connection, CollectionInterface, ModelInterface} from "../../../JeloquentInterfaces";

/**
 *
 */
export default class LocalArrayAdapter implements Connection.AdapterInterface {
    connectionSettings: Connection.AdapterSettings;

    options:object;

    constructor (connectionSettings: Connection.AdapterSettings) {
        this.connectionSettings = connectionSettings;
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

    patch(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    post(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className()]));
        });
    }

    put(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className()]));
        });
    }
}