import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog as CommonDialog,
    DialogFooterProps,
    ModalCloseReason,
    Popover,
} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import _ from 'lodash';
import {Decorator, FORM_ERROR, FormApi, FormState, ValidationErrors, FieldState} from 'final-form';
import {Field, FieldInputProps, FieldMetaState, Form, FormProps, FormSpy} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {FieldArray} from 'react-final-form-arrays';
import createDecorator, {Calculation, Updates} from 'final-form-calculate';
import {OnChange} from 'react-final-form-listeners';

import Icon, {infoIcon, tooltipIcon, warningIcon} from '../Icon/Icon';
import TextControl, {TextControlProps} from '../TextControl/TextControl';
import TextAreaControl, {TextAreaControlProps} from '../TextAreaControl/TextAreaControl';
import SelectControl, {SelectControlProps} from '../SelectControl/SelectControl';
import TumblerControl, {TumblerControlProps} from '../TumblerControl/TumblerControl';
import PlainText, {PlainTextProps} from '../PlainText/PlainText';
import CheckBoxControl, {CheckBoxControlProps} from '../CheckBoxControl/CheckBoxControl';
import Condition from '../Condition/Condition';
import CustomBlock, {CustomBlockProps} from '../CustomBlock/CustomBlock';
import RadioButtonControl, {
    RadioButtonControlProps,
} from '../RadioButtonControl/RadioButtonControl';
import UntilDateControl, {UntilDateControlProps} from '../UntilDateControl/UntilDateControl';
import EditableList, {EditableListProps} from '../EditableList/EditableList';
import EditableManyLists, {EditableManyListsProps} from '../EditableManyLists/EditableManyLists';
import MultiTextControl, {MultiTextControlProps} from '../MultiTextControl/MultiTextControl';
import TabField, {TabFieldProps, TabItem} from '../TabField/TabField';
import {checkTabId, getTabId, applyFunctions} from './utils';
import {useStableEventHandler} from '../../helpers/useStableEventHendler';

import './Dialog.scss';
import TabFieldVertical, {TabFieldVerticalProps} from '../TabField/TabFieldVertical';

import i18n from './i18n';
import {
    ArrayElement,
    ControlProps,
    ControlStaticApi,
    DistributiveOmit,
    TabControlStaticApi,
    ValidatorType,
} from '../types';

const bDialog = cn('ic-dialog');
const bPage = cn('page-dialog');

function composeValidators<T>(...validators: Array<ValidatorType<T>>) {
    return async (value: T, allValues: object | undefined, state?: FieldState<T>) => {
        for (const validate of validators) {
            try {
                const res = await validate(value, allValues, state);
                if (res) {
                    return res;
                }
            } catch (e) {
                return 'Validation exception: ' + e;
            }
        }
        return undefined;
    };
}

const noop = () => {};

const tabControlTypes: Array<string> = [];

function isSectionField<FieldT>(field: DialogField<FieldT>): field is SectionType<FieldT> {
    return (field as SectionType<FieldT>).section !== undefined;
}

function isSeparatorField<FieldT>(field: DialogField<FieldT>): field is SeparatorType {
    return (field as SeparatorType).separator !== undefined;
}

function isControlField(field: {type?: string}): field is ControlField {
    try {
        return !isTabbedField(field) && getControl(field.type) !== undefined;
    } catch (_e) {
        return false;
    }
}

function isTabbedField<F extends ControlField>(field: {type?: string}): field is TabbedField<F> {
    return isTabControl(field.type);
}

function isArrayOfTabs<F>(v: any): v is Array<TabbedField<F>> {
    return Dialog.hasTabs(v);
}

function isTabControl(type?: string) {
    return 'string' === typeof type && tabControlTypes.indexOf(type) !== -1;
}

const controls = new Map();
function getControl<V, P>(type?: string): ControlStaticApi<V> & React.ComponentType<P> {
    if (controls.has(type)) {
        return controls.get(type);
    } else {
        throw new Error(`Control '${type}' is not registered as the Dialog control!`);
    }
}

// TODO: in future, different tab types may be supported, but for a single form only only type of tabs should be used
function checkTabSpecCorrectness(
    fields: Array<{type?: string; multiple?: boolean}>,
    propName: string,
    componentName: string,
) {
    const topLevelTabs: typeof fields = fields.filter(isTabbedField);
    const preamble = `Invalid prop '${propName}' passed to '${componentName}'.`;
    if (0 < topLevelTabs.length && topLevelTabs.length < fields.length) {
        return new Error(
            `${preamble} No top level real fields are allowed if there are tab fields on top-level.`,
        );
    }

    const multipleTabCount = topLevelTabs.filter(({multiple}) => multiple).length;
    if (multipleTabCount > 1) {
        return new Error(`${preamble} It is forbidden to have more than one multiple tab fields.`);
    }

    return undefined;
}

function correctFieldsSpec(props: any, propName: string, componentName: string) {
    const basicPropType = {
        [propName]: PropTypes.arrayOf(
            PropTypes.oneOfType([
                Dialog.FIELD_TYPE,
                Dialog.SECTION_TYPE,
                Dialog.SEPARATOR_TYPE,
                Dialog.TAB_TYPE,
            ]),
        ).isRequired,
    };
    const propValue = {[propName]: props[propName]};

    PropTypes.checkPropTypes(basicPropType, propValue, propName, componentName);

    const error = checkTabSpecCorrectness(props[propName], propName, componentName);
    if (error) {
        console.error(
            'Tab specification is wrong, please recheck provided `field` property',
            error,
        );
    }
}

