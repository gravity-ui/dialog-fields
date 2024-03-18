import type {FieldState} from 'final-form';

export type ValidatorType<T, FormValues> = (
    value: T,
    allValues?: FormValues,
    fieldState?: FieldState<T>,
) => PromiseOrValue<string | undefined>;

export type ArrayElement<T> = T extends Array<infer U> ? U : never;

export type PromiseOrValue<T> = T | Promise<T>;

export interface ControlProps<ValueT> {
    value: ValueT;
    onChange: (value: ValueT) => void;
    error?: string;
}

// https://stackoverflow.com/questions/57103834/typescript-omit-a-property-from-all-interfaces-in-a-union-but-keep-the-union-s
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export interface ControlStaticApi<V> {
    isEmpty?: (value: V) => boolean;
    getDefaultValue: () => V;
    hasErrorRenderer?: boolean;
    validate?: ValidatorType<V, any>;
    format?: (value: V, name: string) => any;
    isEqual?: (a: V, b: V) => boolean;

    isTabControl?: false;
    isTabControlVertical?: false;
}

export interface TabControlStaticApi {
    isTabControl: true;
    isTabControlVertical?: boolean;
}
