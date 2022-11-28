import React, {Component} from 'react';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import cn from 'bem-cn-lite';
import {TextInput, TextInputProps} from '@gravity-ui/uikit';

import LabelsGroup from './LabelsGroup/LabelsGroup';
import {FocusBlurContainer} from '../FocusBlurContainer/FocusBlurContainer';

import type {ArrayElement} from '../types';

import './MultiTextControl.scss';

const block = cn('df-multi-text-control');

export type MultiTextControlProps = Partial<
    Omit<
        TextInputProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'onChange' | 'onKeyDown' | 'error'
    >
> & {
    value: Array<{name: string; isDefault?: boolean}>;
    onChange: (value: MultiTextControlProps['value']) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    error?: string | undefined;
};

type ItemType = ArrayElement<MultiTextControlProps['value']>;

interface State {
    currentLabel: string;
}

class MultiTextControl extends Component<MultiTextControlProps, State> {
    static ENTER = 13;

    static hasErrorRenderer = true;

    static getDefaultValue() {
        return [];
    }

    static isEmpty(value: MultiTextControlProps['value']) {
        return !value.length;
    }

    static remove(theItem: ItemType, items: Array<ItemType>) {
        const index = _findIndex(items, (anItem) => theItem.name === anItem.name);
        if (index > -1) {
            const copy = [...items];
            copy.splice(index, 1);
            return copy;
        }

        return items;
    }

    state: State = {currentLabel: ''};

    updateLabel = (text: string) => {
        this.setState({currentLabel: text});
    };

    confirmText = () => {
        const {currentLabel} = this.state;

        if (currentLabel?.length > 0) {
            const {onChange, value: labels} = this.props;

            if (!_find(labels, (label) => label.name === currentLabel)) {
                onChange(labels.concat({name: currentLabel}));
            }
            this.setState({currentLabel: ''});
        }
    };

    handleAdd = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.keyCode === MultiTextControl.ENTER) {
            this.confirmText();
        }
    };

    handleClear = () => {
        this.props.onChange(MultiTextControl.getDefaultValue());
    };

    handleRemove = (item: ItemType) => {
        const {onChange, value: items} = this.props;
        onChange(MultiTextControl.remove(item, items));
    };

    render() {
        const {value: labels, onChange: _onChange, onBlur, onFocus, disabled, ...rest} = this.props;

        return (
            <FocusBlurContainer className={block()} onBlur={onBlur} onFocus={onFocus}>
                <TextInput
                    size="s"
                    view="normal"
                    autoComplete={false}
                    hasClear
                    disabled={disabled}
                    {...rest}
                    onUpdate={this.updateLabel}
                    onKeyDown={this.handleAdd}
                    {...{onBlur: this.confirmText}}
                    value={this.state.currentLabel}
                />
                <LabelsGroup
                    items={labels}
                    visibleCount={4}
                    disabled={disabled}
                    onRemoveAll={this.handleClear}
                    onRemove={this.handleRemove}
                />
            </FocusBlurContainer>
        );
    }
}

export default MultiTextControl;