type FieldName = string;

export interface ControlField<
    T extends string = string,
    V = any,
    E = Record<string, any>,
    FormValues = unknown,
> {
    name: string;
    type: T;

    initialValue?: V;

    placeholder?: string;
    extras?: E | ((allValues: FormValues, form: FormApi<any>) => E);
    touched?: boolean;

    visibilityCondition?: {
        when: FieldName;
        isActive: (v: any) => boolean;
    };

    className?: string;
    required?: boolean;
    caption?: string;
    tooltip?: React.ReactNode;
    warning?: React.ReactNode;

    validator?: ValidatorType<V>;
    validateFields?: string[];

    subscribers?: Updates;
    onChange?: (
        value: V,
        oldValue: V,
        field: ControlField<T, V>,
        fullName: string,
        form: FormApi<any>,
        formValues: FormState<any>,
    ) => void;
    error?: () => void;
}

export type TabbedField<FieldT, TabData = any, K extends string = string> = {
    name: string;
    type: K;
    fields: Array<DialogField<FieldT>>;
    size?: string;
    title?: string;
    getTitle?: (data: TabData) => string;
    isRemovable?: (position: number) => boolean;
    renderControls?: (
        data: TabData,
        onCreate: (active?: boolean) => void,
        onRemove: () => void,
    ) => React.ReactNode;
    visibilityCondition?: {
        when: any;
        isActive: (v: any) => boolean;
    };

    subscribers?: undefined;
} & MultipleTabField<TabData>;

export type MultipleTabField<TabData> =
    | {
          multiple?: false;
          onCreateTab?: undefined;
      }
    | {
          multiple: true;
          onCreateTab: (data: TabData, opts: CreateTabOptions) => TabData;
      };

interface CreateTabOptions {
    userOptions: any;
}

type SectionType<FieldT> = {
    section: string;
    fields?: FieldT[] | SeparatorType;
    wrapTo?: (sectionNode: React.ReactNode) => React.ReactNode;

    type?: never;
};

type SeparatorType = {separator: boolean; type?: never; name?: never; subscribers?: never};

type DialogField<FieldT> = FieldT | SectionType<FieldT> | SeparatorType;

type FieldsType<TabT extends TabbedField<FieldT>, FieldT> =
    | Array<TabT>
    | Array<DialogField<FieldT>>;

export interface InfraDialogProps<
    FormValues = Record<string, any>,
    InitialFormValues = Partial<FormValues>,
    TabT extends TabbedField<FieldT> = any,
    FieldT = any,
> {
    className?: string;
    visible: boolean;
    fields: FieldsType<TabT, FieldT>;
    onAdd: (
        form: FormApi<FormValues, InitialFormValues>,
    ) => Promise<ValidationErrors | undefined | void>;
    onClose?: (values: FormValues) => void;
    validate?: (values: FormValues) => ValidationErrors | Promise<ValidationErrors> | undefined;
    onActiveTabChange?: (tab: string) => void;
    size?: 's' | 'm' | 'l';

    // optional, if not provided - the default field initial values will be used
    initialValues?: InitialFormValues;
    modal?: boolean;
    pristineSubmittable?: boolean;
    isApplyDisabled?: (values: FormState<FormValues>) => boolean;
    headerProps?: {
        title?: React.ReactNode;
        insertAfter?: React.ReactNode;
        insertBefore?: React.ReactNode;
    };
    footerProps?: {
        textApply?: string;
        textCancel?: string;
        content?: React.ReactNode;
        propsButtonCancel?: DialogFooterProps['propsButtonCancel'];
        propsButtonApply?: DialogFooterProps['propsButtonApply'];
    };
    waitingMessage?: React.ReactNode;
    virtualized?: boolean;
    formId?: string;
    /**
     * The property allows to pass additional properties which usually are not required
     * but might be useful in some special cases
     * See https://final-form.org/docs/react-final-form/types/FormProps
     */
    formExtras?: Partial<FormProps<FormValues, InitialFormValues>>;
    disableFormReset?: boolean;
}

interface State<FormValues> {
    defaultValues?: FormValues;
    tabsCount: number;
    activeTabId?: string;
    verticalTabs?: boolean | null;
}

type OperateOnTabsCb = (tabInfo: OperateTabInfo) => void;

interface OperateTabInfo {
    id: string;
    error?: string;
    name: string;
    multiple?: boolean;
    index: number;
    title: string;
    isRemovable: (position: number) => boolean;
    renderControls?: TabbedField<any>['renderControls'];
    visibilityCondition?: TabbedField<any>['visibilityCondition'];
}

class Dialog<
    FormValues = Record<string, any>,
    InitialFormValues = Partial<FormValues>,
    TabT extends TabbedField<FieldT> = any,
    FieldT extends ControlField = never,
> extends Component<
    InfraDialogProps<FormValues, InitialFormValues, TabT, FieldT>,
    State<FormValues>
