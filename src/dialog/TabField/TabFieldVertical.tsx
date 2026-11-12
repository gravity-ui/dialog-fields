import React from 'react';
import {dfCN} from '../../helpers/cn';

import isEqual_ from 'lodash/isEqual';

import {TabField, TabFieldProps, TabItem} from './TabField';
import {List, ListProps, moveItem} from '@gravity-ui/uikit';
import {ListHelloPangeaDnd} from '@gravity-ui/uikit/hello-pangea-dnd';
import {ListVirtualizer} from '@gravity-ui/uikit/virtualizer';

import i18n from './i18n';

import './TabFieldVertical.scss';

const block = dfCN('tab-field-vertical');

const ITEM_HEIGHT = {
    s: 28,
    m: 36,
    l: 48,
};

export interface TabFieldVerticalProps extends TabFieldProps {
    size?: keyof typeof ITEM_HEIGHT;
    sortable?: boolean;

    onOrderChanged?: (params: {oldIndex: number; newIndex: number}) => void;
    wrapTo?: (node: React.ReactNode, item: TabItem) => React.ReactNode;
    virtualized?: boolean;
}

interface State {
    tabItems: TabItem[];
    previousTabItems: TabItem[];
}

export class TabFieldVertical extends React.Component<TabFieldVerticalProps, State> {
    static defaultProps = {
        size: 's' as Exclude<TabFieldVerticalProps['size'], undefined>,
    };

    static isTabControl = true as const;
    static isTabControlVertical = true;

    static getDefaultValue = TabField.getDefaultValue;
    static isEmpty = TabField.isEmpty;

    static getDerivedStateFromProps(props: TabFieldVerticalProps, state: State) {
        if (!isEqual_(props.tabItems, state.previousTabItems)) {
            return {tabItems: props.tabItems, previousTabItems: props.tabItems};
        }
        return null;
    }

    state: State = {
        tabItems: this.props.tabItems,
        previousTabItems: this.props.tabItems,
    };

    onItemAction = (_id: string, item: TabItem) => {
        this.props.setActiveTab(item.id);
    };

    onDrop = (fromId: string, toId: string, position: 'before' | 'after') => {
        const {tabItems} = this.state;
        const items = moveItem(tabItems, fromId, toId, position);
        const oldIndex = tabItems.findIndex(({id}) => String(id) === fromId);
        const newIndex = items.findIndex(({id}) => String(id) === fromId);

        this.setState({tabItems: items});
        this.props.onOrderChanged?.({oldIndex, newIndex});
    };

    getItemContent = (item: TabItem) => {
        const {onRemoveTab, onCreateTab, wrapTo} = this.props;
        const node = TabField.wrapTabItem({
            onRemoveTab,
            onCreateTab,
            item,
            wrapperClassName: block('wrapper'),
        });
        return wrapTo ? wrapTo(node, item) : node;
    };

    getItemTextValue = (item: TabItem) => {
        return typeof item.title === 'string' ? item.title : item.name;
    };

    renderItem: ListProps<TabItem>['renderItem'] = (ctx, helpers) => {
        const className = block('item', {selected: ctx.state.selected});

        if (this.props.sortable) {
            return (
                <ListHelloPangeaDnd.Row
                    ctx={ctx}
                    helpers={{
                        ...helpers,
                        getCellProps: (overrides) =>
                            helpers.getCellProps({className: block('cell'), ...overrides}),
                    }}
                    className={className}
                />
            );
        }

        return (
            <List.ItemView {...helpers.getItemProps({className})} {...helpers.getItemViewProps()}>
                <div {...helpers.getCellProps({className: block('cell')})}>{ctx.content}</div>
            </List.ItemView>
        );
    };

    render() {
        const {className, activeTab, size = 's', sortable, virtualized = true} = this.props;
        const {tabItems} = this.state;
        const list = (
            <List
                className={block('list')}
                aria-label={i18n('label_tabs')}
                role="grid"
                size={size}
                items={tabItems}
                getItemContent={(item) => this.getItemContent(item)}
                getItemTextValue={this.getItemTextValue}
                renderItem={this.renderItem}
                onItemAction={this.onItemAction}
                selectionMode="single"
                selectedIds={activeTab === undefined ? [] : [String(activeTab)]}
            />
        );

        return (
            <div className={block({size}, className)}>
                <ListVirtualizer
                    estimateItemSize={ITEM_HEIGHT[size]}
                    minItemsCount={virtualized ? 0 : Infinity}
                >
                    {sortable ? (
                        <ListHelloPangeaDnd items={tabItems} onDrop={this.onDrop}>
                            {list}
                        </ListHelloPangeaDnd>
                    ) : (
                        list
                    )}
                </ListVirtualizer>
            </div>
        );
    }
}
