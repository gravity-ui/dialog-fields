import React from 'react';

export interface CustomBlockProps {
    value: unknown;
    onChange: (value: CustomBlockProps['value']) => void;

    children: React.ReactNode;
}

export class CustomBlock extends React.Component<CustomBlockProps> {
    static renderLabel = () => null;
    static getDefaultValue = () => undefined;

    render() {
        return this.props.children || null;
    }
}
