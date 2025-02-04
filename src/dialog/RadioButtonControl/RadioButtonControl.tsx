import React, {useCallback} from 'react';
import map_ from 'lodash/map';
import {SegmentedRadioGroup, SegmentedRadioGroupProps} from '@gravity-ui/uikit';

RadioButtonControl.getDefaultValue = function () {
    return '';
};

RadioButtonControl.isEmpty = function (value: RadioButtonControlProps['value']) {
    return typeof value !== 'string' || !value;
};

export interface RadioButtonControlProps
    extends Omit<SegmentedRadioGroupProps, 'onChange' | 'value'> {
    value: SegmentedRadioGroupProps['value'];
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
        <SegmentedRadioGroup {...rest} size={size} value={value} onChange={onRadioChange}>
            {map_(options, ({value, label}) => (
                <SegmentedRadioGroup.Option value={value} key={value}>
                    {label}
                </SegmentedRadioGroup.Option>
            ))}
        </SegmentedRadioGroup>
    );
}
