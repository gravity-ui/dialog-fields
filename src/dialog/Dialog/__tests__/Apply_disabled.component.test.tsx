import React from 'react';
import {expect, test} from '../../../../playwright/core';

import {ApplyDisabled} from './Apply_disabled.help';

test('Apply follows values changes while the form remains dirty and valid', async ({
    page,
    mount,
}) => {
    await mount(<ApplyDisabled />);

    const input = page.getByRole('textbox', {name: 'Text', exact: true});
    const jsonMode = page.getByRole('radio', {name: 'JSON', exact: true});
    const save = page.getByRole('button', {name: 'Save', exact: true});

    await expect(save).toBeDisabled();

    await test.step('Make the form dirty without enabling Save', async () => {
        await jsonMode.check();

        await expect(jsonMode).toBeChecked();
        await expect(save).toBeDisabled();
    });

    await test.step('Enable Save when the text changes', async () => {
        await input.fill('edited');

        await expect(save).toBeEnabled();
    });

    await test.step('Disable Save when the text is restored, keeping the form dirty', async () => {
        await input.fill('original');

        await expect(jsonMode).toBeChecked();
        await expect(save).toBeDisabled();
    });
});
