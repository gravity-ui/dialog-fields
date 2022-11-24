import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'react-final-form';

interface Props<T = any> {
    when: string;
    isActive: (value: T) => boolean;
    children: React.ReactNode;
}

function Condition<T>({when, isActive, children}: Props<T>) {
    return (
        <Field name={when} subscription={{value: true}}>
            {({input: {value}}) => (isActive(value) ? children : null)}
        </Field>
    );
}

Condition.propTypes = {
    when: PropTypes.string.isRequired,
    isActive: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default Condition;