> {
    static FIELD_TYPE = PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        className: PropTypes.string,
        required: PropTypes.bool,
        validator: PropTypes.func,
        caption: PropTypes.string,
        tooltip: PropTypes.node,
        warning: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        placeholder: PropTypes.string,
        visibilityCondition: PropTypes.shape({
            when: PropTypes.string,
            isActive: PropTypes.func,
        }),
        subscribers: PropTypes.object,
        extras: PropTypes.object,
        onChange: PropTypes.func,
        error: PropTypes.func,
        touched: PropTypes.bool,
    });

    static SEPARATOR_TYPE = PropTypes.shape({
        separator: PropTypes.bool.isRequired,
    });

    static SECTION_TYPE = PropTypes.shape({
        section: PropTypes.string.isRequired,
        fields: PropTypes.arrayOf(PropTypes.oneOfType([Dialog.FIELD_TYPE, Dialog.SEPARATOR_TYPE])),
        wrapTo: PropTypes.func,
    });

    static TAB_TYPE = PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(tabControlTypes).isRequired,
        fields: PropTypes.arrayOf(
            PropTypes.oneOfType([Dialog.FIELD_TYPE, Dialog.SECTION_TYPE, Dialog.SEPARATOR_TYPE]),
        ).isRequired,
        multiple: PropTypes.bool,
        onCreateTab: PropTypes.func,
        title: PropTypes.string,
        getTitle: PropTypes.func,
        isRemovable: PropTypes.func,
        renderControls: PropTypes.func,
    });

    static propTypes = {
        // from props
        className: PropTypes.string,
        visible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        onAdd: PropTypes.func.isRequired,
        validate: PropTypes.func,
        onActiveTabChange: PropTypes.func,
        fields: correctFieldsSpec,
        size: PropTypes.string,

        // optional, if not provided - the default field initial values will be used
        initialValues: PropTypes.object,
        modal: PropTypes.bool,
        pristineSubmittable: PropTypes.bool,
        isApplyDisabled: PropTypes.func,
        headerProps: PropTypes.shape({
            title: PropTypes.string,
            insertAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            insertBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        }),
        footerProps: PropTypes.shape({
            textApply: PropTypes.string,
            textCancel: PropTypes.string,
            content: PropTypes.node,
            propsButtonCancel: PropTypes.object,
            propsButtonApply: PropTypes.object,
        }),
        waitingMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        virtualized: PropTypes.bool,
        /**
         * The property allows to pass additional properties which usually are not required
         * but might be useful in some special cases
         * See https://final-form.org/docs/react-final-form/types/FormProps
         */
        formExtras: PropTypes.object,
    };

    static defaultProps = {
        pristineSubmittable: false,
        modal: true,
        size: 'm',
        headerProps: {},
        footerProps: {
            textApply: 'Confirm',
            textCancel: 'Cancel',
        },
        onClose: () => {},
    };

    static FINAL_FORM_SUBSCRIPTIONS = {
        submitting: true,
        pristine: true,
        invalid: true,
        dirtySinceLastSubmit: true,
        hasValidationErrors: true,
        hasSubmitErrors: true,
    };

    /**
     * @param {string} controlId
     * @param {function} controlComponent
     * @param {{
     *     suppressDuplicateWarning: boolean | undefined,
     * } | undefined} opts
     */
    static registerControl<K extends string, V, P extends {value?: any; onChange?: any}>(
        controlId: K,
        controlComponent: React.ComponentType<P> & ControlStaticApi<V>,
        {suppressDuplicateWarning}: {suppressDuplicateWarning?: boolean} = {},
    ) {
        if (controls.has(controlId) && !suppressDuplicateWarning) {
            console.warn(`Control '${controlId}' is already registered as the Dialog control!`);
        }

        if (controlComponent.isTabControl) {
            tabControlTypes.push(controlId);
        }

        controls.set(controlId, controlComponent);
    }

    static registerTabControl<K extends string>(
        controlId: K,
        tabComponent: React.ComponentType<TabFieldProps> & TabControlStaticApi,
        opts?: {suppressDuplicateWarning?: boolean},
    ) {
        Dialog.registerControl(controlId, tabComponent as any, opts);
    }

    static isEmptyField<F extends ControlField, V>(field: F, value: V) {
        const control = getControl<V, any>(field.type);
        const isEmpty = control && control.isEmpty ? control.isEmpty : () => false;
        return isEmpty(value);
    }

    static getDefaultValues<T extends TabbedField<F>, F>(
        fields: FieldsType<T, F> = [],
    ): Record<string, any> {
        return _.reduce(
            fields,
            (acc, item) => {
                const field = item as ArrayElement<typeof fields>;
                if (isSectionField(field)) {
                    if (Array.isArray(field.fields)) {
                        return {...acc, ...Dialog.getDefaultValues(field.fields)};
                    }
                } else if (isTabbedField(field)) {
                    acc[field.name] = Dialog.getDefaultValues(field.fields);
                } else if (isControlField(field)) {
                    acc[field.name] = getControl(field.type).getDefaultValue();
                }
                return acc;
            },
            {} as Record<string, any>,
        );
    }

    static makeRequiredValidator<F extends ControlField, V>(field: F) {
        return (value: V) =>
            Dialog.isEmptyField(field, value) ? i18n('validator:value-required') : undefined;
    }

    static getDerivedStateFromProps<
        TabT extends TabbedField<FieldT>,
        FieldT extends ControlField,
        FormValues,
    >(props: InfraDialogProps<FormValues, unknown, TabT, FieldT>, prevState: State<FormValues>) {
        const res: Partial<typeof prevState> = {};
        const {fields} = props;
        if (!prevState.defaultValues) {
            res.defaultValues = Dialog.getDefaultValues<TabT, FieldT>(fields) as FormValues;
        }

        if (prevState.verticalTabs === undefined) {
            res.verticalTabs = Dialog.getTabsOrientation(fields);
        }

        if (Dialog.hasTabs<TabT, FieldT>(fields)) {
            const {initialValues} = props;
            if (!prevState.activeTabId) {
                res.activeTabId = Dialog.getFirstTabId(fields, initialValues);
            }
        }

        return _.isEmpty(res) ? null : res;
    }

    static hasTabs<TabT extends TabbedField<FieldT>, FieldT extends ControlField>(
        fields: FieldsType<TabT, FieldT>,
    ): fields is Array<TabT> {
        return fields.some(isTabbedField);
    }

    static getFirstTabId<FieldT>(fields: Array<TabbedField<FieldT>>, values: any) {
        const {multiple, name} = fields[0];
        return multiple ? getTabId(values[name][0]) : name;
    }

    static getTabsOrientation<TabT extends TabbedField<FieldT>, FieldT>(
        fields: FieldsType<TabT, FieldT>,
    ) {
        const [field] = fields;
        if (!field || !isTabbedField(field)) {
            return null;
        }
        const control = getControl(field.type);
        const {isTabControl, isTabControlVertical} = control;
        if (isTabControl === undefined) {
            return null;
        }
        return isTabControlVertical;
    }

    static renderField<FieldT extends ControlField, Value = any>(
        field: FieldT,
        input: FieldInputProps<Value>,
        meta: FieldMetaState<Value>,
    ) {
        const {extras} = field;

        if (typeof extras === 'function') {
            return (
                <FormSpy subscription={{values: true}}>
                    {({values, form}) => {
                        const extrasValues = extras(values, form);
                        return (
                            <FieldWithExtras
                                field={field}
                                input={input}
                                meta={meta}
                                extras={extrasValues}
                            />
                        );
                    }}
                </FormSpy>
            );
        }

        return <FieldWithExtras field={field} input={input} meta={meta} extras={extras} />;
    }

    static renderSectionTitle<FieldT>(field: SectionType<FieldT>, index: number) {
        return (
            <h2 className={bDialog('section-title')} key={`title-${index}`}>
                {field.section}
            </h2>
        );
    }

    static renderSeparator(_field: SeparatorType, index: number) {
        return <div className={bDialog('separator')} key={`separator-${index}`} />;
    }

    static renderLabel(
        field: Pick<ControlField, 'name' | 'type' | 'required' | 'caption' | 'tooltip'>,
    ) {
        const {name, type, required, caption, tooltip} = field;

        const renderLabel = controls.get(type) && controls.get(type).renderLabel;
        if (typeof renderLabel === 'function') {
            return renderLabel(field);
        }

        return (
            <label className={bDialog('label')} htmlFor={name}>
                <div className={bDialog('label-text', {required})}>{caption}</div>
                {Boolean(tooltip) && (
                    <div>
                        <Popover
                            content={tooltip}
                            delayOpening={150}
                            delayClosing={150}
                            placement={['bottom', 'top', 'right']}
                        >
                            <Icon iconData={tooltipIcon} />
                        </Popover>
                    </div>
                )}
            </label>
        );
    }

    static operateOnTabs<TabT extends TabbedField<FieldT, TabData>, FieldT, TabData = any>(
        {fields, values, errors}: {fields: Array<TabT>; values: any; errors: ValidationErrors},
        callback: OperateOnTabsCb,
    ) {
        let tabIndex = 0;

        fields.forEach((field) => {
            const {name} = field;
            const {
                type,
                multiple,
                renderControls,
                title = name,
                getTitle,
                isRemovable,
                visibilityCondition,
            } = field;
            if (!isTabControl(type)) {
                throw new Error(`Expected field of type 'tab', got '${type}'`);
            }
            const fieldValues: TabData | Array<TabData> = values[name];
            const fieldErrors = errors && errors[name];

            const args = {multiple, name, renderControls, visibilityCondition};

            if (multiple) {
                (fieldValues as Array<TabData>).forEach((tabValues, index) => {
                    const id = getTabId(tabValues as any);
                    callback({
                        id,
                        error: fieldErrors && fieldErrors[index],
                        index: tabIndex,
                        title:
                            typeof getTitle === 'function' ? getTitle(tabValues) : `${title} ${id}`,
                        isRemovable: typeof isRemovable === 'function' ? isRemovable : () => true,
                        ...args,
                    });
                    tabIndex++;
                });
            } else {
                callback({
                    id: name,
                    error: fieldErrors,
                    index: tabIndex,
                    title:
                        typeof getTitle === 'function' ? getTitle(fieldValues as TabData) : title,
                    isRemovable: () => false,
                    ...args,
                });
                tabIndex++;
            }
        });
    }

    static collectSubscribers<TabT extends TabbedField<FieldT>, FieldT extends ControlField>(
        prefix = '',
        fields: FieldsType<TabT, FieldT>,
        dst: Array<{name: Calculation['field']; subscribers: Calculation['updates']}> = [],
    ) {
        return _.reduce(
            fields,
            (acc, field) => {
                const item = field as ArrayElement<typeof fields>;
                if (isSectionField(item)) {
                    if (Array.isArray(item.fields)) {
                        Dialog.collectSubscribers(prefix, item.fields, acc);
                    }
                } else {
                    const {name, subscribers} = item;
                    const fullName = `${prefix}${name}`;
                    if (subscribers) {
                        acc.push({name: fullName, subscribers});
                    }
                    if (isTabbedField(item)) {
                        Dialog.collectSubscribers(`${fullName}.`, item.fields, acc);
                    }
                }
                return acc;
            },
            dst,
        );
    }

    state: State<FormValues> = {
        tabsCount: 1,
        activeTabId: undefined,
        verticalTabs: undefined,
    };

    form?: FormApi<FormValues, InitialFormValues>;

    componentDidUpdate(_prevProps: unknown, prevState: State<FormValues>) {
        if (prevState.tabsCount !== this.state.tabsCount) {
            setTimeout(() => document.querySelector('.yc-dialog__modal')?.scrollTo(0, 0), 0); // setTimeout for safari
        }
    }

    onClose = (_event?: unknown, reason?: ModalCloseReason | 'closeButtonClick') => {
        if (reason === 'outsideClick') {
            return;
        }

        const {onClose = Dialog.defaultProps.onClose, disableFormReset} = this.props;
        onClose(this.form!.getState().values);
        if (!disableFormReset) {
            window.setTimeout(() => {
                this.setState({activeTabId: undefined});
                this.form!.reset();
            }, 0);
        }
    };

    _isApplyDisabled(formState: FormState<FormValues, InitialFormValues>) {
        const {pristineSubmittable} = this.props;
        const {pristine, invalid, hasSubmitErrors, dirtySinceLastSubmit, hasValidationErrors} =
            formState;
        if (invalid) {
            return hasValidationErrors || (hasSubmitErrors && !dirtySinceLastSubmit);
        }
        return pristineSubmittable ? false : pristine;
    }

    isApplyDisabled(formState: FormState<FormValues, InitialFormValues>) {
        const {isApplyDisabled} = this.props;
        if (typeof isApplyDisabled === 'function') {
            return isApplyDisabled(formState);
        } else {
            return this._isApplyDisabled(formState);
        }
    }

    onApply = () => {
        const {onAdd} = this.props;

        return onAdd(this.form!)
            .then((response) => {
                const validationErrors = response && response.validationErrors;
                if (validationErrors) {
                    return validationErrors;
                }
                this.onClose();
                return null;
            })
            .catch((error) => console.error(error));
    };

    renderFieldGroup(field: FieldT, fieldPrefix = '') {
        const {name, type, className, warning} = field;
        const fieldName = fieldPrefix ? `${fieldPrefix}.${name}` : name;

        const {required, validator, validateFields = [], initialValue, onChange} = field;
        const validators = [];

        if (required) {
            validators.push(Dialog.makeRequiredValidator(field));
        }
        if (typeof validator === 'function') {
            validators.push(validator);
        }

        const {format, validate: customValidate, isEqual} = getControl(field.type);
        if (customValidate) {
            validators.push(customValidate);
        }

        const validate = composeValidators(...validators);

        return (
            <Field
                key={fieldName}
                name={fieldName}
                initialValue={initialValue}
                validate={validate}
                validateFields={validateFields}
                isEqual={isEqual}
                format={format}
                formatOnBlur
            >
                {({input, meta}) => (
                    <div className={bDialog('field-group', {type}, className)}>
                        {Dialog.renderLabel(field)}
                        <div
                            className={bDialog('field-wrapper', {
                                type,
                                empty: Dialog.isEmptyField(field, input.value),
                            })}
                        >
                            {Dialog.renderField(field, input, meta)}
                            {warning && (
                                <div className={bDialog('field-warning')}>
                                    <Icon iconData={warningIcon} />
                                    <span className={bDialog('field-warning-content')}>
                                        {warning}
                                    </span>
                                </div>
                            )}
                        </div>
                        {typeof onChange === 'function' && (
                            <OnChange name={fieldName}>
                                {(value: unknown, oldValue: unknown) => {
                                    if (value !== oldValue) {
                                        onChange(
                                            value,
                                            oldValue,
                                            field,
                                            fieldName,
                                            this.form! as any,
                                            this.form!.getState(),
                                        );
                                    }
                                }}
                            </OnChange>
                        )}
                    </div>
                )}
            </Field>
        );
    }

    renderSection(field: SectionType<FieldT>, index: number, fieldPrefix?: string) {
        let sectionNode: React.ReactNode;
        if (!Array.isArray(field.fields) || field.fields.length === 0) {
            sectionNode = Dialog.renderSectionTitle(field, index);
        } else {
            sectionNode = (
                <section className={bDialog('section')} key={`section-field-${index}`}>
                    {Dialog.renderSectionTitle(field, index)}
                    {this.renderFields(field.fields, fieldPrefix)}
                </section>
            );
        }

        if (typeof field.wrapTo === 'function') {
            return field.wrapTo(sectionNode);
        }

        return sectionNode;
    }

    renderFields(fields: Array<DialogField<FieldT>>, fieldPrefix?: string) {
        return fields.map((field, index) => {
            if (isSectionField(field)) {
                return this.renderSection(field, index, fieldPrefix);
            } else if (isSeparatorField(field)) {
                return Dialog.renderSeparator(field, index);
            } else {
                const {visibilityCondition} = field;
                if (visibilityCondition) {
                    return (
                        <Condition key={`cond-${index}`} {...visibilityCondition}>
                            {this.renderFieldGroup(field, fieldPrefix)}
                        </Condition>
                    );
                }

                return this.renderFieldGroup(field, fieldPrefix);
            }
        });
    }

    renderFormError() {
        const {[FORM_ERROR]: formError} = this.form!.getState().submitErrors || {};
        if (!formError) {
            return null;
        }
        return <div className={bDialog('error-message')}>{formError}</div>;
    }

    isActiveTab = (tabValues: TabT) => getTabId(tabValues as any) === this.state.activeTabId;

    renderMultiTabContent(tab: TabT) {
        const {virtualized} = this.props;
        const {name, fields, renderControls} = tab;

        return (
            <FieldArray key={name} name={name}>
                {({fields: tabs}) => {
                    return tabs.map((fieldPrefix, index) => {
                        const tabValues = tabs.value[index];
                        const isActive = this.isActiveTab(tabValues);

                        const onCreate = (active?: boolean) => {
                            const formState = this.form!.getState();
                            const {createTab} = this.prepareTabs(this.form!, formState);
                            createTab(name, active);
                        };

                        const onRemove = () => {
                            const formState = this.form!.getState();
                            const {removeTab} = this.prepareTabs(this.form!, formState);
                            removeTab({...tabValues, name});
                        };

                        return (
                            (isActive || !virtualized) && (
                                <div
                                    key={index}
                                    className={bDialog('tabs-content-item', {
                                        hidden: !isActive,
                                        name,
                                    })}
                                >
                                    {this.renderFields(fields, fieldPrefix)}
                                    {this.renderFormError()}
                                    {renderControls && (
                                        <div className={bDialog('extra-controls')}>
                                            {renderControls(tabValues, onCreate, onRemove)}
                                        </div>
                                    )}
                                </div>
                            )
                        );
                    });
                }}
            </FieldArray>
        );
    }

    renderSingleTabContent(tab: TabT) {
        const {virtualized} = this.props;
        const {activeTabId} = this.state;
        const {name, fields} = tab;
        const isActive = name === activeTabId;

        return (
            (isActive || !virtualized) && (
                <div
                    key={`single-tab-${name}`}
                    className={bDialog('tabs-content-item', {hidden: !isActive, name})}
                >
                    {this.renderFields(fields, name)}
                    {this.renderFormError()}
                </div>
            )
        );
    }

    onActiveTabChange = (tab: string) => {
        const {onActiveTabChange} = this.props;
        this.setState({activeTabId: tab});
        if (typeof onActiveTabChange === 'function') {
            onActiveTabChange(tab);
        }
    };

    isVisibleTab(tabAttributes: OperateTabInfo, values: FormValues) {
        const {visibilityCondition} = tabAttributes;
        if (!visibilityCondition) {
            return true;
        }
        const value = _.get(values, visibilityCondition.when);
        return visibilityCondition.isActive(value);
    }

    prepareTabs(
        form: FormApi<FormValues, InitialFormValues>,
        formState: FormState<FormValues, InitialFormValues>,
    ) {
        const {remove, push} = form.mutators;
        const {activeTabId} = this.state;
        const {fields: propFields} = this.props;
        const {values: stateValues, errors} = formState;
        const tabItems: Array<TabItem> = [];
        let firstMultiTabIndex = 0;

        const values = stateValues as any;
        const fields = propFields as Array<TabT>;

        const createTab = (
            fieldName: string,
            active?: boolean,
            options: {userOptions?: any} = {},
        ) => {
            const tabSpec = _.find(fields, (fieldSpec) => fieldSpec.name === fieldName);
            const {onCreateTab} = tabSpec || {};
            if (!tabSpec?.multiple) {
                return;
            } else if (typeof onCreateTab !== 'function') {
                throw new Error(
                    `Tab spec '${fieldName}' has multiple keyword, but no onCreateTab provided!`,
                );
            }

            const {userOptions} = options;

            const index = _.findIndex(values[fieldName], this.isActiveTab);
            const newTabData = onCreateTab(values[fieldName][index], {userOptions});
            checkTabId(newTabData, values[fieldName]);
            push(fieldName, newTabData);
            this.setState({tabsCount: tabItems.length + 1});
            if (active) {
                this.onActiveTabChange(getTabId(newTabData));
            }
        };

        const removeTab = (tabItemToDelete: TabItem) => {
            const tabIndexToDelete = _.findIndex(
                tabItems,
                (item) => item.id === tabItemToDelete.id,
            );
            if (tabIndexToDelete < 0) {
                return;
            }

            if (tabItemToDelete.id === activeTabId) {
                const tabIdToSwitch = tabItems[tabIndexToDelete - 1].id;
                this.setState({activeTabId: tabIdToSwitch});
            }
            remove(tabItemToDelete.name, tabIndexToDelete - firstMultiTabIndex);
            this.setState({tabsCount: tabItems.length - 1});
        };

        let seenMultiTab = false;
        let updateActiveTab = false;
        Dialog.operateOnTabs({fields, values, errors}, (tabAttributes) => {
            const {id, error, name, multiple, index, renderControls, title, isRemovable} =
                tabAttributes;

            if (!this.isVisibleTab(tabAttributes, stateValues)) {
                updateActiveTab = updateActiveTab || activeTabId === id;
                return;
            }

            tabItems.push({
                id,
                error,
                name,
                multiple,
                ...{renderControls},
                title,
                removable: isRemovable(index - firstMultiTabIndex),
            });
            if (multiple && !seenMultiTab) {
                seenMultiTab = true;
                firstMultiTabIndex = index;
            }
        });

        if (updateActiveTab) {
            this.setState({activeTabId: tabItems[0]?.id});
        }

        return {tabItems, createTab, removeTab};
    }

    renderTabs = ({
        form,
        ...formState
    }: {form: FormApi<FormValues, InitialFormValues>} & FormState<
        FormValues,
        InitialFormValues
    >) => {
        const {activeTabId, verticalTabs} = this.state;
        const {size, fields} = this.props;
        const {tabItems, removeTab, createTab} = this.prepareTabs(form, formState);

        const tabbedFields = fields as Array<TabT>;

        const TabComponent = getControl<unknown, TabFieldProps>(tabbedFields[0]?.type);
        return (
            <TabComponent
                className={bDialog('tabs-control', {vertical: Boolean(verticalTabs)})}
                size={size}
                tabItems={tabItems}
                activeTab={activeTabId}
                setActiveTab={this.onActiveTabChange}
                onRemoveTab={removeTab}
                onCreateTab={createTab}
            />
        );
    };

    renderTabbedFields() {
        const {fields} = this.props;
        const {verticalTabs} = this.state;

        const tabbedFields = fields as Array<TabT>;

        return (
            <Fragment>
                <FormSpy render={this.renderTabs} subscription={{values: true, errors: true}} />
                <div className={bDialog('tabs-content', {with_vertical_tabs: verticalTabs as any})}>
                    {tabbedFields.map((tab) =>
                        tab.multiple
                            ? this.renderMultiTabContent(tab)
                            : this.renderSingleTabContent(tab),
                    )}
                </div>
            </Fragment>
        );
    }

    get hasTabs() {
        return Dialog.hasTabs(this.props.fields);
    }

    renderDialogContent = (
        handleSubmit: () => void,
        form: FormApi<FormValues, InitialFormValues>,
    ) => {
        this.form = form;
        const {waitingMessage, headerProps, footerProps, fields, formId} = this.props;
        const {verticalTabs} = this.state;
        const {title, insertAfter, insertBefore} = headerProps || {};
        const {textApply: textApplyDefault, textCancel: textCancelDefault} =
            Dialog.defaultProps.footerProps;
        const {
            textApply = textApplyDefault,
            textCancel = textCancelDefault,
            content,
            propsButtonCancel = {},
            propsButtonApply = {},
        } = footerProps || {};
        const formState = form.getState();
        const disabled = this.isApplyDisabled(formState);

        return (
            <Fragment>
                {title && (
                    <CommonDialog.Header
                        caption={<span className={bDialog('caption')}>{title}</span>}
                        insertAfter={insertAfter}
                        insertBefore={insertBefore}
                    />
                )}
                <form id={formId} onSubmit={handleSubmit}>
                    <CommonDialog.Body
                        className={bDialog('body', {with_vertical_tabs: Boolean(verticalTabs)})}
                    >
                        <div className={bDialog({with_vertical_tabs: Boolean(verticalTabs)})}>
                            {isArrayOfTabs(fields) ? (
                                this.renderTabbedFields()
                            ) : (
                                <React.Fragment>
                                    {this.renderFields(fields as Array<DialogField<FieldT>>)}
                                    {this.renderFormError()}
                                </React.Fragment>
                            )}
                        </div>
                    </CommonDialog.Body>
                    <CommonDialog.Footer
                        preset="default"
                        loading={formState.submitting}
                        textButtonCancel={textCancel}
                        textButtonApply={textApply}
                        propsButtonApply={{disabled, type: 'submit', ...propsButtonApply}}
                        propsButtonCancel={propsButtonCancel}
                        onClickButtonCancel={this.onClose}
                        onClickButtonApply={noop}
                    >
                        <div className={bDialog('footer-controls')}>{content}</div>
                    </CommonDialog.Footer>
                </form>
                {waitingMessage && (
                    <div className={bDialog('waiting-message')}>
                        <div className={bDialog('waiting-message-inner')}>
                            <Icon iconData={infoIcon} />
                            {waitingMessage}
                        </div>
                    </div>
                )}
            </Fragment>
        );
    };

    renderPageDialog = ({
        handleSubmit,
        form,
    }: {
        handleSubmit: () => void;
        form: FormApi<FormValues, InitialFormValues>;
    }): React.ReactNode => {
        const {className} = this.props;
        return (
            <div className={bPage('wrapper', className)}>
                <div className={bPage()}>{this.renderDialogContent(handleSubmit, form)}</div>
            </div>
        );
    };

    renderModalDialog = ({
        handleSubmit,
        form,
    }: {
        handleSubmit: () => void;
        form: FormApi<FormValues, InitialFormValues>;
    }): React.ReactNode => {
        const {visible, className, size} = this.props;

        return (
            visible && (
                <CommonDialog
                    className={className}
                    open
                    hasCloseButton
                    size={size}
                    onClose={this.onClose}
                >
                    {this.renderDialogContent(handleSubmit, form)}
                </CommonDialog>
            )
        );
    };

    getFieldsCalculator = () => {
        const calculator = Dialog.collectSubscribers('', this.props.fields).map(
            ({name, subscribers}) => ({
                field: name,
                updates: subscribers,
            }),
        );

        if (!calculator.length) {
            return undefined;
        }

        return createDecorator(...calculator) as Decorator<any, any>;
    };

    render() {
        const {initialValues, modal, formExtras, validate} = this.props;
        const {defaultValues} = this.state;
        const calculator = this.getFieldsCalculator();
        const decorators: undefined | Array<Decorator<FormValues, InitialFormValues>> = calculator
            ? [calculator]
            : undefined;

        let values;
        if (initialValues) {
            // simple form initialized with values
            values = Object.assign({}, defaultValues, initialValues);
        } else {
            // simple form with default field values
            values = defaultValues;
        }

        const renderDialog = modal ? this.renderModalDialog : this.renderPageDialog;

        const {initialValuesEqual, ...restExtras} = formExtras || {};
        // For Dialogs with tabs it is recommended to use deepEqual method
        // instead of shallowEqual method
        const equalMethod =
            initialValuesEqual === undefined && this.hasTabs ? _.isEqual : initialValuesEqual;
        return (
            <Form
                {...restExtras}
                onSubmit={this.onApply}
                validate={validate}
                subscription={Dialog.FINAL_FORM_SUBSCRIPTIONS}
                mutators={
                    (this.hasTabs
                        ? {...restExtras.mutators, ...arrayMutators}
                        : restExtras.mutators) as any
                }
                initialValues={values as any}
                decorators={decorators}
                render={renderDialog as any}
                // For Dialogs with tabs it is strongly recommended to use keepDirtyOnReinitialize, without
                //  it user's input might be lost between tab's switching.
                initialValuesEqual={equalMethod}
                keepDirtyOnReinitialize={this.hasTabs}
            />
        );
    }
}

