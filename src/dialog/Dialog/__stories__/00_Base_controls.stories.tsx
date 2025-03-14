import React, {Component, Fragment} from 'react';
import {StoryFn, Meta} from '@storybook/react';
import {Button} from '@gravity-ui/uikit';

import {
    FormApi,
    RadioButtonControlProps,
    DFDialog,
    EditableListProps,
    EditableManyListsProps,
    MultiTextControlProps,
    SelectControlProps,
} from '../../index';

import {useSize} from '../../../stories/SizeContext';
import {ConfirmedFormValues} from '../../../stories/ConfirmedFormValues';

class DialogWithSelectStories extends Component {
    state = {
        dialogVisible: true,
        initialState: {},
        formData: {},
        showModal: false,
    };

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    onAdd = (form: FormApi<any, any>) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    render() {
        const {formData, showModal} = this.state;

        return (
            <Fragment>
                <Button onClick={this.onToggleModal}>Show modal</Button>
                <ConfirmedFormValues data={formData} />
                <DialogDemo onAdd={this.onAdd} modal={false} />
                {showModal && (
                    <DialogDemo
                        modal={true}
                        onAdd={this.onAdd}
                        onClose={() => this.onToggleModal()}
                    />
                )}
            </Fragment>
        );
    }
}

function makeField<T extends string, E extends object>(type: T, extras?: E) {
    const res = {type, name: type, required: true, caption: type, tooltip: `Help for ${type}`};
    if (extras) {
        Object.assign(res, {extras});
    }
    return res;
}

function option(v: string) {
    return {value: v, label: v};
}

interface FormValues {
    plain: string;
    radio: RadioButtonControlProps['value'];
    'multi-text': MultiTextControlProps['value'];
    'editable-list': EditableListProps['value'];
    'multi-editable-lists': EditableManyListsProps<string>['value'];
    text: string;
    checkbox: boolean;
    tumbler: boolean;
    textarea: string;
    select: SelectControlProps['value'];
}

function DialogDemo({
    modal,
    onAdd,
    onClose,
}: {
    modal: boolean;
    onAdd: (form: FormApi<FormValues, any>) => Promise<void>;
    onClose?: () => void;
}) {
    return (
        <DFDialog<FormValues>
            modal={modal}
            headerProps={{
                title: 'Base controls',
            }}
            onClose={onClose ?? (() => {})}
            visible
            {...useSize()}
            onAdd={onAdd}
            initialValues={{
                plain: 'Some text for "plain" control',
                radio: 'first',
                'multi-text': [{name: 'apple'}, {name: 'orange'}, {name: 'pear'}],
                'editable-list': [{title: 'red', frozen: true}, {title: 'green'}, {title: 'blue'}],
                'multi-editable-lists': [
                    {
                        title: 'Fruits',
                        data: [{title: 'apple'}, {title: 'orange', frozen: true}, {title: 'pear'}],
                    },
                    {
                        title: 'Colors',
                        data: [{title: 'red'}, {title: 'green'}, {title: 'blue', frozen: true}],
                    },
                ],
            }}
            pristineSubmittable
            fields={[
                makeField('block', {
                    children: (
                        <div>
                            <div style={{color: 'gray', paddingBottom: '20px'}}>
                                This page demonstrates base set of registered field types.
                            </div>
                            <b>block</b> is used for custom content
                        </div>
                    ),
                }),
                makeField('text', {autoFocus: true}),
                makeField('multi-text'),
                makeField('checkbox', {children: 'checkbox'}),
                makeField('tumbler', {labelLeft: 'Left label', labelRight: 'Right label'}),
                makeField('radio', {options: [option('first'), option('second')]}),
                makeField('editable-list'),
                makeField('multi-editable-lists'),
                makeField('textarea'),
                makeField('plain'),
                {
                    name: 'plainPlaceholder',
                    type: 'plain',
                    caption: 'Plain with placeholder',
                    extras: {placeholder: 'Plain text placeholder...'},
                },
                makeField('select', {
                    width: 'max',
                    filterable: true,
                    hasClear: true,
                    options: ['red', 'green', 'blue'].map((i) => {
                        return {
                            value: i,
                            content: i,
                        };
                    }),
                }),
            ]}
        />
    );
}

export default {
    title: 'Demo/00. Base controls',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
