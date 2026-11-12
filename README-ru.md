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
вручную.

Вертикальные вкладки используют точки входа для сортировки и виртуализации, а Select
виртуализирует списки из 50 и более опций. Оберните приложение в `Provider` из UIKit
и подключите `@gravity-ui/uikit/styles/styles.css`.

## Миграция на UIKit 8

Замените корневые `ThemeProvider` и `MobileProvider` приложения на `Provider`.
Перенесите их пропсы в `Provider`, кроме удалённого `__experimentalMobileModals`:

```diff
-import {ThemeProvider, MobileProvider} from '@gravity-ui/uikit';
+import {Provider} from '@gravity-ui/uikit';

-<ThemeProvider theme="light">
-  <MobileProvider>
-    <App />
-  </MobileProvider>
-</ThemeProvider>
+<Provider theme="light">
+  <App />
+</Provider>
```

Если приложение уже использует `Provider`, дополнительная обёртка вокруг `DFDialog`
не нужна. У `DFDialog` сохранены пропсы `visible`, `size` и `onClose`: переход UIKit
на `Dialog.open`, `maxWidth` и `onOpenChange` выполнен внутри библиотеки.

Проверьте собственные стили и скриншотные эталоны:

- Изменились отступы заголовка, содержимого и футера как модальных, так и встроенных форм.
- Кнопки футера на десктопе теперь имеют ширину по содержимому вместо минимальных 128px.
  Чтобы вернуть прежнюю ширину, передайте `{width: 'max', className: 'form-action'}`
  через `footerProps.propsButtonApply` и `footerProps.propsButtonCancel`, а в стилях задайте
  `.form-action { min-width: 128px; }`.
- У checkbox размера `l` шрифт подписи уменьшился с 15 до 13px, а индикатор увеличился
  с 17 до 18px. Оттенки темы также немного изменились.
- Вертикальные вкладки используют новый `List` без Legacy-компонентов. Собственные
  селекторы для прежней разметки `.g-list__item` нужно пересмотреть.
  Колбэк `onOrderChanged({oldIndex, newIndex})` сохранён.

Для собственных контролов и пропсов UIKit, передаваемых через описания полей, используйте
[гайд миграции UIKit](https://github.com/gravity-ui/uikit/blob/main/docs/migration-to-v8-ru.md).
В частности, `Select` больше не принимает `virtualizationThreshold`: встроенный контрол
`select` использует `ListVirtualizer` с порогом в 50 опций.

## Использование

Пример включает провайдер приложения. Если на корне приложения уже есть `Provider`,
добавлять показанную здесь обёртку повторно не нужно.

```tsx
import {DFDialog} from '@gravity-ui/dialog-fields';
import {Provider} from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/styles.css';

interface FormValues {
  firstName: string;
  lastName: string;
}

function MyForm() {
  return (
    <Provider theme="light">
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
    </Provider>
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
