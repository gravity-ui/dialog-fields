import React, {Component, Fragment} from 'react';
import {DFDialog} from '../../dialog/Dialog/Dialog';
import {StoryFn, Meta} from '@storybook/react';
import {FormApi} from '../../index';
import {Button} from '@gravity-ui/uikit';

interface FormValues {
    general: {
        firstName: string;
        lastName: string;
    };
    contacts: {
        email: string;
        phone: string;
    };
}

interface Props {
    verticalTabs: boolean;
}

class DialogWithSelectStories extends Component<Props> {
    state = {
        dialogVisible: true,
        initialState: {},
        formData: {},
        showModal: false,
    };

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    onAdd = (form: FormApi<FormValues>) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    render() {
        const {verticalTabs} = this.props;
        const {initialState, formData, showModal} = this.state;

        return (
            <Fragment>
                <Button onClick={this.onToggleModal}>Show modal</Button>
                <pre>Confirmed form values: {JSON.stringify(formData, null, 2)}</pre>
                <DialogDemo
                    initialValues={initialState}
                    onAdd={this.onAdd}
                    modal={false}
                    verticalTabs={verticalTabs}
                />
                {showModal && (
                    <DialogDemo
                        initialValues={formData}
                        modal={true}
                        onAdd={this.onAdd}
                        onClose={() => this.onToggleModal()}
                        verticalTabs={verticalTabs}
                    />
                )}
            </Fragment>
        );
    }
}

function DialogDemo({
    modal,
    onAdd,
    initialValues,
    onClose,
    verticalTabs,
}: {
    verticalTabs: boolean;
    modal: boolean;
    initialValues?: Partial<FormValues>;
    onAdd: (form: FormApi<FormValues, any>) => Promise<void>;
    onClose?: () => void;
}) {
    const tabType: any = verticalTabs ? 'tab-vertical' : 'tab';
    return (
        <DFDialog<FormValues>
            modal={modal}
            headerProps={{
                title: 'Field-level validation',
            }}
            onClose={onClose ?? (() => {})}
            visible
            onAdd={onAdd}
            initialValues={initialValues}
            pristineSubmittable
            fields={[
                {
                    name: 'general',
                    title: 'General',
                    type: tabType,
                    fields: [
                        {
                            type: 'block',
                            name: 'block',
                            extras: {
                                children: (
                                    <div style={{color: 'gray'}}>
                                        Every field might be marked with <b>required</b> flag and in
                                        addition you can provide <b>validator</b> function. The
                                        function should return a string with error if current value
                                        is wrong or <i>undefined</i> otherwise. <b>Confirm</b>{' '}
                                        button will be disabeld until all values are correct.
                                        <div style={{color: 'darkorange'}}>
                                            Do not use field validators for virtualized tabs.
                                        </div>
                                    </div>
                                ),
                            },
                        },
                        {
                            name: 'firstName',
                            type: 'text',
                            caption: 'First name',
                            required: true,
                            validator: (v) => {
                                return v !== 'John' ? 'John is a good name' : undefined;
                            },
                        },
                        {
                            name: 'lastName',
                            type: 'text',
                            caption: 'Last name',
                            required: true,
                        },
                    ],
                },
            ]}
        />
    );
}

export default {
    title: 'Demo/06. Field validators',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
