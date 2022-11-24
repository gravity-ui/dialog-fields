import React, {Component} from 'react';
import cn from 'bem-cn-lite';

import {TextInput, TextInputProps} from '@gravity-ui/uikit';
import {ControlProps} from '../types';

const block = cn('ic-text-control');

export type TextControlProps = ControlProps<string> &
    Omit<TextInputProps, keyof ControlProps<string>>;

class TextControl extends Component<TextControlProps> {
    static defaultProps = {
        extras: {},
    };

    static hasErrorRenderer = true;

    static getDefaultValue() {
        return '';
    }

    static isEmpty(value: string) {
        return !value;
    }

    render() {
        const {value, onChange, ...rest} = this.props;

        const empty = TextControl.isEmpty(value);

        return (
            <div className={block({empty})}>
                <TextInput
                    hasClear
                    {...rest}
                    autoComplete={false}
                    onUpdate={onChange}
                    value={value}
                />
            </div>
        );
    }
}

export default TextControl;
