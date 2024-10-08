import React, {Component} from 'react';
import map_ from 'lodash/map';
import {Button, Label} from '@gravity-ui/uikit';
import {dfCN} from '../../../helpers/cn';
import withCollapsible from '../../../hoc/withCollapsible';

import './LabelsGroup.scss';
import {ArrayElement} from '../../types';

const block = dfCN('labels-group');

export type LabelGroupProps = {
    items: Array<{name: string; isDefault?: boolean}>;
    visibleCount: number;
    disabled?: boolean;

    onClick?: (item: ItemType) => void;
    onRemove?: (item: ItemType) => void;
    onRemoveAll?: () => void;

    renderToggler?: () => React.ReactNode;
};

type ItemType = ArrayElement<LabelGroupProps['items']>;

class LabelsGroupComponent extends Component<LabelGroupProps> {
    handleLabelClick = (label: ItemType) => {
        const {onClick} = this.props;
        if (typeof onClick === 'function') {
            onClick(label);
        }
    };

    handleRemoveClick = (evt: React.MouseEvent<HTMLElement>, label: ItemType) => {
        const {onRemove} = this.props;

        evt.stopPropagation();
        if (typeof onRemove === 'function') {
            onRemove(label);
        }
    };

    renderLabel(label: ItemType) {
        const {onRemove, disabled} = this.props;
        const {name, isDefault} = label;

        const onLabelClick = () => this.handleLabelClick(label);
        const onRemoveClick = (evt: React.MouseEvent<HTMLElement>) =>
            this.handleRemoveClick(evt, label);

        return (
            <Label
                key={name}
                className={block('label')}
                type={onRemove && !isDefault ? 'close' : 'default'}
                onClick={onLabelClick}
                onCloseClick={onRemoveClick}
                size="s"
                disabled={disabled}
            >
                {name}
            </Label>
        );
    }

    render() {
        const {items, renderToggler, onRemoveAll, disabled} = this.props;

        return (
            <div className={block()}>
                {map_(items, (label) => this.renderLabel(label))}
                {renderToggler?.()}
                {onRemoveAll && items.length > 0 && (
                    <Button
                        size="s"
                        view="flat-secondary"
                        onClick={onRemoveAll}
                        disabled={disabled}
                    >
                        Clear all
                    </Button>
                )}
            </div>
        );
    }
}

export const LabelsGroup = withCollapsible(LabelsGroupComponent);