Dialog.registerTabControl('tab', TabField);
Dialog.registerTabControl('tab-vertical', TabFieldVertical);

export type RegisteredInfraDialogTabField<
    Key extends string,
    P extends TabFieldProps,
    FieldT,
> = TabbedField<FieldT, any, Key> &
    Omit<P, keyof TabbedField<unknown> | 'setActiveTab' | 'tabItems'>;

export type InfraDialogTabField<FieldT> =
    | RegisteredInfraDialogTabField<'tab', TabFieldProps, FieldT>
    | RegisteredInfraDialogTabField<'tab-vertical', TabFieldVerticalProps, FieldT>;

Dialog.registerControl('text', TextControl);
Dialog.registerControl('textarea', TextAreaControl);
Dialog.registerControl('select', SelectControl);
Dialog.registerControl('tumbler', TumblerControl);
Dialog.registerControl('block', CustomBlock);
Dialog.registerControl('plain', PlainText);
Dialog.registerControl('checkbox', CheckBoxControl);
Dialog.registerControl('radio', RadioButtonControl);
Dialog.registerControl('until-date', UntilDateControl);
Dialog.registerControl('editable-list', EditableList);
Dialog.registerControl('multi-editable-lists', EditableManyLists);
Dialog.registerControl('multi-text', MultiTextControl);

