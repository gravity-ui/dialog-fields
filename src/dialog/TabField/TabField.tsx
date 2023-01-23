import React, {Component} from 'react';
import {Tabs} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';

import {DangerIcon, CloseIcon} from '../Icon/Icon';

import './TabField.scss';

const block = cn('df-dialog-tab');

export interface TabFieldProps {
    className?: string;

    activeTab?: string;
    setActiveTab: (activeTab: string) => void;

    onRemoveTab?: (item: TabItem) => void;
    onCreateTab?: (fieldName: string, active?: boolean, opts?: {userOptions?: any}) => void;

    tabItems: Array<TabItem>;

    size?: 's' | 'm' | 'l';
}

export interface TabItem {
    id: string;
    name: string;
    title: string;
    multiple?: boolean;
    removable?: boolean;
    error?: string | object;
}

export interface TabSpec {
    multiple?: boolean;
}

class TabField extends Component<TabFieldProps> {
    static isTabControl = true as const;
    static isTabControlVertical = false;

    static getDefaultValue(tabSpec: TabSpec) {
        return tabSpec.multiple ? [] : {};
    }

    static isEmpty(value: Array<unknown>, tabSpec: TabSpec) {
        return tabSpec.multiple ? !value.length : !Object.keys(value).length;
    }

    static wrapTabItem = (
        onRemoveTab: TabFieldProps['onRemoveTab'],
        _onCreateTab: TabFieldProps['onCreateTab'],
        item: TabItem,
        tabNode: React.ReactNode,
        wrapperMods = {},
    ) => {
        return (
            <div key={item.id} className={block('wrapper', wrapperMods)}>
                <span className={block('name')}>
                    <span className={block('name-text')}>{tabNode}</span>
                    {item.error && (
                        <span
                            className={block('warning-icon')}
                            title="Some fields in this tab are not valid"
                        >
                            <DangerIcon />
                        </span>
                    )}
                </span>
                {item.multiple && item.removable && (
                    <span
                        className={block('remove-icon')}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveTab!(item);
                        }}
                    >
                        <CloseIcon />
                    </span>
                )}
            </div>
        );
    };

    render() {
        const {className, tabItems, activeTab, setActiveTab, onRemoveTab, onCreateTab} = this.props;

        return (
            <Tabs
                className={className}
                items={tabItems}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                wrapTo={TabField.wrapTabItem.bind(null, onRemoveTab, onCreateTab)}
            />
        );
    }
}

export default TabField;
