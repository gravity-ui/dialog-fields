import React from 'react';
import {expect, test} from '../../../../playwright/core';

import {TabFieldVertical} from '../TabFieldVertical';

for (const virtualized of [false, true]) {
    test(`Reorder tabs in both directions with virtualization ${virtualized}`, async ({
        page,
        mount,
    }) => {
        const changes: Array<{oldIndex: number; newIndex: number}> = [];
        const tabItems = ['Alpha', 'Beta', 'Gamma'].map((name) => ({id: name, name, title: name}));
        await mount(
            <TabFieldVertical
                tabItems={tabItems}
                activeTab="Beta"
                setActiveTab={() => {}}
                sortable
                virtualized={virtualized}
                onOrderChanged={(change) => changes.push(change)}
            />,
            {rootStyle: {display: 'grid', height: 160, width: 300}},
        );

        const rows = page.getByRole('row');
        const alpha = page.getByRole('row', {name: /Alpha/});
        const handle = alpha.getByRole('button');

        await test.step('Move the first tab to the end', async () => {
            await handle.focus();
            await page.keyboard.press('Space');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Space');

            await expect(rows).toHaveText(['Beta', 'Gamma', 'Alpha']);
            await expect.poll(() => changes).toEqual([{oldIndex: 0, newIndex: 2}]);
            await expect(page.getByRole('row', {name: /Beta/})).toHaveAttribute(
                'aria-selected',
                'true',
            );
        });

        await test.step('Move the last tab back to the start', async () => {
            await handle.focus();
            await page.keyboard.press('Space');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('Space');

            await expect(rows).toHaveText(['Alpha', 'Beta', 'Gamma']);
            await expect
                .poll(() => changes)
                .toEqual([
                    {oldIndex: 0, newIndex: 2},
                    {oldIndex: 2, newIndex: 0},
                ]);
        });
    });
}

test('Virtualized tabs render a window and allow selecting an offscreen tab', async ({
    page,
    mount,
}) => {
    const selected: string[] = [];
    const tabItems = Array.from({length: 200}, (_, index) => ({
        id: `tab-${index}`,
        name: `Tab ${index}`,
        title: `Tab ${index}`,
    }));
    await mount(<TabFieldVertical tabItems={tabItems} setActiveTab={(id) => selected.push(id)} />, {
        rootStyle: {display: 'grid', height: 160, width: 300},
    });

    const grid = page.getByRole('grid');
    const lastTab = page.getByRole('row', {name: 'Tab 199', exact: true});
    await expect(page.getByRole('row', {name: 'Tab 0', exact: true})).toBeVisible();
    expect(await page.getByRole('row').count()).toBeLessThan(30);
    await expect(lastTab).toHaveCount(0);

    await grid.hover();
    await page.mouse.wheel(0, 10000);
    await lastTab.click();

    await expect.poll(() => selected).toEqual(['tab-199']);
    expect(await page.getByRole('row').count()).toBeLessThan(30);
});
