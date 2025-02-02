import React from 'react';
import {test} from '../../../../playwright/core';

import {SeveralTabs} from './Several_tabs.help';

test('SeveralTabs.HorizontalTabs', async ({mount, expectScreenshot}) => {
    await mount(<SeveralTabs.HorizontalTabs />);
    await expectScreenshot();
});

test('SeveralTabs.VerticalTabs ', async ({mount, expectScreenshot}) => {
    await mount(<SeveralTabs.VerticalTabs />);
    await expectScreenshot();
});
