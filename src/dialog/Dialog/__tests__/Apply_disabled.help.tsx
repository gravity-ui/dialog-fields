import React from 'react';

import {DFDialog} from '../Dialog';

interface FormValues {
    mode: string;
    text: string;
}

export function ApplyDisabled() {
    return (
        <DFDialog<FormValues>
            visible
            onAdd={() => Promise.resolve()}
            initialValues={{mode: 'form', text: 'original'}}
            footerProps={{textApply: 'Save'}}
            isApplyDisabled={({hasValidationErrors, values}) =>
                hasValidationErrors || values.text === 'original'
            }
            fields={[
                {
                    name: 'mode',
                    type: 'radio',
                    caption: 'Editor mode',
                    extras: {
                        options: [
                            {value: 'form', label: 'Form'},
                            {value: 'json', label: 'JSON'},
                        ],
                    },
                },
                {name: 'text', type: 'text', caption: 'Text'},
            ]}
        />
    );
}
