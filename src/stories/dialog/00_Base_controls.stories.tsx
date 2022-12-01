import React, {Component, Fragment} from 'react';
import {DFDialog} from '../../dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {FormApi} from '../../index';
import {Button} from '@gravity-ui/uikit';
import {RadioButtonControlProps} from '../../dialog/RadioButtonControl/RadioButtonControl';
import {MultiTextControlProps} from '../../dialog/MultiTextControl/MultiTextControl';
import {EditableListProps} from '../../dialog/EditableList/EditableList';
import {EditableManyListsProps} from '../../dialog/EditableManyLists/EditableManyLists';
import {SelectControlProps} from '../../dialog/SelectControl/SelectControl';

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
                <pre>Confirmed form values: {JSON.stringify(formData, null, 2)}</pre>
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
    const res = {type, name: type, caption: type};
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
                                This page is demonstrates base set of registered field types. But
                                you can expand it as you like.
                            </div>
                            <b>block</b> is used for custom content
                        </div>
                    ),
                }),
                makeField('text'),
                makeField('multi-text'),
                makeField('checkbox', {children: 'checkbox'}),
                makeField('tumbler', {labelLeft: 'Left label', labelRight: 'Right label'}),
                makeField('radio', {options: [option('first'), option('second')]}),
                makeField('editable-list'),
                makeField('multi-editable-lists'),
                makeField('textarea'),
                makeField('plain'),
                makeField('select'),
            ]}
        />
    );
}

export default {
    title: 'Demo/00. Base controls',
    component: DialogWithSelectStories,
} as ComponentMeta<typeof DialogWithSelectStories>;

const Template: ComponentStory<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
