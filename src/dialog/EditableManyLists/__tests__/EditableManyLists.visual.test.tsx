import React from 'react';
import {test} from '../../../../playwright/core';

import {Stories} from './helpPlaywright';

test('EditableManyLists: Frozen', async ({mount, expectScreenshot}) => {
    await mount(<Stories.Frozen />);
    await expectScreenshot();
});

test('EditableManyLists: WithItemRenderer', async ({mount, expectScreenshot}) => {
    await mount(<Stories.WithItemRenderer />);
    await expectScreenshot();
});

test('EditableManyLists: WithMaxVisibleCount', async ({mount, expectScreenshot}) => {
    await mount(<Stories.WithMaxVisibleCount />);
    await expectScreenshot();
});
