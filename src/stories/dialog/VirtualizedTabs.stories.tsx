import React, {Component, Fragment} from 'react';
import {Button} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import _debounce from 'lodash/debounce';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {DFDialog, DFDialogField, DFDialogTabField} from '../../../src/dialog/Dialog/Dialog';

import './TabbedVerticallyServiceDialog.scss';

const block = cn('tabbed-vertically-service-dialog');

interface State {
    dialogVisible: boolean;
    initialState: any;
    formData: any;
    orders: Array<string>;
    applyDisabled: boolean;
    nameErrors: Record<string, {counter: number; error?: string}>;
}

class DialogWithVirtualizedTabs extends Component {
    state: State = {
        dialogVisible: true,
        initialState: {},
        formData: [],
        orders: ['Order 1'],
        nameErrors: {},
        applyDisabled: false,
    };

    showDialog = () => this.setState({dialogVisible: !this.state.dialogVisible});
    hideDialog = () => this.setState({dialogVisible: false});
    onAdd = (form: any) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    onAddOrder = () => {
        const {orders} = this.state;
        this.setOrders([...orders, `Order ${orders.length + 1}`]);
    };

    setOrders(orders: State['orders']) {
        const nameErrors: State['nameErrors'] = {};
        let hasError = false;
        orders.forEach((name) => {
            if (!nameErrors[name]) {
                nameErrors[name] = {counter: 0};
            }

            const nameData = nameErrors[name];
            nameData.counter++;
            if (!name) {
                nameData.error = 'The name must not be empty';
            } else if (nameData.counter > 1) {
                nameData.error = 'The name must be unique';
            }

            hasError = hasError || nameData.error !== undefined;
        });

        this.setState({orders, nameErrors, applyDisabled: hasError});
    }

    removeOrder(index: number) {
        const orders = this.state.orders.slice();
        orders.splice(index, 1);
        this.setOrders(orders);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    renameOrder = _debounce((index, newName): void => {
        const {orders: oldOrders} = this.state;
        if (oldOrders[index] === newName) {
            return;
        }
        const orders = oldOrders.slice();
        orders[index] = newName;

        this.setOrders(orders);
    }, 500);

    checkName(name: string) {
        const {nameErrors} = this.state;
        return nameErrors[name]?.error;
    }

    genOrderTabFields() {
        const {orders} = this.state;
        const initials: any = {};
        const fields = orders.map((title, index) => {
            const fieldName = `order${index}`;
            initials[fieldName] = {
                name: title,
            };
            const res: DFDialogTabField<DFDialogField> = {
                type: 'tab-vertical',
                name: fieldName,
                title,
                fields: [
                    {
                        section: 'General information',
                    },
                    {
                        name: 'name',
                        type: 'text',
                        caption: 'Order name',
                        onChange: (value: string | number) => this.renameOrder(index, value),
                    },
                    {
                        name: 'service',
                        type: 'text',
                        caption: 'Service',
                        tooltip: 'Please enter your service name',
                        placeholder: 'Select project',
                    },
                    {
                        name: 'responsibles',
                        type: 'text',
                        caption: 'Responsible for the service',
                        placeholder: 'Select responsibles',
                    },
                    {
                        section: 'Details',
                    },
                    {
                        name: 'reason',
                        type: 'textarea',
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
                    {
                        name: 'expireDate',
                        type: 'until-date',
                        caption: 'Expire date',
                        extras: {
                            size: 'm',
                        },
                    },
                ],
            };
            if (orders.length > 1) {
                res.fields.push({
                    type: 'block',
                    name: 'removeOrder',
                    extras: {
                        children: (
                            <Button view="action" size="l" onClick={() => this.removeOrder(index)}>
                                Remove order
                            </Button>
                        ),
                    },
                });
            }
            return res;
        });

        return {fields, initials};
    }

    isApplyDisabled = () => {
        return this.state.applyDisabled;
    };

    render() {
        const {dialogVisible, initialState, formData} = this.state;

        const {fields: orderTabs, initials: orderInitials} = this.genOrderTabFields();

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
                    virtualized
                    className={block()}
                    size="l"
                    visible={dialogVisible}
                    onClose={this.hideDialog}
                    headerProps={{
                        title: 'Order resources',
                        insertAfter: <span>🔥</span>,
                    }}
                    onAdd={this.onAdd}
                    isApplyDisabled={this.isApplyDisabled}
                    initialValues={{
                        ...initialState,
                        ...orderInitials,
                    }}
                    fields={[
                        {
                            type: 'tab-vertical',
                            name: 'first-tab',
                            title: 'Settings',
                            fields: [
                                {
                                    type: 'block',
                                    name: 'addBlock',
                                    extras: {
                                        children: (
                                            <Button
                                                view="action"
                                                size="l"
                                                onClick={this.onAddOrder}
                                            >
                                                Add Order
                                            </Button>
                                        ),
                                    },
                                },
                            ],
                        },
                        ...orderTabs,
                    ]}
                />
            </Fragment>
        );
    }
}

export default {
    title: 'Dialog fields/VirtualizedTabs',
    component: DialogWithVirtualizedTabs,
} as ComponentMeta<typeof DialogWithVirtualizedTabs>;

const Template: ComponentStory<typeof DialogWithVirtualizedTabs> = (args) => (
    <DialogWithVirtualizedTabs {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
