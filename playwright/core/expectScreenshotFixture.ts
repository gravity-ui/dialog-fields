import {expect} from '@playwright/experimental-ct-react';

import type {CaptureScreenshotParams, ExpectScreenshotFixture, PlaywrightFixture} from './types';

const defaultParams: CaptureScreenshotParams = {
    themes: ['light', 'dark'],
};

export const expectScreenshotFixture: PlaywrightFixture<ExpectScreenshotFixture> = async (
    {page},
    use,
    testInfo,
) => {
    let counter = 0;
    const expectScreenshot: ExpectScreenshotFixture = async ({
        component,
        nameSuffix,
        themes: paramsThemes,
        ...pageScreenshotOptions
    } = defaultParams) => {
        const captureScreenshot = async () => {
            return (component || page.locator('.playwright-wrapper-test')).screenshot({
                animations: 'disabled',
                ...pageScreenshotOptions,
            });
        };

        //console.log({nameScreenshot, nameSuffix, testInfo: testInfo});

        // Wait for loading of all the images
        const locators = await page.locator('//img').all();
        await Promise.all(
            locators.map((locator) =>
                locator.evaluate(
                    (image: HTMLImageElement) =>
                        image.complete ||
                        new Promise<unknown>((resolve) => image.addEventListener('load', resolve)),
                ),
            ),
        );

        // Wait for loading fonts
        await page.evaluate(() => document.fonts.ready);

        const themes = paramsThemes || defaultParams.themes;

        const expectThemeScreenshot = async (theme: Exclude<typeof themes, undefined>[number]) => {
            await page.emulateMedia({colorScheme: theme});

            const {project} = testInfo;

            const nameScreenshot =
                testInfo.titlePath.slice(1).join(' ') +
                (nameSuffix ? ` ${nameSuffix}` : '') +
                `-${theme}-${project.name}-${counter}.png`;

            expect(await captureScreenshot()).toMatchSnapshot({
                name: nameScreenshot,
            });
        };

        ++counter;
        if (themes?.includes('light')) {
            await expectThemeScreenshot('light');
        }

        if (themes?.includes('dark')) {
            await expectThemeScreenshot('dark');
        }
    };

    await use(expectScreenshot);
};
