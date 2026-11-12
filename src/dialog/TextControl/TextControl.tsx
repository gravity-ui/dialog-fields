import React, {Component} from 'react';
import {dfCN} from '../../helpers/cn';

import {TextInput, TextInputProps} from '@gravity-ui/uikit';
import {ControlProps} from '../types';

const block = dfCN('text-control');

export type TextControlProps = ControlProps<string> &
    Omit<TextInputProps, keyof ControlProps<string>>;

export class TextControl extends Component<TextControlProps> {
    static hasErrorRenderer = true;

    static getDefaultValue() {
        return '';
    }

    static isEmpty(value: string) {
        return !value;
    }

    render() {
        const {value, onChange, error, errorMessage, validationState, ...rest} = this.props;

        const empty = TextControl.isEmpty(value);

        return (
            <div className={block({empty})}>
                <TextInput
                    hasClear
                    {...rest}
                    errorMessage={errorMessage || error}
                    validationState={error ? 'invalid' : validationState}
                    autoComplete={false}
                    onUpdate={onChange}
                    value={value}
                />
            </div>
        );
    }
}
