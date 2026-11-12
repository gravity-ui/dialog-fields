import React from 'react';

import {TextControl, TextControlProps} from '../../TextControl';
import {TextAreaControl} from '../../TextAreaControl';
import {MultiTextControl} from '../../MultiTextControl';

const states: Array<{
    title: string;
    props: Pick<TextControlProps, 'error' | 'errorMessage' | 'validationState'>;
}> = [
    {title: 'No error', props: {}},
    {title: 'Form error', props: {error: 'Form error message'}},
    {
        title: 'Explicit message overrides form error',
        props: {error: 'Form error message', errorMessage: 'Custom error message'},
    },
    {
        title: 'External validation state',
        props: {validationState: 'invalid', errorMessage: 'External error message'},
    },
    {
        title: 'Empty error preserves external validation',
        props: {error: '', validationState: 'invalid', errorMessage: 'External error message'},
    },
    {title: 'Empty error', props: {error: ''}},
    {title: 'Message without invalid state', props: {errorMessage: 'Hidden error message'}},
];

export function ControlValidationStates({type}: {type: 'text' | 'textarea' | 'multi-text'}) {
    return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 320px)', gap: 24}}>
            {states.map(({title, props}) => (
                <div key={title}>
                    <p>{title}</p>
                    {type === 'text' && (
                        <TextControl {...props} value="Value" onChange={() => {}} />
                    )}
                    {type === 'textarea' && (
                        <TextAreaControl {...props} value="Value" onChange={() => {}} />
                    )}
                    {type === 'multi-text' && (
                        <MultiTextControl
                            {...props}
                            value={[{name: 'one'}, {name: 'two'}]}
                            onChange={() => {}}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
