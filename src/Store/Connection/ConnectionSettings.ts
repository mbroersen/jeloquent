import {AdapterSettingsOptions, ModelStaticInterface} from "../../JeloquentInterfaces";

enum MODE {
    NO_CORS = 'no-cors',
    CORS = 'cors',
    SAME_ORIGIN = 'same-origin',
}

enum CACHE {
    DEFAULT = 'default',
    NO_CACHE = 'no-cache',
    RELOAD = 'reload',
    FORCE_CACHE = 'force-cache',
    ONLY_IF_CACHED = 'only-if-cached',
}

enum REDIRECT {
    MANUAL = 'manual',
    FOLLOW = 'follow',
    ERROR = 'error',
}

enum REFERRER_POLICY {
    NO_REFERRER = 'no-referrer', 
    NO_REFERRER_WHEN_DOWNGRADE = '*no-referrer-when-downgrade', 
    ORIGIN = 'origin', 
    ORIGIN_WHEN_CROSS_ORIGIN = 'origin-when-cross-origin',
    SAME_ORIGIN = 'same-origin',
    STRICT_ORIGIN = 'strict-origin',
    STRICT_ORIGIN_WHEN_CROSS_ORIGIN = 'strict-origin-when-cross-origin',
    UNSAFE_URL = 'unsafe-url',
}

export default class ConnectionSettings {

    static OPTION_CACHES = CACHE;

    static OPTION_MODE = MODE;

    static OPTION_REDIRECT = REDIRECT;

    static OPTION_REFERRER_POLICY = REFERRER_POLICY;

    private _baseUrl: string;

    private cache: string;

    private contentType: string;

    private headers: object;

    private mode: string;

    private modelPathMappings: Map<string, string>;

    constructor(options: AdapterSettingsOptions) {
        this.contentType = options?.contentType ?? 'application/json';
        this.mode = options?.mode ?? ConnectionSettings.OPTION_MODE.CORS;
        this.cache = options?.cache ?? ConnectionSettings.OPTION_CACHES.NO_CACHE;
        this.headers = options?.headers ?? {};
        this._baseUrl = options?.baseUrl ?? 'http://localhost';
        this.modelPathMappings = options?.modelPathMappings ?? new Map();
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    getSettings(): object {
        return {
            "mode": this.mode,
            "cache": this.cache,
            "headers": {
                'Accept': this.contentType,
                'Content-Type': this.contentType,
                ...this.headers
            },
            "redirect": ConnectionSettings.OPTION_REDIRECT.FOLLOW,
            "referrerPolicy": ConnectionSettings.OPTION_REFERRER_POLICY.NO_REFERRER,
        };
    }

    modelEndPoint(model:ModelStaticInterface): string {
        return `${this.baseUrl}/${this.modelPathMappings.get(model.className) ?? model.kebabCaseClassName}`
    }
}
