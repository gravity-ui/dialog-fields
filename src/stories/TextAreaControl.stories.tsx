import React from 'react';
import {StoryFn, Meta} from '@storybook/react';

import {TextAreaControl} from '../index';

export default {
    title: 'Components/TеxtAreaControl',
    component: TextAreaControl,
} as Meta<typeof TextAreaControl>;

const Template: StoryFn<typeof TextAreaControl> = (args) => <TextAreaControl {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    value: 'Text',
};

export const WithError = Template.bind({});
WithError.args = {
    value: 'Text',
    error: 'Error message',
};
