import React, {useCallback} from 'react';

import {Checkbox, CheckboxProps} from '@gravity-ui/uikit';

import './CheckBoxControl.scss';

export interface CheckBoxControlProps
    extends Omit<CheckboxProps, 'value' | 'view' | 'checked' | 'onUpdate' | 'onChange'> {
    value: boolean;
    onChange: (value: CheckBoxControlProps['value']) => void;
}

function CheckBoxControl({value, onChange, ...props}: CheckBoxControlProps) {
    const onCheckBoxChange = useCallback(() => onChange(!value), [onChange, value]);
    const {children, ...rest} = props || {};

    return (
        <Checkbox onChange={onCheckBoxChange} size="l" {...rest} checked={value}>
            {children}
        </Checkbox>
    );
}

CheckBoxControl.getDefaultValue = function () {
    return false;
};

CheckBoxControl.isEmpty = function (value: CheckBoxControlProps['value']) {
    return typeof value !== 'boolean' || !value;
};

export default CheckBoxControl;
