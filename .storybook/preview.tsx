import React from 'react';

import type {Decorator, Preview} from '@storybook/react';
import '@gravity-ui/uikit/styles/styles.scss';

import {Provider, configure as uikitConfigure} from '@gravity-ui/uikit';
import {configure} from '../src/configure';
import {SizeProvider} from '../src/stories/SizeContext';

export const withContextProvider: Decorator = (StoryItem, context) => {
    return (
        <React.StrictMode>
            <Provider theme={context.globals.theme}>
                <SizeProvider value={context.globals.size}>
                    <StoryItem {...context} />
                </SizeProvider>
            </Provider>
        </React.StrictMode>
    );
};

export const withLang: Decorator = (StoryItem, context) => {
    const lang = context.globals.lang;
    uikitConfigure({lang});
    configure({lang});

    return <StoryItem {...context} />;
};

const preview: Preview = {
    decorators: [withContextProvider, withLang],
    parameters: {
        backgrounds: {disable: true},
        actions: {argTypesRegex: '^on[A-Z].*'},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    initialGlobals: {
        lang: 'ru',
        theme: 'light',
        size: 'm',
    },
    globalTypes: {
        lang: {
            name: 'Language',
            toolbar: {
                icon: 'globe',
                items: [
                    {value: 'ru', right: '🇷🇺', title: 'Ru'},
                    {value: 'en', right: '🇺🇸', title: 'En'},
                ],
            },
        },
        theme: {
            name: 'Theme',
            toolbar: {
                icon: 'mirror',
                items: [
                    {title: 'light', value: 'light'},
                    {title: 'dark', value: 'dark'},
                    {title: 'light-hc', value: 'light-hc'},
                    {title: 'dark-hc', value: 'dark-hc'},
                ],
            },
        },
        size: {
            name: 'Size',
            toolbar: {
                icon: 'apple',
                items: [
                    {title: 's', value: 's'},
                    {title: 'm', value: 'm'},
                    {title: 'l', value: 'l'},
                ],
            },
        },
    },
};

export default preview;
