import React, {Component, Fragment} from 'react';
import {StoryFn, Meta} from '@storybook/react';
import {Button} from '@gravity-ui/uikit';

import {DFDialog, FormApi} from '../../index';
import {useSize} from '../SizeContext';

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
                title: 'One tab',
            }}
            {...useSize()}
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
                },
                {
                    name: 'lastName',
                    type: 'text',
                    caption: 'Last name',
                },
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
            ]}
        />
    );
}

export default {
    title: 'Demo/01. One tab',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
