import React from 'react';

import {dfCN} from '../../helpers/cn';
import './PlainText.scss';

const block = dfCN('plain-text');

export type PlainTextProps = {
    value: string;
    onChange: (value: PlainTextProps['value']) => void;
    className?: string;
};

class PlainText extends React.Component<PlainTextProps> {
    static getDefaultValue() {
        return '';
    }

    static isEmpty(value: string) {
        return !value;
    }

    render() {
        const {value, className} = this.props;

        return <div className={block(null, className)}>{value}</div>;
    }
}

export default PlainText;
