import React, {Component, Fragment} from 'react';
import {StoryFn, Meta} from '@storybook/react';
import {Button} from '@gravity-ui/uikit';

import {FormApi, DFDialog} from '../../../index';
import {ConfirmedFormValues} from '../../../../stories/ConfirmedFormValues';

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
                            warning:
                                'The value should be capitalized. The value should be capitalized. The value should be capitalized.',
                        },
                    ],
                },
            ]}
        />
    );
}

export default {
    title: 'Fields/02. Warning',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => {
    return <DialogWithSelectStories {...args} />;
};

export const HorizontalTabs = Template.bind({});
HorizontalTabs.args = {};

export const VerticalTabs = Template.bind({});
VerticalTabs.args = {verticalTabs: true};
