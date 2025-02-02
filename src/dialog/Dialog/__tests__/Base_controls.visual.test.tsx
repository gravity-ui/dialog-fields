import React from 'react';
import {test} from '../../../../playwright/core';

import {BaseControls} from './Base_Controls.help';

test('BaseControl', async ({mount, expectScreenshot}) => {
    await mount(<BaseControls.Primary />);
    await expectScreenshot();
});
