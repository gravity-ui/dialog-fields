import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {TextAreaControl} from '../index';

export default {
    title: 'Components/TеxtAreaControl',
    component: TextAreaControl,
} as ComponentMeta<typeof TextAreaControl>;

const Template: ComponentStory<typeof TextAreaControl> = (args) => <TextAreaControl {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    value: 'Text',
};

export const WithError = Template.bind({});
WithError.args = {
    value: 'Text',
    error: 'Error message',
};
