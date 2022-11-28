import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';

import './PlainText.scss';

const block = cn('df-plain-text');

export type PlainTextProps = {
    value: string;
    onChange: (value: PlainTextProps['value']) => void;
    className?: string;
};

class PlainText extends React.Component<PlainTextProps> {
    static propTypes = {
        value: PropTypes.string.isRequired,
    };

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
