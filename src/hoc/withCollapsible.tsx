import React from 'react';

import {Button} from '@gravity-ui/uikit';
import {getDisplayName} from './utils';

export interface CollapsedState {
    collapsed: boolean;
}

export interface CollapsedProps {
    items: Array<unknown>;
    visibleCount: number;
    initialExpanded?: boolean;

    renderToggler?: () => void;
}

export default function withCollapsible<P extends CollapsedProps>(
    Component: React.ComponentType<P>,
): React.ComponentType<P> {
    const ResultComponent: React.ComponentType<P> = class WithCollapsible extends React.Component<
        P,
        CollapsedState
    > {
        static displayName = `WithCollapsible(${getDisplayName(Component)})`;

        state: CollapsedState = {collapsed: true};

        constructor(props: P) {
            super(props);
            this.state = {collapsed: !props.initialExpanded};
            if (props.renderToggler) {
                console.warn('"renderToggler" property will be overriden');
            }
        }

        render() {
            return (
                <Component
                    {...this.props}
                    items={this.getItems()}
                    renderToggler={this.renderToggler}
                />
            );
        }

        getItems() {
            const visibleCount = this.getVisibleItemsCount();
            const {items} = this.props;
            return visibleCount < items.length ? items.slice(0, visibleCount) : items;
        }

        getVisibleItemsCount() {
            const {items, visibleCount} = this.props;
            const {collapsed} = this.state;

            return collapsed && items.length > visibleCount ? visibleCount : items.length;
        }

        handleToggle = () => this.setState((prevState) => ({collapsed: !prevState.collapsed}));

        renderToggler = () => {
            const {items, visibleCount} = this.props;
            const {collapsed} = this.state;
            const hasToggler = items.length > visibleCount;
            const resCount = items.length - visibleCount;

            return (
                hasToggler && (
                    <Button size="s" view="flat" onClick={this.handleToggle}>
                        {collapsed ? `Show more (${resCount})` : 'Show less'}
                    </Button>
                )
            );
        };
    };

    return ResultComponent;
}
