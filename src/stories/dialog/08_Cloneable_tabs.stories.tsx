import React, {Component, Fragment} from 'react';
import {DeepPartial, DFDialog} from '../../dialog/Dialog/Dialog';
import {StoryFn, Meta} from '@storybook/react';
import {FormApi} from '../../index';
import {Button} from '@gravity-ui/uikit';

interface FormValues {
    general: {
        firstName: string;
        lastName: string;
    };
}

interface Props {
    verticalTabs: boolean;
}

class DialogWithSelectStories extends Component<Props> {
    state = {
        dialogVisible: true,
        initialState: {},
        formData: undefined,
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
                <DialogDemo
                    initialValues={formData || initialState}
                    onAdd={this.onAdd}
                    modal={false}
                />
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
    initialValues?: DeepPartial<FormValues>;
    onAdd: (form: FormApi<FormValues, any>) => Promise<void>;
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
                    name: 'general',
                    title: 'General',
                    type: 'tab-vertical',
                    fields: [
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
                            type: 'block',
                            name: 'block',
                            extras: {
                                children: (
                                    <div style={{color: 'gray'}}>
                                        There is ability to make clonable tabs by adding{' '}
                                        <b>multiple</b> flag for a tab definition. Only one tab
                                        might be clonable.
                                    </div>
                                ),
                            },
                        },
                    ],
                },
                {
                    name: 'cities',
                    type: 'tab-vertical',
                    title: 'City',
                    multiple: true,
                    getTitle: (d) => {
                        const {city, id} = d;
                        return city ? city : `City ${id}`;
                    },
                    renderControls: (_data, onCreate, onRemove) => {
                        return (
                            <div>
                                <Button onClick={() => onCreate()}>Clone</Button>{' '}
                                {onRemove && <Button onClick={onRemove}>Remove</Button>}
                            </div>
                        );
                    },
                    fields: [
                        {
                            name: 'country',
                            type: 'text',
                            caption: 'Country',
                        },
                        {
                            name: 'city',
                            type: 'text',
                            caption: 'City/Town',
                        },
                        {
                            name: 'notice',
                            type: 'textarea',
                            caption: 'Notice',
                        },
                    ],
                },
            ]}
        />
    );
}

export default {
    title: 'Demo/08. Cloneable tabs',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
