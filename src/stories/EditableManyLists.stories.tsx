import React from 'react';
import {dfCN} from '../helpers/cn';
import EditableManyLists, {
    EditableManyListsProps,
} from '../dialog/EditableManyLists/EditableManyLists';
import {StoryFn, Meta} from '@storybook/react';

import './EditableManyListsDemo.scss';
const b = dfCN('editable-lists-control-demo');

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
        {title: 'To add', data: genEditableListData(), itemClassName: b('add')},
        {title: 'Will be removed', data: genEditableListData(), itemClassName: b('remove')},
    ];
}

interface State {
    data: EditableManyListsProps<any>['value'];
}

class DemoItem extends React.Component<Pick<EditableManyListsProps<any>, 'itemRenderer'>, State> {
    state = {
        data: genEditableManyListsData(),
    };

    onChange = (data: State['data']) => {
        this.setState({data});
    };

    render() {
        return (
            <React.Fragment>
                <EditableManyLists
                    {...this.props}
                    value={this.state.data}
                    onChange={this.onChange}
                />
                <div style={{padding: 40, whiteSpace: 'pre-wrap'}}>
                    {'['}
                    {this.state.data.reduce((acc, item, index) => {
                        acc.push(
                            <div key={index} style={{paddingLeft: 20}}>
                                {JSON.stringify(item)},
                            </div>,
                        );
                        return acc;
                    }, [] as Array<React.ReactNode>)}
                    ]
                </div>
            </React.Fragment>
        );
    }
}

export default {
    title: 'Components/EditableManyList',
    component: DemoItem,
} as Meta<typeof DemoItem>;

const Template: StoryFn<typeof DemoItem> = (args) => <DemoItem {...args} />;

export const Frozen = Template.bind({});
Frozen.args = {};

export const WithMaxVisibleCount = Template.bind({});
WithMaxVisibleCount.args = {};

export const WithItemRenderer = Template.bind({});
WithItemRenderer.args = {
    itemRenderer(item) {
        const {title, removed} = item;
        return (
            <span style={{textDecoration: removed ? 'line-through' : 'underline'}}>{title}</span>
        );
    },
};
