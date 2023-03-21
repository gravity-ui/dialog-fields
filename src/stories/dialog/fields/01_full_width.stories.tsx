import React, {Component, Fragment} from 'react';
import {DFDialog} from '../../../dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {FormApi} from '../../../index';
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
                            required: true,
                        },
                        {
                            name: 'lastName',
                            type: 'text',
                            caption: 'Last name',
                            required: true,
                            fullWidth: true,
                            extras: {
                                placeholder: 'A field with "fullWidth: true"',
                            },
                        },
                    ],
                },
            ]}
        />
    );
}

export default {
    title: 'Fields/01. Full width',
    component: DialogWithSelectStories,
} as ComponentMeta<typeof DialogWithSelectStories>;

const Template: ComponentStory<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
