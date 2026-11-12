import React from 'react';
import {beforeMount} from '@playwright/experimental-ct-react/hooks';

import {Provider, Toaster, ToasterProvider} from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/styles.scss';

const toaster = new Toaster();

beforeMount(async ({App}) => {
    return (
        <Provider>
            <ToasterProvider toaster={toaster}>
                <App />
            </ToasterProvider>
        </Provider>
    );
});
