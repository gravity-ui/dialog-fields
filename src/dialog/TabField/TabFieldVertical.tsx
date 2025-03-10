import React from 'react';
import {dfCN} from '../../helpers/cn';

import findIndex_ from 'lodash/findIndex';

import {TabField, TabFieldProps, TabItem} from './TabField';
import {List, ListProps} from '@gravity-ui/uikit';

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

    onOrderChanged?: ListProps<any>['onSortEnd'];
    wrapTo?: (node: React.ReactNode, item: TabItem) => React.ReactNode;
    virtualized?: boolean;
}

export class TabFieldVertical extends React.Component<TabFieldVerticalProps> {
    static defaultProps = {
        size: 's' as Exclude<TabFieldVerticalProps['size'], undefined>,
    };

    static isTabControl = true as const;
    static isTabControlVertical = true;

    static getDefaultValue = TabField.getDefaultValue;
    static isEmpty = TabField.isEmpty;

    onItemClick = (item: TabItem) => {
        const {setActiveTab} = this.props;
        setActiveTab(item.id);
    };

    renderItem = (item: TabItem) => {
        const {onRemoveTab, onCreateTab, wrapTo} = this.props;
        const node = TabField.wrapTabItem({
            onRemoveTab,
            onCreateTab,
            item,
            wrapperClassName: block('wrapper'),
        });
        return wrapTo ? wrapTo(node, item) : node;
    };

    render() {
        const {className, activeTab, size, sortable, tabItems, onOrderChanged, ...rest} =
            this.props;
        const selected = findIndex_(tabItems, ({id}) => id === activeTab);

        return (
            <div className={block({size}, className)}>
                <List
                    {...{className: block('list')}}
                    itemHeight={ITEM_HEIGHT[size || TabFieldVertical.defaultProps.size]}
                    size={size}
                    items={tabItems}
                    renderItem={this.renderItem}
                    onItemClick={this.onItemClick}
                    selectedItemIndex={selected}
                    filterable={false}
                    onSortEnd={onOrderChanged}
                    sortable={sortable}
                    {...rest}
                />
            </div>
        );
    }
}
