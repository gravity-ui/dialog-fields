import React from 'react';
import {test} from '../../../../playwright/core';

import {VirtualizedTabs} from './Virtualized_tabs.help';

test('VirtualizedTabs', async ({mount, expectScreenshot}) => {
    await mount(<VirtualizedTabs.Primary />);
    await expectScreenshot();
});
