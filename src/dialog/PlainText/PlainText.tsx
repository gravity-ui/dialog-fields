import React from 'react';

import {dfCN} from '../../helpers/cn';
import './PlainText.scss';

const block = dfCN('plain-text');

export type PlainTextProps = {
    value: string;
    onChange: (value: PlainTextProps['value']) => void;
    className?: string;
    placeholder?: React.ReactNode;
};

class PlainText extends React.Component<PlainTextProps> {
    static getDefaultValue() {
        return '';
    }

    static isEmpty(value: string) {
        return !value;
    }

    render() {
        const {value, placeholder, className} = this.props;

        return (
            <div className={block(null, className)}>
                {value || <span className={block('placeholder')}>{placeholder}</span>}
            </div>
        );
    }
}

export default PlainText;
