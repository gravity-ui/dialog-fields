import React, {Component, Fragment} from 'react';
import {DeepPartial, DFDialog} from '../../dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {FormApi} from '../../index';
import {Button} from '@gravity-ui/uikit';

interface FormValues {
    general: {
        firstName: string;
        lastName: string;
        provideContacts: boolean;
    };
    contacts: {
        email: string;
        phone: string;
        providePhone: boolean;
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

    onAdd = (form: FormApi<FormValues, any>) => {
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
                    initialValues={initialState as any}
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
    onAdd: (form: FormApi<FormValues, DeepPartial<FormValues>>) => Promise<void>;
    onClose?: () => void;
}) {
    const tabType: any = verticalTabs ? 'tab-vertical' : 'tab';
    return (
        <DFDialog<FormValues>
            modal={modal}
            headerProps={{
                title: 'Person',
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
                            name: 'firstName',
                            type: 'text',
                            caption: 'First name',
                        },
                        {
                            name: 'lastName',
                            type: 'text',
                            caption: 'LastName',
                        },
                        {
                            name: 'provideContacts',
                            type: 'checkbox',
                            caption: 'Provide contacts',
                            extras: {
                                children:
                                    'I want to provide my contacts (check to display "Contacts" tab)',
                            },
                        },
                        {
                            type: 'block',
                            name: 'block',
                            extras: {
                                children: (
                                    <div style={{color: 'gray'}}>
                                        There is ability to hide tabs and fields by using{' '}
                                        <b>visibilityCondition</b>
                                    </div>
                                ),
                            },
                        },
                    ],
                },
                {
                    name: 'contacts',
                    title: 'Contacts',
                    type: tabType,
                    fields: [
                        {
                            name: 'email',
                            type: 'text',
                            caption: 'Email',
                        },
                        {
                            name: 'providePhone',
                            type: 'checkbox',
                            extras: {
                                children:
                                    'I want to provide my phone (check to display "Phone" field)',
                            },
                        },
                        {
                            name: 'phone',
                            type: 'text',
                            caption: 'Phone',
                            visibilityCondition: {
                                when: 'contacts.providePhone',
                                isActive: (v) => Boolean(v),
                            },
                        },
                    ],
                    visibilityCondition: {
                        when: 'general.provideContacts',
                        isActive: (v) => Boolean(v),
                    },
                },
            ]}
        />
    );
}

export default {
    title: 'Demo/04. Visibility condition',
    component: DialogWithSelectStories,
} as ComponentMeta<typeof DialogWithSelectStories>;

const Template: ComponentStory<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
