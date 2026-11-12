import React from 'react';
import {expect, test} from '../../../../playwright/core';

import {ClonableTabs} from './Clonable_tabs.help';

test('Select, clone and remove a tab while preserving its form values', async ({page, mount}) => {
    await mount(<ClonableTabs.Primary />);

    const firstTab = page.getByRole('row', {name: 'City 1', exact: true});
    const country = page.getByTestId('df-field:text:country').locator('input:visible');

    await test.step('Select the initial tab with a numeric id', async () => {
        await firstTab.getByText('City 1', {exact: true}).click();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        await expect(country).toBeVisible();
        await country.fill('France');
    });

    await test.step('Clone the tab and edit its independent values', async () => {
        await page.getByRole('button', {name: 'Clone', exact: true}).click();
        await page.getByRole('row', {name: 'City 2', exact: true}).getByText('City 2').click();
        await expect(country).toHaveValue('France');
        await country.fill('Italy');

        await firstTab.getByText('City 1', {exact: true}).click();
        await expect(country).toHaveValue('France');
    });

    await test.step('Remove the clone and return to the original tab', async () => {
        await page.getByRole('row', {name: 'City 2', exact: true}).getByText('City 2').click();
        await expect(country).toHaveValue('Italy');
        await page.getByRole('button', {name: 'Remove', exact: true}).click();

        await expect(page.getByRole('row', {name: 'City 2', exact: true})).toHaveCount(0);
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        await expect(country).toHaveValue('France');
    });
});
