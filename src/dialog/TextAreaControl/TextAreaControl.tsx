import React, {Component} from 'react';
import {TextArea} from '@gravity-ui/uikit';
import {dfCN} from '../../helpers/cn';

import './TextAreaControl.scss';

const block = dfCN('field-textarea');

export type TextAreaControlProps = Omit<
    React.ComponentProps<typeof TextArea>,
    'value' | 'ref' | 'onUpdate' | 'onChange' | 'error'
> & {
    value: string;
    onChange: (value: string) => void;
    error?: string | undefined;
};

export class TextAreaControl extends Component<TextAreaControlProps> {
    static hasErrorRenderer = true;

    static getDefaultValue() {
        return '';
    }

    static isEmpty(value: string) {
        return !value;
    }

    render() {
        const {value, onChange, ...rest} = this.props;

        return (
            <TextArea
                className={block()}
                autoComplete={false}
                hasClear
                rows={4}
                {...rest}
                value={value}
                onUpdate={onChange}
            />
        );
    }
}
