import React from 'react';
import {ChevronDown, ChevronUp} from '@gravity-ui/icons';

import {dfCN} from '../../helpers/cn';

import './CollapsibleSection.scss';

const block = dfCN('collapsible-section');

export type CollapsibleSectionProps = {
    className?: string;

    alwaysExpanded?: boolean;
    initialCollapsed?: boolean;

    caption: string;
    captionClassName?: string;

    children?: React.ReactNode;
};

export function CollapsibleSection({
    className,
    alwaysExpanded,
    initialCollapsed,
    children,
    caption,
    captionClassName,
}: CollapsibleSectionProps) {
    const [collapsed, setCollapsed] = React.useState(initialCollapsed && !alwaysExpanded);
    const handleToggle = React.useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed]);

    return (
        <section className={block(null, className)}>
            <h2
                className={block(
                    'caption',
                    {collapsed, collapsible: !alwaysExpanded},
                    captionClassName,
                )}
                onClick={alwaysExpanded ? undefined : handleToggle}
            >
                {caption}
                {!alwaysExpanded && <span> {collapsed ? <ChevronDown /> : <ChevronUp />}</span>}
            </h2>
            <section className={block('content', {collapsed})}>{children}</section>
        </section>
    );
}
