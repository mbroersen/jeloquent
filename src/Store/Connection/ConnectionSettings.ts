/**
 *
 */
export default class ConnectionSettings {

    private baseUrl: string;

    private cache: string;

    private contentType: string;

    private headers: object;

    private mode: string;

    /**
     *
     */
    constructor() {
        this.contentType = 'application/json';
        this.mode = 'cors';
        this.cache = 'no-cache';
        this.headers = {};
        this.baseUrl = 'http://localhost';
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    getSettings(): object {
        return {
            "mode": this.mode, // no-cors, *cors, same-origin
            "cache": this.cache, // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            "headers": {
                'Accept': this.contentType,
                'Content-Type': this.contentType,
                ...this.headers
            },
            "redirect": 'follow', // manual, *follow, error
            "referrerPolicy": 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        };
    }

    setBaseUrl(baseUrl: string): ConnectionSettings {
        this.baseUrl = baseUrl ?? 'http://localhost';
        return this;
    }
}
