import React from 'react';
import {test} from '../../../../playwright/core';

import {OneTab} from './One_tab.help';

test('OneTab', async ({mount, expectScreenshot}) => {
    await mount(<OneTab.Primary />);
    await expectScreenshot();
});
