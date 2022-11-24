import React from 'react';
import cn from 'bem-cn-lite';

import EditableList, {EditableListItemType, EditableListProps} from '../EditableList/EditableList';
import './EditableManyLists.scss';

const block = cn('ic-editable-many-lists');

export interface EditableManyListsProps<T> {
    className?: string;
    titleClassName?: string;

    value: Array<EditableManyListsItemType<T>>;
    onChange: (value: EditableManyListsProps<T>['value']) => void;

    itemRenderer?: EditableListProps<T>['itemRenderer'];

    maxVisibleCount?: number;
}

export interface EditableManyListsItemType<T> {
    title: string;
    itemClassName?: string;
    data: Array<EditableListItemType<T>>;
}

class EditableManyLists<T> extends React.Component<EditableManyListsProps<T>> {
    static getDefaultValue() {
        return [];
    }

    static isEmpty() {
        return false;
    }

    onChange = (index: number, data: EditableManyListsItemType<T>['data']) => {
        const {value, onChange} = this.props;
        const newRowData = {...value[index], data};
        const newValue = [...value];
        newValue.splice(index, 1, newRowData);
        onChange(newValue);
    };

    render() {
        const {className, value, itemRenderer, titleClassName, maxVisibleCount} = this.props;
        return (
            <div className={block(null, className)}>
                {value.map(({title, data, ...rest}, index) => (
                    <React.Fragment key={index}>
                        <span key={index} className={block('title', titleClassName)}>
                            {title}
                        </span>
                        <EditableList
                            itemRenderer={itemRenderer}
                            maxVisibleCount={maxVisibleCount}
                            {...rest}
                            value={data}
                            onChange={this.onChange.bind(this, index)}
                        />
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default EditableManyLists;
