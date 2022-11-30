import React, {Component, Fragment} from 'react';
import {Button} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import {DFDialog} from '../../../src/dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import './TabbedVerticallyServiceDialog.scss';

const block = cn('tabbed-vertically-service-dialog');

let counter = 1;

class ServiceDialogVerticalTabs extends Component {
    state = {
        dialogVisible: false,
        initialState: {
            order: [
                {
                    id: '1',
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
                    className={block()}
                    size="l"
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
                            type: 'tab-vertical',
                            name: 'first-tab',
                            fields: [
                                {
                                    section: 'This is a fixed tab',
                                },
                                {
                                    name: 'service',
                                    type: 'text',
                                    caption: 'Service',
                                    tooltip: 'Please entery your service name',
                                    required: true,
                                    placeholder: 'Select project',
                                },
                            ],
                        },
                        {
                            type: 'tab-vertical',
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
                                    section: 'General information',
                                },
                                {
                                    name: 'service',
                                    type: 'text',
                                    caption: 'Service',
                                    tooltip: 'Please enter your service name',
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
                                    extras: {
                                        children: <span>Some content for custom block</span>,
                                    },
                                },
                            ],
                        },
                        {
                            type: 'tab-vertical',
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
                                    tooltip: 'Please enter your service name',
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
    title: 'Dialog fields/TabbedVerticallyServiceDialog',
    component: ServiceDialogVerticalTabs,
} as ComponentMeta<typeof ServiceDialogVerticalTabs>;

const Template: ComponentStory<typeof ServiceDialogVerticalTabs> = (args) => (
    <ServiceDialogVerticalTabs {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
