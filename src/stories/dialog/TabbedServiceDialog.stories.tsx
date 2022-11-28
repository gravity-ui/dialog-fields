import React, {Component, Fragment} from 'react';
import {Button} from '@gravity-ui/uikit';
import {DFDialog} from '../../../src/dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';

let counter = 1;

class ServiceDialog extends Component {
    state = {
        dialogVisible: false,
        initialState: {
            order: [
                {
                    id: '1',
                    reason: 'test',
                },
            ],
        },
        formData: [],
    };

    showDialog = () => this.setState({dialogVisible: !this.state.dialogVisible});
    hideDialog = () => this.setState({dialogVisible: false});
    onAdd = (form: any) => {
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
                <DFDialog
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
                            type: 'tab',
                            name: 'first-tab',
                            fields: [
                                {
                                    section: 'This is a fixed tab',
                                    fields: [
                                        {
                                            name: 'service',
                                            type: 'text',
                                            caption: 'Service',
                                            tooltip: 'Please enter your service name',
                                            required: true,
                                            placeholder: 'Select project',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'tab',
                            multiple: true,
                            onCreateTab: (tabData: any) => {
                                return {...tabData, id: ++counter};
                            },
                            renderControls: (tabItem, onDuplicateTab) => (
                                <Button size="l" onClick={() => onDuplicateTab(tabItem.name)}>
                                    Duplicate tab
                                </Button>
                            ),
                            name: 'order',
                            fields: [
                                {
                                    section: 'Details',
                                    fields: [
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
                                            extras: {
                                                children: (
                                                    <span>Some content for custom block</span>
                                                ),
                                            },
                                        },
                                        {
                                            name: 'expireDate',
                                            type: 'until-date',
                                            caption: 'Idm date',
                                            extras: {
                                                size: 'm',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'tab',
                            name: 'last-tab',
                            title: 'Last tab with long name',
                            fields: [
                                {
                                    section: 'This is an example of a last fixed tab',
                                },
                                {
                                    name: 'service',
                                    type: 'text',
                                    caption: 'Service',
                                    tooltip: 'Here you can select ABC service',
                                    required: true,
                                    placeholder: 'Select project',
                                },
                                {
                                    name: 'responsibles',
                                    type: 'text',
                                    caption: 'Responsible for the service',
                                    required: true,
                                    placeholder: 'Select responsibles',
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
    title: 'Dialog fields/TabbedServiceDialog',
    component: ServiceDialog,
} as ComponentMeta<typeof ServiceDialog>;

const Template: ComponentStory<typeof ServiceDialog> = (args) => <ServiceDialog {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
