import React, {Component, Fragment} from 'react';
import cn from 'bem-cn-lite';
import {DFDialog} from '../../dialog/Dialog/Dialog';
import {Card} from '@gravity-ui/uikit';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import '../EditableManyListsDemo.scss';
import './DialogStories.scss';

const blockEditableList = cn('editable-lists-control-demo');
const block = cn('dialog-demo');

function genEditableListData() {
    return [
        'red',
        'white',
        'black',
        'green',
        'orange',
        'magenta',
        'cyan',
        'lime',
        'purple',
        'red white black green orange magenta cyan lime purple 1',
        'red white black green orange magenta cyan lime purple 2',
    ].map((i, index) => ({title: i, frozen: index % 3 === 0}));
}

function genEditableManyListsData() {
    return [
        {title: 'To add', data: genEditableListData(), itemClassName: blockEditableList('add')},
        {
            title: 'Will be removed',
            data: genEditableListData(),
            itemClassName: blockEditableList('remove'),
        },
    ];
}

function testErrorMessage() {
    return 'Test error message';
}

class PageDialogStories extends Component {
    state = {
        dialogVisible: true,
        initialState: {
            name: 'rthub',
            inheritance: true,
            account: 'rthub',
            radioBox: 'one',
            editList: genEditableListData(),
            editManyLists: genEditableManyListsData(),
            showTestError: false,
        },
        formData: {},
    };

    onAddErrorChange = (value: any) => {
        this.setState({
            initialState: {
                ...this.state.initialState,
                showTestError: value,
            },
        });
    };

    onAdd = (form: any) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    decorateByState<T>(field: T) {
        const {showTestError} = this.state.initialState;
        if (!showTestError) {
            return field;
        }

        return {...field, touched: true, validator: testErrorMessage};
    }

    render() {
        const {initialState, formData} = this.state;

        return (
            <Fragment>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
                <DFDialog
                    modal={false}
                    headerProps={{
                        title: 'Order resources',
                        insertAfter: <span>🔥</span>,
                        insertBefore: <span>🔥</span>,
                    }}
                    footerProps={{
                        content: 'Some content for footer',
                    }}
                    onClose={() => null}
                    visible
                    onAdd={this.onAdd}
                    initialValues={initialState}
                    pristineSubmittable
                    waitingMessage="Still in progress... Configuring reading might take up to 10 min"
                    fields={[
                        {
                            section: 'Settings',
                            wrapTo: (node: React.ReactNode) => (
                                <Card className={block('section')} view="raised">
                                    {node}
                                </Card>
                            ),
                            fields: [
                                {
                                    name: 'showTestError',
                                    caption: 'Show demo errors',
                                    type: 'checkbox' as const,
                                    extras: {
                                        children: 'Show demo errors',
                                    },
                                    onChange: this.onAddErrorChange,
                                },
                            ],
                        },
                        {
                            section: 'General information',
                            wrapTo: (node: React.ReactNode) => (
                                <Card className={block('section')} view="raised">
                                    {node}
                                </Card>
                            ),
                            fields: [
                                {
                                    name: 'name',
                                    type: 'plain' as const,
                                    caption: 'Name',
                                    warning: (
                                        <span>This value cannot be decreased in the future</span>
                                    ),
                                },
                                {
                                    name: 'inheritance',
                                    type: 'tumbler' as const,
                                    caption: 'Inherit from parent',
                                    subscribers: {
                                        account: () => {
                                            return initialState.account;
                                        },
                                    },
                                    extras: {
                                        labelRight: 'Allow',
                                    },
                                },
                                {
                                    name: 'radioBox',
                                    type: 'radio' as const,
                                    caption: 'Choose one',
                                    extras: {
                                        options: [
                                            {
                                                value: 'one',
                                                label: 'One',
                                            },
                                            {
                                                value: 'two',
                                                label: 'Two',
                                            },
                                        ],
                                    },
                                },
                                {
                                    name: 'checkbox',
                                    type: 'checkbox' as const,
                                    extras: {
                                        children:
                                            ' I confirm that this change will not break any production processes',
                                    },
                                },
                                {
                                    name: 'account',
                                    type: 'text' as const,
                                    required: true,
                                    caption: 'Account',
                                    extras: {
                                        disabled: true,
                                    },
                                    visibilityCondition: {
                                        when: 'inheritance',
                                        isActive: (value: any) => value,
                                    },
                                },
                                {
                                    name: 'account',
                                    type: 'text' as const,
                                    caption: 'Account',
                                    required: true,
                                    visibilityCondition: {
                                        when: 'inheritance',
                                        isActive: (value: any) => !value,
                                    },
                                },
                            ],
                        },
                        {
                            section: 'Details',
                        },
                        {
                            name: 'reason',
                            type: 'textarea' as const,
                            required: true,
                            caption: 'Why do you need to fill this form?',
                            warning: <span>This value cannot be decreased in the future</span>,
                            condition: {
                                when: 'inheritance',
                                isActive: (value: any) => !value,
                            },
                        },
                        {
                            name: 'otherComments',
                            type: 'textarea' as const,
                            caption: 'Any other comments!!!',
                        },
                        {
                            name: 'helloBlock',
                            type: 'block' as const,
                            extras: {
                                children: <span>Some content for custom block</span>,
                            },
                        },
                        {
                            name: 'expireDate',
                            type: 'until-date' as const,
                            caption: 'Idm date',
                            extras: {
                                size: 'm' as const,
                            },
                        },
                        {
                            name: 'editList',
                            type: 'editable-list' as const,
                            caption: 'Edit list',
                            extras: {
                                maxVisibleCount: 5,
                            },
                        },
                        {
                            name: 'editManyLists',
                            type: 'multi-editable-lists' as const,
                            title: 'Many editable lists',
                            extras: {
                                maxVisibleCount: 4,
                            },
                        },
                        {
                            name: 'Select',
                            type: 'select' as const,
                            caption: 'Color',
                            extras: {
                                showSearch: false,
                                type: 'single',
                                items: [
                                    {value: 'red', title: 'Red'},
                                    {value: 'green', title: 'Green'},
                                    {value: 'blue', title: 'Blue'},
                                ],
                                placeholder: 'Enter color',
                            },
                        },
                    ].map(this.decorateByState.bind(this))}
                />
            </Fragment>
        );
    }
}

export default {
    title: 'Dialog fields/With tabs',
    component: PageDialogStories,
} as ComponentMeta<typeof PageDialogStories>;

const Template: ComponentStory<typeof PageDialogStories> = (args) => (
    <PageDialogStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
