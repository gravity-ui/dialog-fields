import React from 'react';

export interface CustomBlockProps {
    value: unknown;
    onChange: (value: CustomBlockProps['value']) => void;

    children: React.ReactNode;
}

class CustomBlock extends React.Component<CustomBlockProps> {
    static renderLabel = () => null;
    static getDefaultValue = () => undefined;

    render() {
        return this.props.children || null;
    }
}

export default CustomBlock;
