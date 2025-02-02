import React from 'react';
import {test} from '../../../../playwright/core';

import {ClonableTabs} from './Clonable_tabs.help';

test('ClonableTabs', async ({mount, expectScreenshot}) => {
    await mount(<ClonableTabs.Primary />);
    await expectScreenshot();
});
