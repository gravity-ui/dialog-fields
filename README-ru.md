## Краткое описание

Компонент `DFDialog` предназначен для упрощения создания форм и использует библиотеку `react-final-form`.
Он поддерживает несколько предустановленных типов полей, список которых можно расширить, зарегистрировав новые с помощью `registerDialogControl`.

### Контролы

- [Базовые контролы](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-00-base-controls):
  - `plain` — статический текст;
  - `text` — редактируемый текст;
  - `multi-text` — пользовательский массив строк;
  - `checkbox` — чекбокс;
  - `tumbler` — переключатель;
  - `radio` — радиокнопка;
  - `editable-list` — список с возможностью удаления строк;
  - `multi-editable-list` — многоуровневый список с возможностью удаления строк;
  - `text area` — текстовая область;
  - `select` — селект (выпадающий элемент);
  - `block` — позволяет добавить `ReactNode`.
- [Пользовательские контролы](https://preview.yandexcloud.dev/dialog-fields/?path=/story/tutorials-custom-control-registration).

### Функциональные возможности

- Встроенный и модальный вид.
- Формы с [одной вкладкой](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-01-one-tab) и [несколькими вкладками](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-02-several-tab--horizontal-tabs).
- [Вертикальные и горизонтальные вкладки](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-02-several-tab).
- [Скрытые поля и вкладки](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-04-visibility-condition).
- [Связь полей по значениям](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-05-extras-and-linked-fields).
- [Валидация на уровне полей](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-06-field-validators).
- [Валидация на уровне формы](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-07-form-validation).
- [Виртуализация вкладок](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-08-virtualized-tabs).
- [Клонирование вкладок](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-08-cloneable-tabs-).
- [Группировка полей](https://preview.yandexcloud.dev/dialog-fields/?path=/story/demo-03-sections).

## Установка

```
npm install @gravity-ui/dialog-fields
```

В зависимости от пакетного менеджера может потребоваться установить `peerDependencies`
вручную. Эта версия требует UIKit 8 и React 18:

```
npm install @gravity-ui/uikit@^8 @hello-pangea/dnd@^18 @tanstack/react-virtual@^3 react@^18 react-dom@^18
```

Вертикальные вкладки используют точки входа для сортировки и виртуализации, а Select
виртуализирует списки из 50 и более опций. Оберните приложение в `Provider` из UIKit
и подключите `@gravity-ui/uikit/styles/styles.css`.

## Использование

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
        {
          name: 'firstName',
          type: 'text',
          caption: 'First name',
          tooltip: 'Description for first name field',
        },
        {
          name: 'lastName',
          type: 'text',
          caption: 'LastName',
          tooltip: 'Description for last name field',
        },
      ]}
    />
  );
}
```

### Условная видимость

Поля и вкладки поддерживают `visibilityCondition`. Если `when` — строка,
`isActive` получает значение одного поля:

```ts
visibilityCondition: {
  when: 'register',
  isActive: (value) => Boolean(value),
}
```

Для зависимости от нескольких полей передайте массив имён. `isActive` получит
значения отдельными аргументами в том же порядке, что и имена в `when`:

```ts
visibilityCondition: {
  when: ['multiConsumer', 'register'],
  isActive: (multiConsumer, register) => Boolean(multiConsumer && register),
}
```

Имена задаются путями от корня формы, включая префиксы вкладок, например
`general.register`. Видимость пересчитывается при изменении любого указанного поля.
Скрытое по условию поле размонтируется, а не просто скрывается визуально.

C дополнительными примерами можно ознакомиться в [Storybook](https://preview.yandexcloud.dev/dialog-fields).
