import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {RadioButton, RadioButtonProps} from '@gravity-ui/uikit';

RadioButtonControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

RadioButtonControl.defaultProps = {
    extras: {},
};

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

function RadioButtonControl({value, onChange, ...props}: RadioButtonControlProps) {
    const onRadioChange = useCallback((evt) => onChange(evt.target.value), [onChange]);
    const {options = [], size = 'm', ...rest} = props;

    return (
        <RadioButton {...rest} size={size} value={value} onChange={onRadioChange}>
            {_.map(options, ({value, label}) => (
                <RadioButton.Option value={value} key={value}>
                    {label}
                </RadioButton.Option>
            ))}
        </RadioButton>
    );
}

export default RadioButtonControl;
