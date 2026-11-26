import {test as base} from '@playwright/experimental-ct-react';

import {expectScreenshotFixture} from './expectScreenshotFixture';
import {mountFixture} from './mountFixture';
import type {ComponentTest, Fixtures} from './types';

const componentTest: ComponentTest = base;

export const test = componentTest.extend<Fixtures>({
    mount: mountFixture,
    expectScreenshot: expectScreenshotFixture,
});

export {expect} from '@playwright/experimental-ct-react';

export const smokeTest = (testSuffix: string, body: Parameters<typeof test>[2]) => {
    test.skip(({browserName}) => {
        return browserName !== 'chromium';
    }, 'Smoke test is only relevant in Chrome');

    test(`smoke ${testSuffix}`, {tag: ['@smoke']}, body);
};
