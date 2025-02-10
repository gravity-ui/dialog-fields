import React from 'react';
import {beforeMount} from '@playwright/experimental-ct-react/hooks';

import {MobileProvider, ThemeProvider, Toaster, ToasterProvider} from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/styles.scss';

const toaster = new Toaster();

beforeMount(async ({App}) => {
    return (
        <ThemeProvider>
            <MobileProvider>
                <ToasterProvider toaster={toaster}>
                    <App />
                </ToasterProvider>
            </MobileProvider>
        </ThemeProvider>
    );
});
