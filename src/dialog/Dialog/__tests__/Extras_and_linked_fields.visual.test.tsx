import React from 'react';
import {test} from '../../../../playwright/core';

import {ExtrasAndLinkedFields} from './Extras_and_linked_fields.help';

test('ExtrasAndLinkedFields', async ({page, mount, expectScreenshot}) => {
    await mount(<ExtrasAndLinkedFields.Primary />);
    await expectScreenshot();

    await page.getByTestId('df-field:select:type').click();
    await page.getByText('Fruit').click();

    await page.getByTestId('df-field:select:choice').click();
    await expectScreenshot();
});
