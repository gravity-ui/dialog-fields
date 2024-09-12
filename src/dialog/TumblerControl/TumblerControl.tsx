import React, {useCallback} from 'react';
import {dfCN} from '../../helpers/cn';

import {Switch} from '@gravity-ui/uikit';
import {ControlProps} from '../types';

import './TumblerControl.scss';

const block = dfCN('tumbler-control');

export type TumblerControlProps = ControlProps<boolean> &
    Omit<React.ComponentProps<typeof Switch>, 'value' | 'checked' | 'onUpdate' | 'onChange'> & {
        labelLeft?: string;
        labelRight?: string;
    };

export function TumblerControl({value, onChange, ...extras}: TumblerControlProps) {
    const onTumblerChange = useCallback(() => onChange(!value), [onChange, value]);
    const {labelLeft, labelRight, size = 'm', className, ...rest} = extras;

    return (
        <span className={block({size})}>
            {labelLeft}
            <Switch
                {...rest}
                size={size}
                className={block(
                    'switch',
                    {
                        'label-left': Boolean(labelLeft),
                        'label-right': Boolean(labelRight),
                    },
                    className,
                )}
                onChange={onTumblerChange}
                checked={value}
            />
            {labelRight}
        </span>
    );
}

TumblerControl.getDefaultValue = function () {
    return false;
};

TumblerControl.isEmpty = function (value: boolean) {
    return typeof value !== 'boolean' || !value;
};
