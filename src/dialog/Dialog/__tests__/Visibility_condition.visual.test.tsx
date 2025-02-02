import React from 'react';
import {test} from '../../../../playwright/core';

import {VisibilityCondition} from './Visibility_condition.help';

test('VisibilityCondition', async ({page, mount, expectScreenshot}) => {
    await mount(<VisibilityCondition.Primary />);
    await expectScreenshot();

    await page.getByText('I want to provide my contacts').click();
    await page.getByRole('tablist').getByText('Contacts').click();
    await expectScreenshot();

    await page.getByText('I want to provide my phone').click();
    await expectScreenshot();
});
