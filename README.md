## Short description

The purpose of `DFDialog` component is to ease of creating of forms, it is used react-final-form internally.
It supports several predefined types of fields but user can extend it by registering new ones by using `registerDialogControl`.

### Features

- One tab and several tab forms
- Vertical/Horizontal tabs
- Hiding fields and tabs
- Linked fields
- Field-level validation
- Form-level validation
- Cloneable tabs
- Virtualized tabs

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
