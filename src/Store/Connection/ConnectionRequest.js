
export default class ConnectionRequest {

    /**
     *
     * @param {ConnectionSettings} connectionRequestSettings
     */
    constructor(connectionRequestSettings) {
        this.connectionRequestSettings = connectionRequestSettings;
    }

    /**
     *
     * @param {Model} model
     * @return {string}
     */
    modelApiLocation(model) {
        return `${this.connectionRequestSettings.getBaseUrl()}/${model.kebabCaseClassName}`;
    }

    /**
     *
     * @param {Model} model
     * @return {Promise<Response>}
     */
    post(model) {
        return fetch(
            this.connectionRequestSettings.getBaseUrl(),
            {
                data: JSON.stringify(model.toJson()),
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model} model
     * @return {Promise<Response>}
     */
    all(model) {
        return fetch(
            `${this.modelApiLocation(model)}`,
            {
                method: 'GET',
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model} model
     * @param {Promise}
     */
    get(model) {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                method: 'GET',
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model} model
     * @return {Promise<Response>}
     */
    patch(model) {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                method: 'PATCH',
                data: JSON.stringify(model.dirtyFields), //todo get dirty field values
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model} model
     * @return {Promise<Response>}
     */
    put(model) {
        return fetch(
            `${this.modelApiLocation(model)}/`,
            {
                method: 'PUT',
                data: JSON.stringify(model.toJson()), //todo get dirty field values
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model} model
     * @return {Promise<Response>}
     */
    delete(model) {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                method: 'DELETE',
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }
}