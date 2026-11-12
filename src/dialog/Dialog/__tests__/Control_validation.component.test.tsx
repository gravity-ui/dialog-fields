import React from 'react';
import {expect, test} from '../../../../playwright/core';

import {ControlValidation} from './Control_validation.help';

for (const type of ['text', 'textarea', 'multi-text']) {
    test(`${type}: shows and clears a form error`, async ({page, mount}) => {
        await mount(<ControlValidation />);

        const control = page.getByTestId(`df-field:${type}:${type}`);
        const input = control.getByRole('textbox');
        const error = control.getByText('Enter valid', {exact: true});
        const confirm = page.getByRole('button', {name: 'Confirm', exact: true});

        const replaceValue = async (value: string) => {
            if (type === 'multi-text') {
                await page.getByRole('button', {name: 'Clear all', exact: true}).click();
            }
            await input.fill(value);
            await input.press('Tab');
        };

        await expect(confirm).toBeEnabled();
        await expect(error).toHaveCount(0);
        await expect(input).not.toHaveAttribute('aria-invalid', 'true');

        await test.step('Enter an invalid value', async () => {
            await replaceValue('invalid');

            await expect(confirm).toBeDisabled();
            await expect(input).toHaveAttribute('aria-invalid', 'true');
            await expect(error).toBeVisible();
            await expect(input).toHaveAccessibleDescription('Enter valid');
        });

        await test.step('Correct the value', async () => {
            await replaceValue('valid');

            await expect(confirm).toBeEnabled();
            await expect(error).toHaveCount(0);
            await expect(input).not.toHaveAttribute('aria-invalid', 'true');
            await expect(input).toHaveAccessibleDescription('');
        });
    });
}