export const DeprecatedDialog = Dialog;

export type RegisteredInfraDialogField<
    Key extends string,
    P extends {value?: any},
    FormValues,
> = ControlField<Key, P['value'], DistributiveOmit<P, keyof ControlProps<any>>, FormValues>;

export type InfraDialogField<FormValues = any, AdditionalControlFields = never> =
    | SectionType<InfraDialogControlField<FormValues> | AdditionalControlFields | SeparatorType>
    | SeparatorType
    | InfraDialogControlField<FormValues>
    | AdditionalControlFields;

type InfraDialogControlField<FormValues = any> =
    | RegisteredInfraDialogField<'text', TextControlProps, FormValues>
    | RegisteredInfraDialogField<'textarea', TextAreaControlProps, FormValues>
    | RegisteredInfraDialogField<'select', SelectControlProps, FormValues>
    | RegisteredInfraDialogField<'tumbler', TumblerControlProps, FormValues>
    | RegisteredInfraDialogField<'block', CustomBlockProps, FormValues>
    | RegisteredInfraDialogField<'plain', PlainTextProps, FormValues>
    | RegisteredInfraDialogField<'checkbox', CheckBoxControlProps, FormValues>
    | RegisteredInfraDialogField<'radio', RadioButtonControlProps, FormValues>
    | RegisteredInfraDialogField<'until-date', UntilDateControlProps, FormValues>
    | RegisteredInfraDialogField<'editable-list', EditableListProps<any>, FormValues>
    | RegisteredInfraDialogField<'multi-editable-lists', EditableManyListsProps<any>, FormValues>
    | RegisteredInfraDialogField<'multi-text', MultiTextControlProps, FormValues>;

