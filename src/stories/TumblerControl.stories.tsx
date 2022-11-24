import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TumblerControl from '../dialog/TumblerControl/TumblerControl';

export default {
    title: 'Components/TumblerControl',
    component: TumblerControl,
} as ComponentMeta<typeof TumblerControl>;

const Template: ComponentStory<typeof TumblerControl> = (args) => <TumblerControl {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    labelLeft: 'Left',
    labelRight: 'Right',
    value: true,
    onChange: console.log,
};
