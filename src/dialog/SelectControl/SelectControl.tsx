import React from 'react';
import {Select, SelectProps} from '@gravity-ui/uikit';
import {ListVirtualizer} from '@gravity-ui/uikit/virtualizer';

export type SelectControlProps = Omit<SelectProps, 'onUpdate' | 'onChange'> & {
    onChange: (value: SelectControlProps['value']) => void;
};

export function SelectControl(props: SelectControlProps) {
    const {onChange, ...rest} = props;
    return (
        <ListVirtualizer minItemsCount={50}>
            <Select {...rest} onUpdate={onChange} />
        </ListVirtualizer>
    );
}

SelectControl.getDefaultValue = () => {
    return undefined;
};

SelectControl.isEmpty = (value: SelectControlProps['value']) => {
    return !value?.length;
};
