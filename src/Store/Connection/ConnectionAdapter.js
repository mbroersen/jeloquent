/**
 *
 */
import ConnectionSettings from "./ConnectionSettings";

export default class ConnectionAdapter {
    /**
     *
     * @param {ConnectionSettings|Object} connectionSettings
     */
    constructor(connectionSettings) {

        if (!(connectionSettings instanceof ConnectionSettings)) {
            this.connectionSettings = new ConnectionSettings()
                .setBaseUrl(connectionSettings?.url);
            return;
        }

        this.connectionSettings = connectionSettings;
    }

    /**
     *
     * @param {Model} model
     * @return Promise
     */
    load(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    all(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    get(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    put(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    patch(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    post(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }

    /**
     *
     * @param {Model} model
     * @return {Promise}
     */
    delete(model) {
        throw new Error(`should be extended called for ${model.className}`);
    }
}