export function InfraDialog<FormValues, InitialValuesType = Partial<FormValues>>(
    props: InfraDialogProps<
        FormValues,
        InitialValuesType,
        InfraDialogTabField<InfraDialogField<FormValues>>,
        InfraDialogField<FormValues>
    >,
) {
    return <Dialog {...(props as any)} />;
}

InfraDialog.FORM_ERROR = FORM_ERROR;

export const registerDialogControl = Dialog.registerControl;
export const registerDialogTabControl = Dialog.registerTabControl;

interface FieldWithExtrasProps<FieldT extends ControlField, Value = any> {
    field: FieldT;
    input: FieldInputProps<Value>;
    meta: FieldMetaState<Value>;
    extras: any;
}
function FieldWithExtras<FieldT extends ControlField, Value = any>({
    field,
    extras = {},
    meta,
    input,
}: FieldWithExtrasProps<FieldT, Value>) {
    const {type, name, placeholder, touched} = field;

    let error;
    if (meta.error && (touched || meta.touched || meta.dirty)) {
        error = meta.error;
    } else if (meta.submitError && !meta.dirtySinceLastSubmit && !meta.submitting) {
        error = meta.submitError;
    }

    const {onFocus: onFocusExternal, onBlur: onBlurExternal} = extras;
    const {onFocus: onFocusField, onBlur: onBlurField} = input;

    const onFocus = useStableEventHandler(applyFunctions(onFocusExternal, onFocusField));
    const onBlur = useStableEventHandler(applyFunctions(onBlurExternal, onBlurField));

    const controlProps: any = {
        id: name,
        placeholder,
        ...extras,
        ...input,
        onFocus,
        onBlur,
    };

    const Control = getControl(type);
    if (Control.hasErrorRenderer) {
        controlProps.error = error;
        error = null;
    }

    return (
        <React.Fragment>
            {React.createElement(Control, {...controlProps})}
            {error && <div className={bDialog('field-error')}>{error}</div>}
        </React.Fragment>
    );
}
