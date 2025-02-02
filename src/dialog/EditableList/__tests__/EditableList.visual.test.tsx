import React from 'react';
import {test} from '../../../../playwright/core';

import {Stories} from './helpPlaywright';

test('EditableList: Frozen', async ({mount, expectScreenshot}) => {
    await mount(<Stories.Frozen />);
    await expectScreenshot();
});

test('EditableList: WithItemRenderer', async ({mount, expectScreenshot}) => {
    await mount(<Stories.WithItemRenderer />);
    await expectScreenshot();
});

test('EditableList: WithMaxVisibleCount', async ({mount, expectScreenshot}) => {
    await mount(<Stories.WithMaxVisibleCount />);
    await expectScreenshot();
});
