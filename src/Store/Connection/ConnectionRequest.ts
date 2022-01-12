import ConnectionSettings from "./ConnectionSettings";

export default class ConnectionRequest {

    private connectionRequestSettings: ConnectionSettings;


    constructor(connectionRequestSettings: ConnectionSettings) {
        this.connectionRequestSettings = connectionRequestSettings;
    }


    all(model): Promise<unknown> {
        return fetch(
            `${this.modelApiLocation(model)}`,
            {
                "method": 'GET',
                ...this.connectionRequestSettings.getSettings()
            }
        );
    }

    delete(model): Promise<unknown>  {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                "method": 'DELETE',
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    get(model) {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                "method": 'GET',
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    modelApiLocation(model): string {
        return this.connectionRequestSettings.modelEndPoint(model);
    }

    patch(model):Promise<unknown> {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                "method": 'PATCH',
                "body": JSON.stringify(model.dirtyFields),
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    post(model):Promise<unknown> {
        return fetch(
            this.modelApiLocation(model),
            {
                "method": 'POST',
                "body": model.jsonStringify(),
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    put(model):Promise<unknown> {
        return fetch(
            `${this.modelApiLocation(model)}/`,
            {
                "method": 'PUT',
                "body": model.jsonStringify(),
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }
}