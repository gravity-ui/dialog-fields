export type Lang = 'ru' | 'en';

interface Config {
    lang: Lang;
}

type Subscriber = (config: Config) => void;

let subscribers: Subscriber[] = [];

let config: Config = readOnly({lang: 'en'});

function readOnly(newConfig: Config) {
    return new Proxy(newConfig, {
        set: () => {
            throw new Error('Do not edit the config directly');
        },
    });
}

export const configure = (newConfig: Config) => {
    config = readOnly(Object.assign({}, config, newConfig));
    subscribers.forEach((sub) => {
        sub(config);
    });
};

export const subscribeConfigure = (sub: Subscriber) => {
    subscribers.push(sub);
    sub(config);

    return () => {
        subscribers = subscribers.filter((item) => item !== sub);
    };
};

export const getConfig = (): Config => config;
