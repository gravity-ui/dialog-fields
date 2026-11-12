import React from 'react';
import {test} from '../../../../playwright/core';

import {ControlValidationStates} from './Control_validation_states.help';

for (const type of ['text', 'textarea', 'multi-text'] as const) {
    test(`${type} validation props`, async ({mount, expectScreenshot}) => {
        await mount(<ControlValidationStates type={type} />);
        await expectScreenshot();
    });
}
