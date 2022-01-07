
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
     * @param {Model|Collection} model
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

    /**
     *
     * @param {Model} model
     * @return {Promise}
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
     * @return {string}
     */
    modelApiLocation(model) {
        return `${this.connectionRequestSettings.getBaseUrl()}/${model.kebabCaseClassName}`;
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<Response>}
     */
    patch(model) {
        return fetch(
            `${this.modelApiLocation(model)}/${model.primaryKey}`,
            {
                method: 'PATCH',
                body: JSON.stringify(model.dirtyFields), //todo get dirty field values
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<Response>}
     */
    post(model) {
        return fetch(
            this.modelApiLocation(model),
            {
                method: 'POST',
                body: JSON.stringify(model.jsonStringify()),
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }

    /**
     *
     * @param {Model|Collection} model
     * @return {Promise<Response>}
     */
    put(model) {
        return fetch(
            `${this.modelApiLocation(model)}/`,
            {
                method: 'PUT',
                body: JSON.stringify(model.jsonStringify()), //todo get dirty field values
                ...this.connectionRequestSettings.getSettings(),
            }
        );
    }
}