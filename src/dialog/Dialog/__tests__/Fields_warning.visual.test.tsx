import React from 'react';
import {test} from '../../../../playwright/core';

import {FieldsWarnings} from './Fields_warning.help';

test('FieldsWarnings: horizontal tabs', async ({mount, expectScreenshot}) => {
    await mount(<FieldsWarnings.HorizontalTabs />);
    await expectScreenshot();
});

test('FieldsWarnings: vertical tabs', async ({mount, expectScreenshot}) => {
    await mount(<FieldsWarnings.VerticalTabs />);
    await expectScreenshot();
});
