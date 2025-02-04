import React from 'react';
import {Text} from '@gravity-ui/uikit';

export function ConfirmedFormValues({data}: {data: any}) {
    return (
        <pre>
            <Text variant="code-1">Confirmed form values: {JSON.stringify(data, null, 2)}</Text>
        </pre>
    );
}
