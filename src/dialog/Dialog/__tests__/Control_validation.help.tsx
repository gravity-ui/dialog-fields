import React from 'react';

import {DFDialog} from '../Dialog';
import type {MultiTextControlProps} from '../../MultiTextControl';

interface FormValues {
    text: string;
    textarea: string;
    'multi-text': MultiTextControlProps['value'];
}

export function ControlValidation() {
    return (
        <DFDialog<FormValues>
            visible
            modal={false}
            pristineSubmittable
            onAdd={() => Promise.resolve()}
            initialValues={{text: 'valid', textarea: 'valid', 'multi-text': [{name: 'valid'}]}}
            footerProps={{textApply: 'Confirm'}}
            fields={[
                {
                    name: 'text',
                    type: 'text',
                    caption: 'Text',
                    validator: (value) => (value === 'valid' ? undefined : 'Enter valid'),
                },
                {
                    name: 'textarea',
                    type: 'textarea',
                    caption: 'Text area',
                    validator: (value) => (value === 'valid' ? undefined : 'Enter valid'),
                },
                {
                    name: 'multi-text',
                    type: 'multi-text',
                    caption: 'Multiple values',
                    validator: (value) =>
                        value.length === 1 && value[0].name === 'valid' ? undefined : 'Enter valid',
                },
            ]}
        />
    );
}
