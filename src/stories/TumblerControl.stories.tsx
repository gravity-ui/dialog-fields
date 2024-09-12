import React from 'react';
import {StoryFn, Meta} from '@storybook/react';

import {TumblerControl} from '../index';

export default {
    title: 'Components/TumblerControl',
    component: TumblerControl,
} as Meta<typeof TumblerControl>;

const Template: StoryFn<typeof TumblerControl> = (args) => <TumblerControl {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    labelLeft: 'Left',
    labelRight: 'Right',
    value: true,
    onChange: console.log,
};
