import React from 'react';
import {Story, StoryContext} from '@storybook/react/types-6-0';
import {useTheme, configure as uikitConfigure, ThemeProvider} from '@gravity-ui/uikit';
import {configure} from '../../configure';

const light = {name: 'light', value: '#FFFFFF'} as const;
const dark = {name: 'dark', value: '#2D2C33'} as const;
export const backgrounds = {
    defaultValue: '#FFFFFF',
    values: [light, dark],
};

export function withTheme(StoryItem: Story, context: StoryContext) {
    const {value} = context.globals.backgrounds;
    const themeValue = value === dark.value ? dark.name : light.name;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [theme, setTheme] = useTheme();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        if (theme !== themeValue) {
            setTheme(themeValue || 'system');
        }
    }, [theme, themeValue, setTheme]);

    return <StoryItem {...context} />;
}

export function withCommonProvider(StoryItem: Story, context: StoryContext) {
    return (
        <ThemeProvider>
            <StoryItem {...context} />
        </ThemeProvider>
    );
}

export function withLang(StoryItem: Story, context: StoryContext) {
    const lang = context.globals.lang;
    uikitConfigure({lang});
    configure({lang});

    return <StoryItem {...context} />;
}
