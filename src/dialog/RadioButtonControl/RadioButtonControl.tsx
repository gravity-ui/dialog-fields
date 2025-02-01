import React, {useCallback} from 'react';
import map_ from 'lodash/map';
import {RadioButton, RadioButtonProps} from '@gravity-ui/uikit';

RadioButtonControl.getDefaultValue = function () {
    return '';
};

RadioButtonControl.isEmpty = function (value: RadioButtonControlProps['value']) {
    return typeof value !== 'string' || !value;
};

export interface RadioButtonControlProps extends Omit<RadioButtonProps, 'onChange' | 'value'> {
    value: RadioButtonProps['value'];
    onChange: (value: RadioButtonControlProps['value']) => void;
    options?: Array<{value: string; label: React.ReactNode}>;
}

export function RadioButtonControl({value, onChange, ...props}: RadioButtonControlProps) {
    const onRadioChange = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value),
        [onChange],
    );
    const {options = [], size = 'm', ...rest} = props;

    return (
        <RadioButton {...rest} size={size} value={value} onChange={onRadioChange}>
            {map_(options, ({value, label}) => (
                <RadioButton.Option value={value} key={value}>
                    {label}
                </RadioButton.Option>
            ))}
        </RadioButton>
    );
}
