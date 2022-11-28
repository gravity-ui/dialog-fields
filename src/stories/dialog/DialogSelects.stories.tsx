import React, {Component, Fragment} from 'react';
import {DFDialog} from '../../dialog/Dialog/Dialog';
import {ComponentStory, ComponentMeta} from '@storybook/react';

class DialogWithSelectStories extends Component {
    state = {
        dialogVisible: true,
        initialState: {},
        formData: {},
    };

    onAdd = (form: any) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    render() {
        const {initialState, formData} = this.state;

        return (
            <Fragment>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
                <DFDialog
                    modal={false}
                    headerProps={{
                        title: 'With selects',
                    }}
                    onClose={() => null}
                    visible
                    onAdd={this.onAdd}
                    initialValues={initialState}
                    pristineSubmittable
                    fields={[
                        {
                            name: 'Select',
                            type: 'select' as const,
                            caption: 'Color',
                            placeholder: 'Enter color',
                            extras: {
                                showSearch: false,
                                items: [
                                    {value: 'red', title: 'Red'},
                                    {value: 'green', title: 'Green'},
                                    {value: 'blue', title: 'Blue'},
                                ],
                            },
                            onChange: (
                                sigleSelectValue:
                                    | number
                                    | string
                                    | Array<number | string>
                                    | undefined,
                            ) => {
                                console.log({sigleSelectValue});
                            },
                        },
                        {
                            name: 'Select multiple',
                            type: 'select' as const,
                            caption: 'Color',
                            placeholder: 'Enter color',
                            extras: {
                                singleValueMode: true,
                                showSearch: false,
                                items: [
                                    {value: 'red', title: 'Red'},
                                    {value: 'green', title: 'Green'},
                                    {value: 'blue', title: 'Blue'},
                                ],
                            },
                            onChange: (
                                multiSelectValue:
                                    | number
                                    | string
                                    | Array<number | string>
                                    | undefined,
                            ) => {
                                console.log({multiSelectValue});
                            },
                        },
                    ]}
                />
            </Fragment>
        );
    }
}

export default {
    title: 'Dialog fields/With select',
    component: DialogWithSelectStories,
} as ComponentMeta<typeof DialogWithSelectStories>;

const Template: ComponentStory<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
