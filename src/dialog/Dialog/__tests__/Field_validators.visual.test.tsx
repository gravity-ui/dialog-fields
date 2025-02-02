import React from 'react';
import {test} from '../../../../playwright/core';

import {FieldValidators} from './Field_validators.help';

test('FieldValidators', async ({page, mount, expectScreenshot}) => {
    await mount(<FieldValidators.Primary />);
    await expectScreenshot();

    await page.getByTestId('df-field:text:firstName').locator('input').fill('john');
    await expectScreenshot();

    await page.getByTestId('df-field:text:firstName').locator('input').fill('John');
    await page.getByTestId('df-field:text:lastName').locator('input').fill('Snow');
    await expectScreenshot();
});
