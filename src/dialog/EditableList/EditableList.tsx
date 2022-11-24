import React from 'react';
import cn from 'bem-cn-lite';

import Icon, {repeatIcon, closeIcon} from '../Icon/Icon';

import './EditableList.scss';

const block = cn('ic-editable-list');

EditableListItem.defaultProps = {
    itemRenderer: (item: EditableListItemType<unknown>) => item.title,
};

interface EditableListItemProps<T> {
    index: number;
    className?: EditableListProps<T>['itemClassName'];
    item: EditableListItemType<T>;
    frozen?: boolean;
    toggleRemove: (item: EditableListItemType<T>, index: number) => void;
    itemRenderer: (item: EditableListItemType<T>) => React.ReactNode;
}

function EditableListItem<T>({
    index,
    className,
    item,
    frozen,
    toggleRemove,
    itemRenderer,
}: EditableListItemProps<T>) {
    const onClick = React.useCallback(() => {
        toggleRemove(item, index);
    }, [item, toggleRemove, index]);
    const data = item.removed ? repeatIcon : closeIcon;
    const hasActions = !frozen && !item.frozen;

    return (
        <span className={block('item', className)}>
            <span className={block('item-content', {removed: item.removed})} title={item.title}>
                {itemRenderer(item)}
            </span>
            {hasActions && (
                <span className={block('item-action')} onClick={onClick}>
                    <Icon iconData={data} />
                </span>
            )}
        </span>
    );
}

export interface EditableListProps<T = any> {
    className?: string;

    itemClassName?: string;
    value: Array<EditableListItemType<T>>;
    maxVisibleCount?: number;

    itemRenderer?: (item: EditableListItemType<T>) => React.ReactNode;
    frozen?: boolean;

    onChange: (value: EditableListProps<T>['value']) => void;
}

export interface EditableListItemType<T> {
    title: string;
    removed?: boolean;
    frozen?: boolean;
    data?: T;
}

interface State {
    showAll: boolean;
}

class EditableList<T = any> extends React.Component<EditableListProps<T>, State> {
    static defaultProps = {
        value: [],
    };

    static getDefaultValue() {
        return [];
    }

    static isEmpty() {
        return false;
    }

    state: State = {
        showAll: false,
    };

    renderItem = (item: EditableListItemType<T>, index: number) => {
        const {itemClassName, itemRenderer, frozen} = this.props;
        return (
            <EditableListItem
                key={index}
                className={itemClassName}
                index={index}
                item={item}
                frozen={frozen}
                toggleRemove={this.toggleRemove}
                itemRenderer={itemRenderer}
            />
        );
    };

    toggleRemove = (item: EditableListItemType<T>, index: number) => {
        const {value, onChange} = this.props;
        const res = [...value];
        res[index] = {...item, removed: !item.removed};
        onChange(res);
    };

    renderShowAll() {
        const {showAll} = this.state;
        const text = showAll ? 'Hide' : 'Show all';
        return (
            <span className={block('show-all')} onClick={this.onShowAll}>
                {text}
            </span>
        );
    }

    onShowAll = () => {
        this.setState({showAll: !this.state.showAll});
    };

    render() {
        const {className, value, maxVisibleCount} = this.props;
        const {showAll} = this.state;

        const itemsToRender = !showAll && maxVisibleCount ? value.slice(0, maxVisibleCount) : value;
        const showAllVisible = showAll || itemsToRender.length !== value.length;

        return (
            <div className={block(null, className)}>
                {itemsToRender.map(this.renderItem)}
                {showAllVisible && this.renderShowAll()}
            </div>
        );
    }
}

export default EditableList;
