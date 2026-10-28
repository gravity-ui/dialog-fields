import React from 'react';
import {expect, test} from '../../../../playwright/core';

import {VisibilityCondition} from './Visibility_condition.help';

test('String conditions toggle tabs and unmount fields', async ({page, mount}) => {
    await mount(<VisibilityCondition.Primary />);

    const contacts = page.getByRole('tab', {name: 'Contacts'});
    const provideContacts = page.getByRole('checkbox', {name: /I want to provide my contacts/});
    const providePhone = page.getByRole('checkbox', {name: /I want to provide my phone/});
    const phone = page.getByTestId('df-field:text:phone');

    await expect(contacts).toHaveCount(0);
    await expect(phone).toHaveCount(0);

    await test.step('Show and unmount the dependent field', async () => {
        await provideContacts.check();
        await contacts.click();
        await providePhone.check();
        await expect(phone).toBeVisible();

        await providePhone.uncheck();
        await expect(phone).toHaveCount(0);

        await providePhone.check();
        await expect(phone).toBeVisible();
    });

    await test.step('Hide and restore the dependent tab', async () => {
        await page.getByRole('tab', {name: 'General'}).click();
        await provideContacts.uncheck();
        await expect(contacts).toHaveCount(0);

        await provideContacts.check();
        await expect(contacts).toBeVisible();
    });
});

test('Multiple conditions toggle fields and tabs', async ({page, mount}) => {
    await mount(<VisibilityCondition.MultipleFields />);

    const firstName = page.getByRole('textbox', {name: 'First name', exact: true});
    const provideContacts = page.getByRole('checkbox', {
        name: /I want to provide my contacts/,
    });
    const contacts = page.getByText('Contacts', {exact: true});
    const general = page.getByText('General', {exact: true});
    const email = page.getByRole('textbox', {name: 'Email', exact: true});
    const providePhone = page.getByRole('checkbox', {name: /I want to provide my phone/});
    const phone = page.getByTestId('df-field:text:phone');

    await test.step('Require both tab dependencies in the declared order', async () => {
        await expect(contacts).toHaveCount(0);
        await firstName.fill('John');
        await expect(contacts).toHaveCount(0);

        await provideContacts.check();
        await expect(contacts).toBeVisible();

        await firstName.clear();
        await expect(contacts).toHaveCount(0);

        await firstName.fill('John');
        await expect(contacts).toBeVisible();

        await provideContacts.uncheck();
        await expect(contacts).toHaveCount(0);

        await provideContacts.check();
        await contacts.click();
    });

    await test.step('React to either field dependency and unmount hidden content', async () => {
        await expect(phone).toHaveCount(0);
        await providePhone.check();
        await expect(phone).toHaveCount(0);

        await email.fill('john@example.com');
        await expect(phone).toBeVisible();

        await providePhone.uncheck();
        await expect(phone).toHaveCount(0);

        await providePhone.check();
        await expect(phone).toBeVisible();

        await email.clear();
        await expect(phone).toHaveCount(0);

        await email.fill('john@example.com');
        await expect(phone).toBeVisible();
    });

    await test.step('Restore the tab after changing its dependencies', async () => {
        await general.click();
        await firstName.clear();
        await expect(contacts).toHaveCount(0);

        await firstName.pressSequentially('John');
        await contacts.click();
        await expect(phone).toBeVisible();
    });
});
