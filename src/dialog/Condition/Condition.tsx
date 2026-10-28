import React from 'react';
import {Field} from 'react-final-form';

export type VisibilityCondition = {
    when: string | Array<string>;
    isActive: (...values: Array<any>) => boolean;
};

type Props = VisibilityCondition & {
    children: React.ReactNode;
};

export function Condition({when, isActive, children}: Props) {
    const names = Array.isArray(when) ? when : [when];

    function renderCondition(values: Array<any>): React.ReactNode {
        if (values.length === names.length) {
            return isActive(...values) ? children : null;
        }

        return (
            <Field name={names[values.length]} subscription={{value: true}}>
                {({input: {value}}) => renderCondition([...values, value])}
            </Field>
        );
    }

    return renderCondition([]);
}
