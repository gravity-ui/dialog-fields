## Short description

The purpose of `DFDialog` component is to ease of creating of forms, it is used react-final-form internally.
It supports several predefined types of fields but user can extend it by registering new ones by using `registerDialogControl`.

### Controls

- [Base controls](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-00-base-controls)
  - `plain` - static text
  - `text` - editable text
  - `multi-text` - user defined array of string
  - `checkbox` - checkbox
  - `tumbler` - tumbler
  - `radio` - radio button
  - `editable-list` - list of removable strings
  - `multi-editable-list` - multi list of removable strings
  - `text area` - text area
  - `select` - select
  - `block` - allows to add ReactNode
- [Custom control registration](https://preview.yandexcloud.dev/dialog-fields/?path=/story/tutorials-custom-control-registration)

### Features

- Inplace and modal view
- [One tab](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-01-one-tab) and [several tab forms](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-02-several-tab--horizontal-tabs)
- [Vertical/Horizontal tabs](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-02-several-tab)
- [Hidden fields and tabs](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-04-visibility-condition)
- [Linked fields by values](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-05-extras-and-linked-fields)
- [Field-level validation](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-06-field-validators)
- [Form-level validation](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-07-form-validation)
- [Virtualized tabs](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-08-virtualized-tabs)
- [Cloneable tabs](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-08-cloneable-tabs-)
- [Groupped fields](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-03-sections)

## Install

```
$ npm install @gravity-ui/dialog-fields
```

Also you have to install all required peer-dependencies

```
$ npm install -D  @gravity-ui/uikit@^5 @bem-react/classname@1.6 react@^17
```

## Usage

```ts
import {DFDialog, FormApi} from '@gravity-ui/dialog-fields';

interface FormValues {
  firstName: string;
  lastName: string;
}

function MyForm() {
  return (
    <DFDialog<FormValues>
      visible={true}
      headerProps={{
        title: 'My form',
      }}
      onAdd={(form) => {
        console.log(form.getState().values);
        return Promise.resolve();
      }}
      fields={[
        {name: 'firstName', type: 'text', caption: 'First name'},
        {name: 'lastName', type: 'text', caption: 'LastName'},
      ]}
    />
  );
}
```

See more examples in [storybook](https://preview.yandexcloud.dev/dialog-fields).
