import React from 'react';
import {StoryObj, Meta} from '@storybook/react';

import {Text} from '@gravity-ui/uikit';

import {EditableList, EditableListItemType, EditableListProps} from '../index';

function genEditableListData() {
    return [
        'Red',
        'white',
        'black',
        'green',
        'Orange',
        'magenta',
        'cyan',
        'Lime',
        'purple',
        'red white black green orange magenta cyan lime purple 1',
        'red white black green orange magenta cyan lime purple 2',
    ].map((i, index) => ({title: i, frozen: index % 3 === 0}));
}

class EditableListDemoItem extends React.Component<EditableListProps> {
    state = {
        data: this.props.value,
    };

    onChange = (data: Array<EditableListItemType<any>>) => {
        this.setState({data});
    };

    render() {
        return (
            <React.Fragment>
                <div style={{maxWidth: 300}}>
                    <EditableList
                        {...this.props}
                        value={this.state.data}
                        onChange={this.onChange}
                    />
                </div>
                <Text className={'value-as-json'} style={{whiteSpace: 'pre-wrap'}}>
                    {'\n\n[\n'}
                    {this.state.data.reduce((acc, item) => {
                        return acc + JSON.stringify(item) + ',\n';
                    }, '')}
                </Text>
            </React.Fragment>
        );
    }
}

export default {
    title: 'Components/EditableList',
    component: EditableListDemoItem,
    argTypes: {},
} as Meta<typeof EditableList>;

export const Frozen: StoryObj<EditableListProps<any>> = {
    render: (args) => <EditableListDemoItem {...args} />,
    args: {
        frozen: true,
        value: genEditableListData(),
    },
};

export const WithMaxVisibleCount: StoryObj<typeof EditableList> = {
    ...Frozen,
    args: {
        maxVisibleCount: 3,
        value: genEditableListData(),
    },
};

export const WithItemRenderer: StoryObj<typeof EditableList> = {
    ...Frozen,
    args: {
        value: genEditableListData(),
        itemRenderer(item) {
            const {title, removed} = item;
            return (
                <span style={{textDecoration: removed ? 'line-through' : 'underline'}}>
                    {title}
                </span>
            );
        },
    },
};
