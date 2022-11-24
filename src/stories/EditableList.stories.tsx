import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import EditableList, {
    EditableListItemType,
    EditableListProps,
} from '../dialog/EditableList/EditableList';

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
                <div style={{whiteSpace: 'pre-wrap'}}>
                    {'\n\n[\n'}
                    {this.state.data.reduce((acc, item) => {
                        return acc + JSON.stringify(item) + ',\n';
                    }, '')}
                    ]
                </div>
            </React.Fragment>
        );
    }
}

export default {
    title: 'Components/EditableList',
    component: EditableListDemoItem,
} as ComponentMeta<typeof EditableListDemoItem>;

const Template: ComponentStory<typeof EditableListDemoItem> = (args) => (
    <EditableListDemoItem {...args} />
);

export const Frozen = Template.bind({});
Frozen.args = {
    frozen: true,
    value: genEditableListData(),
};

export const WithMaxVisibleCount = Template.bind({});
WithMaxVisibleCount.args = {
    maxVisibleCount: 3,
    value: genEditableListData(),
};

export const WithItemRenderer = Template.bind({});
WithItemRenderer.args = {
    value: genEditableListData(),
    itemRenderer(item) {
        const {title, removed} = item;
        return (
            <span style={{textDecoration: removed ? 'line-through' : 'underline'}}>{title}</span>
        );
    },
};
