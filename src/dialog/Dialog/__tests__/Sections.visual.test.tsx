import React from 'react';
import {test} from '../../../../playwright/core';

import {Sections} from './Sections.help';

test('Sections', async ({mount, expectScreenshot}) => {
    await mount(<Sections.Primary />);
    await expectScreenshot();
});
