import {AdapterSettingsOptions, ModelStaticInterface} from "../../JeloquentInterfaces";

/**
 *
 */
export default class ConnectionSettings {

    private _baseUrl: string;

    private cache: string;

    private contentType: string;

    private headers: object;

    private mode: string;

    private modelPathMappings: Map<string, string>;

    /**
     *
     */
    constructor(options: AdapterSettingsOptions) {
        this.contentType = options?.contentType ?? 'application/json';
        this.mode = options?.mode ?? 'cors';
        this.cache = options?.cache ?? 'no-cache';
        this.headers = options?.headers ?? {};
        this._baseUrl = options?.baseUrl ?? 'http://localhost';
        this.modelPathMappings = options?.modelPathMappings ?? new Map();
    }

    get baseUrl(): string {
        return this._baseUrl;
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

    modelEndPoint(model:ModelStaticInterface): string {
        return `${this.baseUrl}/${this.modelPathMappings.get(model.className) ?? model.kebabCaseClassName}`
    }
}
