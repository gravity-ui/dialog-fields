import React from 'react';
import {test} from '../../../../playwright/core';

import {FormValidataion} from './Form_validation.help';

test('FormValidataion', async ({page, mount, expectScreenshot}) => {
    await mount(<FormValidataion.Primary />);
    await expectScreenshot();

    await page.getByTestId('df-field:text:lastName').locator('input').fill('snow');
    await expectScreenshot();

    await page.getByTestId('df-field:text:lastName').locator('input').fill('Snow');
    await expectScreenshot();
});
