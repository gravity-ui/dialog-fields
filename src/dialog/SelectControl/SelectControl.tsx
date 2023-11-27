import React from 'react';
import {Select, SelectProps} from '@gravity-ui/uikit';

export type SelectControlProps = Omit<SelectProps, 'onUpdate' | 'onChange'> & {
    onChange: (value: SelectControlProps['value']) => void;
};

export function SelectControl(props: SelectControlProps) {
    const {onChange, ...rest} = props;
    return <Select {...rest} onUpdate={onChange} />;
}

SelectControl.getDefaultValue = () => {
    return undefined;
};

SelectControl.isEmpty = (value: SelectControlProps['value']) => {
    return !value?.length;
};
