import React, {Component, Fragment} from 'react';
import {InfraDialog} from '../../../src/dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import type {FormApi} from 'final-form';

interface ValuesType {
    reason: string;
    otherComments: string;
}

class ServiceDialogStories extends Component {
    state = {
        dialogVisible: false,
        initialState: {},
        formData: {},
    };

    showDialog = () => this.setState({dialogVisible: !this.state.dialogVisible});
    hideDialog = () => this.setState({dialogVisible: false});
    onAdd = (form: FormApi<ValuesType>) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    render() {
        const {dialogVisible, initialState, formData} = this.state;

        return (
            <Fragment>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <button onClick={this.showDialog}>Show dialog</button>
                </div>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
                <InfraDialog
                    visible={dialogVisible}
                    onClose={this.hideDialog}
                    headerProps={{
                        title: 'Order resources',
                        insertAfter: <span>🔥</span>,
                    }}
                    onAdd={this.onAdd}
                    initialValues={initialState}
                    pristineSubmittable
                    fields={[
                        {
                            section: 'General information',
                            fields: [
                                {
                                    section: 'Details',
                                },
                                {
                                    name: 'reason',
                                    type: 'textarea',
                                    required: true,
                                    caption: 'Why do you need to fill this form?',
                                },
                                {
                                    name: 'otherComments',
                                    type: 'textarea',
                                    caption: 'Any other comments',
                                },
                                {
                                    name: 'helloBlock',
                                    type: 'block',
                                    extras: ({reason, otherComments}) => {
                                        return {
                                            children: (
                                                <span>
                                                    Some content for custom block <br />
                                                    Reason: {reason}
                                                    <br />
                                                    Other: {otherComments}
                                                </span>
                                            ),
                                        };
                                    },
                                },
                                {
                                    name: 'expireDate',
                                    type: 'until-date',
                                    caption: 'Expire date',
                                    extras: {
                                        size: 'm',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </Fragment>
        );
    }
}

export default {
    title: 'Dialog fields/As dialog',
    component: ServiceDialogStories,
} as ComponentMeta<typeof ServiceDialogStories>;

const Template: ComponentStory<typeof ServiceDialogStories> = (args) => (
    <ServiceDialogStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
