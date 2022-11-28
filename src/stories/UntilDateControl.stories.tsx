import React from 'react';
import UntilDateControl, {UntilDateControlProps} from '../dialog/UntilDateControl/UntilDateControl';
import {ComponentStory, ComponentMeta} from '@storybook/react';

type Props = Omit<UntilDateControlProps, 'value' | 'onChange'> & {
    initialValue?: UntilDateControlProps['value'];
};

class IdmDatePickerDemoItem extends React.Component<Props, any> {
    static getDerivedStateFromProps({initialValue}: Props, state: any) {
        if (state.initialized) {
            return null;
        }

        return {data: initialValue, initialized: true};
    }

    state = {
        initialized: false,
        data: undefined,
    };

    onChange = (data: Props['initialValue']) => {
        this.setState({data});
    };

    render() {
        console.log(this.state.data);
        return (
            <React.Fragment>
                <UntilDateControl
                    {...this.props}
                    value={this.state.data}
                    onChange={this.onChange}
                />
                <div>
                    <br />
                    <br />
                    {JSON.stringify(this.state.data)}
                </div>
            </React.Fragment>
        );
    }
}

export default {
    title: 'Components/IdmDatePicker',
    component: IdmDatePickerDemoItem,
} as ComponentMeta<typeof IdmDatePickerDemoItem>;

const Template: ComponentStory<typeof IdmDatePickerDemoItem> = (args) => (
    <IdmDatePickerDemoItem {...args} />
);

export const WithNull = Template.bind({});
WithNull.args = {
    initialValue: null,
};

export const WithUndefined = Template.bind({});
WithUndefined.args = {
    initialValue: undefined,
};

const dayMs = 3600 * 24 * 1000;
const nowMs = new Date().getTime();

export const WithDate = Template.bind({});
WithDate.args = {
    initialValue: new Date(nowMs + 10 * dayMs),
};
