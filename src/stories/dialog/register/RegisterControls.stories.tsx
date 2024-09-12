import React from 'react';
import {
    DFDialog,
    DFDialogProps,
    registerDialogControl,
    RegisteredDialogField,
    DFDialogField,
    DFDialogTabField,
} from '../../../index';
import {StoryFn, Meta} from '@storybook/react';

function MyControl(props: {username: string; value: unknown}) {
    return <div>Hello, {props.username}!</div>;
}

MyControl.getDefaultValue = () => {
    return null;
};

// step 1
registerDialogControl('my-control', MyControl);

// step 2
type MyTypedDialogField<ValuesType> = DFDialogField<
    ValuesType,
    RegisteredDialogField<'my-control', React.ComponentProps<typeof MyControl>, ValuesType>
>;

// step 3
function MyDialog<ValuesType, InitialValuesType = Partial<ValuesType>>(
    props: DFDialogProps<
        ValuesType,
        InitialValuesType,
        DFDialogTabField<MyTypedDialogField<ValuesType>>,
        MyTypedDialogField<ValuesType>
    >,
) {
    return <DFDialog {...(props as any)} />;
}

function Demo() {
    return (
        <div style={{whiteSpace: 'pre'}}>
            The library provides limited amount of basic control that you may use out of the box.
            <br />
            But sometimes it is required to add some project-specific controls, in that case
            <br />
            you need to implement required control and then correctly register it.
            <br />
            <br />
            It is impossible to modify the declaration of DFDialogField type, but it is possible to
            <br />
            implement your own dialog which will wrap DFDialog and have extended set of allowed
            controls.
            <br />
            This example demonstrates how to create your own dialog with additional fields.
            <br />
            <br />
            To register a custom control you need to complete 3 steps:
            <ol>
                <li>Register a custom control with a unique type</li>
                <li>Declare DialogField type that extends DFDialogField</li>
                <li>Implement your own Dialog which will use DialogField type from step 2</li>
            </ol>
            Please see its internals:&nbsp;
            <a
                href={
                    'https://github.com/gravity-ui/dialog-fields/blob/main/src/stories/dialog/register/RegisterControls.stories.tsx'
                }
            >
                the code
            </a>
            <br />
            <br />
            Also it might be useful to know:
            <br />- registerDialogControl accepts only Components which Props extends interface:
            <code>
                {'\n interface ControlProps<V> {' +
                    '\n    value: V;' +
                    '\n    onChange: (value: V, opts?: any) => void;' +
                    '\n    error?: string;' +
                    '\n }\n'}
            </code>
            <br />- and static methods/fields of the component should satisfy to:
            <code>
                {'\n interface ControlStaticApi<V> {' +
                    '\n    isEmpty?: (value: V) => boolean;' +
                    '\n    getDefaultValue: () => V;' +
                    '\n    hasErrorRenderer?: boolean;' +
                    '\n    validate?: ValidatorType<V, any>;' +
                    '\n    format?: (value: V, name: string) => any;' +
                    '\n }\n\n'}
            </code>
            <h3>Usage:</h3>
            <MyDialog
                visible
                modal={false}
                fields={[
                    {
                        name: 'username',
                        type: 'my-control',
                        caption: 'My control',
                        extras: {
                            username: 'world',
                        },
                    },
                ]}
                onAdd={() => {
                    return Promise.resolve();
                }}
            />
        </div>
    );
}

export default {
    title: 'Tutorials/Custom control registration',
    component: Demo,
} as Meta<typeof Demo>;

const Template: StoryFn<typeof Demo> = () => <Demo />;

export const Primary = Template.bind({});
Primary.args = {};
