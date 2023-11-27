import React from 'react';
import MultiTextControl, {MultiTextControlProps} from '../dialog/MultiTextControl/MultiTextControl';
import {StoryFn, Meta} from '@storybook/react';

interface Props {
    initialValue: MultiTextControlProps['value'];
    disabled?: boolean;
}

class MultiText extends React.Component<Props> {
    state = {
        data: [
            {name: 'one'},
            {name: 'two'},
            {
                name: 'some-very-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-label',
            },
            {name: 'three'},
            {name: 'four'},
            {name: 'five'},
        ],
    };

    onChange = (data: MultiTextControlProps['value']) => {
        this.setState({data});
    };

    render() {
        return (
            <div style={{maxWidth: 300}}>
                Tags:
                <MultiTextControl
                    {...this.props}
                    value={this.state.data}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default {
    title: 'Components/MultiTextControl',
    component: MultiText,
} as Meta<typeof MultiText>;

const Template: StoryFn<typeof MultiText> = (args) => <MultiText {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    initialValue: [],
};

export const Disabled = Template.bind({});
Disabled.args = {
    initialValue: [],
    disabled: true,
};
