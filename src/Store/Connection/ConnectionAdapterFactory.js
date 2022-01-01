import JsonRequestAdapter from "./Adapter/JsonRequestAdapter";
import LocalStorageAdapter from "./Adapter/LocalStorageAdapter";
import LocalArrayAdapter from "./Adapter/LocalArrayAdapter";

/**
 *
 */
class ConnectionAdapterFactory {

    /**
     *
     * @param {String} name
     * @param {ConnectionSettings} connectionSettings
     * @return {ConnectionAdapter}
     */
    static getAdapter (name, connectionSettings) {

        if (name === 'jsonRequest') {
            return new JsonRequestAdapter(connectionSettings);
        }

        if (name === 'localStorage') {
            return new LocalStorageAdapter(connectionSettings);
        }

        if (name === 'localArray') {
            return new LocalArrayAdapter(connectionSettings);
        }

        return new JsonRequestAdapter(connectionSettings);
    }
}

export {
    ConnectionAdapterFactory,
    LocalStorageAdapter,
    LocalArrayAdapter,
    JsonRequestAdapter
}