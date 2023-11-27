import React from 'react';
import {Select, SelectProps} from '@gravity-ui/uikit';

export type SelectControlProps = Omit<SelectProps, 'onUpdate' | 'onChange'> & {
    onChange: (value: SelectControlProps['value']) => void;
};

export function SelectControl(props: SelectControlProps) {
    return <Select {...props} />;
}

SelectControl.getDefaultValue = () => {
    return undefined;
};

SelectControl.isEmpty = (value: SelectControlProps['value']) => {
    return !value?.length;
};
