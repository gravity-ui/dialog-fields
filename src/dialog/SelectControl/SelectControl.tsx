import React from 'react';
import isEmpty from 'lodash/isEmpty';

import {FocusBlurContainer} from '../FocusBlurContainer/FocusBlurContainer';

export interface SelectItem {
    value: string | number;
    title: React.ReactNode;
    hint?: string;
    key?: string;
    meta?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    modifier?: string;
    url?: string;
}

export interface SelectControlProps {
    disabled?: boolean;
    value: Array<string | number> | undefined;
    items: Array<SelectItem>;
    onChange: (value: SelectControlProps['value']) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    showSearch?: boolean;
    singleValueMode?: boolean;
}

function SelectControl(props: SelectControlProps) {
    const {onFocus, onBlur} = props;

    return (
        <FocusBlurContainer onFocus={onFocus} onBlur={onBlur}>
            Select control is not implemented yet
        </FocusBlurContainer>
    );
}

SelectControl.getDefaultValue = () => {
    return undefined;
};

SelectControl.isEmpty = (value: SelectControlProps['value']) => {
    if (typeof value === 'number') {
        return false;
    }
    return isEmpty(value);
};

export default SelectControl;
