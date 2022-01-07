import QueueMessage from '../Queue/QueueMessage.js';
import {Connection, CollectionInterface, ModelInterface} from "../../../JeloquentInterfaces";

/**
 *
 */
export default class LocalStorageAdapter implements Connection.AdapterInterface {
    connectionSettings: Connection.AdapterSettings;

    constructor (connectionSettings: Connection.AdapterSettings) {
        this.connectionSettings = connectionSettings;
    }

    all(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve((resolve) => {
            resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
        });
    }

    delete(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve((resolve) => {
            resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
        });
    }

    get(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve((resolve) => {
            resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
        });
    }

    load(model: ModelInterface | CollectionInterface): Promise<Connection.QueueMessage> {
        return Promise.resolve(new Promise((resolve) => {
            resolve(new QueueMessage(model, 'aSyncInsert', this.getTableFromLocalStorage(model)));
        }));
    }

    patch(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve((resolve) => {
            resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
        });
    }

    post (model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'aSyncInsert', this.getTableFromLocalStorage(model)));
        });
    }

    put(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve((resolve) => {
            resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
        });
    }

    /**
     *
     * @param model
     * @return {string}
     */
    private getLocalStorageKey(model) {
        return `jeloquent-${globalThis.Store.useDatabase}-${model.className}`;
    }

    /**
     *
     * @param model
     * @return {any}
     */
    private getTableFromLocalStorage(model) {
        return JSON.parse(localStorage.getItem(this.getLocalStorageKey(model)) ?? '[]');
    }
}