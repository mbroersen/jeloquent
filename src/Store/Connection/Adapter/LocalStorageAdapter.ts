import {
    ModelInterface,
    AdapterSettings,
    AdapterInterface,
    ModelStaticInterface,
    QueueAble
} from "../../../JeloquentInterfaces";
import QueueMessage from "../Queue/QueueMessage";

/**
 *
 */
export default class LocalStorageAdapter implements AdapterInterface {
    connectionSettings: AdapterSettings;

    constructor (connectionSettings: AdapterSettings) {
        this.connectionSettings = connectionSettings;
    }

    all(model: ModelStaticInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
    }

    delete(model: ModelInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
    }

    get(model: ModelInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
    }

    load(model: ModelStaticInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncInsert', this.getTableFromLocalStorage(model)));
    }

    patch(model: ModelInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
    }

    post (model: ModelInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncInsert', this.getTableFromLocalStorage(model)));
    }

    put(model: ModelInterface): Promise<QueueAble> {
        return Promise.resolve(new QueueMessage(model, 'aSyncUpdate', this.getTableFromLocalStorage(model)));
    }

    private getLocalStorageKey(model) {
        return `jeloquent-${globalThis.Store.useDatabase}-${model.className}`;
    }

    private getTableFromLocalStorage(model) {
        return JSON.parse(localStorage.getItem(this.getLocalStorageKey(model)) ?? '[]');
    }
}