import React, {Component, Fragment} from 'react';
import {DFDialog} from '../../dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {FormApi} from '../../index';
import {Button} from '@gravity-ui/uikit';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

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

    onAdd = (form: FormApi<FormValues>) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    render() {
        const {initialState, formData, showModal} = this.state;

        return (
            <Fragment>
                <Button onClick={this.onToggleModal}>Show modal</Button>
                <pre>Confirmed form values: {JSON.stringify(formData, null, 2)}</pre>
                <DialogDemo initialValues={initialState} onAdd={this.onAdd} modal={false} />
                {showModal && (
                    <DialogDemo
                        initialValues={formData}
                        modal={true}
                        onAdd={this.onAdd}
                        onClose={() => this.onToggleModal()}
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
}: {
    modal: boolean;
    initialValues?: Partial<FormValues>;
    onAdd: (form: FormApi<FormValues>) => Promise<void>;
    onClose?: () => void;
}) {
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
                    name: 'firstName',
                    type: 'text',
                    caption: 'First name',
                    extras: {
                        placeholder: 'First name',
                    },
                },
                {
                    name: 'lastName',
                    type: 'text',
                    caption: 'Last name',
                    extras: ({firstName}) => {
                        return {
                            disabled: !firstName,
                            placeholder: !firstName
                                ? 'Please provide "First name" to unlock it'
                                : 'Last name',
                        };
                    },
                },
                {
                    type: 'block',
                    name: 'block',
                    extras: {
                        children: (
                            <div style={{color: 'gray'}}>
                                It is possible to provide additional properties for controls by
                                using <b>extras</b>. Also you can make fields depending to each
                                other by values by using this property.
                            </div>
                        ),
                    },
                },
            ]}
        />
    );
}

export default {
    title: 'Demo/05. Extras and linked fields',
    component: DialogWithSelectStories,
} as ComponentMeta<typeof DialogWithSelectStories>;

const Template: ComponentStory<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
