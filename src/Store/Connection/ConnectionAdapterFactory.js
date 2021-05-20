import JsonRequestAdapter from "./Adapter/JsonRequestAdapter";
import LocalStorageAdapter from "./Adapter/LocalStorageAdapter";
import ConnectionAdapter from "./ConnectionAdapter";
import LocalArrayAdapter from "./Adapter/LocalArrayAdapter";
import ObjectSocketAdapter from "./Adapter/ObjectSocketAdapter";

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

        if (name === 'ObjectSocket') {
            return new ObjectSocketAdapter(connectionSettings);
        }

        return new JsonRequestAdapter(connectionSettings);
    }
}

export {
    ConnectionAdapterFactory,
    LocalStorageAdapter,
    LocalArrayAdapter,
    ObjectSocketAdapter,
    JsonRequestAdapter,
    ConnectionAdapter
}