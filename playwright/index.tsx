import React from 'react';
import {beforeMount} from '@playwright/experimental-ct-react/hooks';

import {MobileProvider, ThemeProvider, ToasterProvider} from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/styles.scss';

beforeMount(async ({App}) => {
    return (
        <ThemeProvider>
            <MobileProvider>
                <ToasterProvider>
                    <App />
                </ToasterProvider>
            </MobileProvider>
        </ThemeProvider>
    );
});
