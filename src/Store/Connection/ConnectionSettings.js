/**
 *
 */
export default class ConnectionSettings {

    /**
     *
     */
    constructor() {
        this.contentType = 'application/json';
        this.mode = 'cors';
        this.cache = 'no-cache';
        this.headers = {};
        this.baseUrl = '';
    }

    /**
     *
     * @param {string} baseUrl
     * @return {ConnectionSettings}
     */
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    }

    /**
     *
     * @return {string}
     */
    getBaseUrl() {
        return this.baseUrl;
    }

    /**
     *
     * @return {{mode: string, redirect: string, headers: {"Content-Type": string}, cache: string, referrerPolicy: string}}
     */
    getSettings() {
        return {
            mode: this.mode, // no-cors, *cors, same-origin
            cache: this.cache, // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': this.contentType,
                ...this.headers
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        };
    }
}
