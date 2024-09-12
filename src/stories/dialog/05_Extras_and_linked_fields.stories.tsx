import React, {Component, Fragment} from 'react';
import {StoryFn, Meta} from '@storybook/react';
import {Button} from '@gravity-ui/uikit';

import {DFDialog, FormApi} from '../../index';
import {useSize} from '../SizeContext';

interface FormValues {
    type: Array<string>;
    choice: Array<string>;
}

class DialogWithSelectStories extends Component {
    state = {
        dialogVisible: true,
        initialState: {},
        formData: {},
        showModal: false,
    };

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    onAdd = (form: FormApi<FormValues>) => {
        this.setState({formData: form.getState().values});
        return Promise.resolve();
    };

    render() {
        const {initialState, formData, showModal} = this.state;

        return (
            <Fragment>
                <Button onClick={this.onToggleModal}>Show modal</Button>
                <pre>Confirmed form values: {JSON.stringify(formData, null, 2)}</pre>
                <DialogDemo initialValues={initialState} onAdd={this.onAdd} modal={false} />
                {showModal && (
                    <DialogDemo
                        initialValues={formData}
                        modal={true}
                        onAdd={this.onAdd}
                        onClose={() => this.onToggleModal()}
                    />
                )}
            </Fragment>
        );
    }
}

function DialogDemo({
    modal,
    onAdd,
    initialValues,
    onClose,
}: {
    modal: boolean;
    initialValues?: Partial<FormValues>;
    onAdd: (form: FormApi<FormValues>) => Promise<void>;
    onClose?: () => void;
}) {
    return (
        <DFDialog<FormValues, Partial<FormValues>>
            modal={modal}
            headerProps={{
                title: 'Linked fields by value',
            }}
            {...useSize()}
            onClose={onClose ?? (() => {})}
            visible
            onAdd={onAdd}
            initialValues={initialValues}
            pristineSubmittable
            fields={[
                {
                    type: 'block',
                    name: 'block',
                    extras: {
                        children: (
                            <div style={{color: 'gray'}}>
                                It is possible to provide additional properties for controls by
                                using <b>extras</b>. Also you can make fields depending to each
                                other by values by using this property.
                            </div>
                        ),
                    },
                },
                {
                    name: 'type',
                    type: 'select',
                    caption: 'Type',
                    extras: {
                        width: 'max',
                        placeholder: 'Type',
                        options: [
                            {value: 'color', content: 'Color'},
                            {value: 'fruit', content: 'Fruit'},
                        ],
                        hasClear: true,
                    },
                },
                {
                    name: 'choice',
                    type: 'select',
                    caption: 'Choice',
                    extras: ({type = []}, {input}) => {
                        const [selectedType] = type;
                        const values =
                            selectedType === 'color'
                                ? ['red', 'greed', 'blue']
                                : ['apple', 'orange', 'pear'];

                        const {value, onChange} = input;
                        if (value?.[0] && -1 === values.indexOf(value[0])) {
                            setTimeout(() => {
                                onChange([]);
                            }, 200);
                        }

                        return {
                            width: 'max',
                            disabled: !selectedType,
                            placeholder: !selectedType
                                ? 'You have to pick a "Type" to unlock the field.'
                                : `Choose your ${selectedType}...`,
                            options: values.map((i) => ({value: i, content: i})),
                        };
                    },
                },
            ]}
        />
    );
}

export default {
    title: 'Demo/05. Extras and linked fields',
    component: DialogWithSelectStories,
} as Meta<typeof DialogWithSelectStories>;

const Template: StoryFn<typeof DialogWithSelectStories> = (args) => (
    <DialogWithSelectStories {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
