import React, {Component, Fragment} from 'react';
import {StoryFn, Meta} from '@storybook/react';
import {Button} from '@gravity-ui/uikit';

import {DFDialog, FormApi} from '../../index';
import {useSize} from '../../../stories/SizeContext';
import {ConfirmedFormValues} from '../../../stories/ConfirmedFormValues';

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
                <ConfirmedFormValues data={formData} />
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
                title: 'Several tabs',
            }}
            {...useSize()}
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
                                        There is ability to create forms with several tabs. By
                                        default tabs are horizontally oriented, but it is possible
                                        to make them vertically oriented.
                                    </div>
                                ),
                            },
                        },
                        {
                            name: 'firstName',
                            type: 'text',
                            caption: 'First name',
                        },
                        {
                            name: 'lastName',
                            type: 'text',
                            caption: 'Last name',
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
                            name: 'phone',
                            type: 'text',
                            caption: 'Phone',
                        },
                    ],
                },
            ]}
        />
    );
}

export default {
    title: 'Demo/02. Several tab',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const HorizontalTabs = Template.bind({});
HorizontalTabs.args = {};

export const VerticalTabs = Template.bind({});
VerticalTabs.args = {
    verticalTabs: true,
};
