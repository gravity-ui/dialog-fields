# Changelog

## [5.0.3](https://github.com/gravity-ui/dialog-fields/compare/v5.0.2...v5.0.3) (2024-03-06)


### Bug Fixes

* minor fix for release.yaml ([63d962f](https://github.com/gravity-ui/dialog-fields/commit/63d962fbb065932cdccc1a3af2386425aed97165))

## [5.0.2](https://github.com/gravity-ui/dialog-fields/compare/v5.0.1...v5.0.2) (2024-03-06)


### Bug Fixes

* minor fix for README ([4af0080](https://github.com/gravity-ui/dialog-fields/commit/4af008092b578d733342a00defcdd6d35abf4ff9))

## [5.0.1](https://github.com/gravity-ui/dialog-fields/compare/v5.0.0...v5.0.1) (2024-03-06)


### Bug Fixes

* better question-icon position ([258f9d7](https://github.com/gravity-ui/dialog-fields/commit/258f9d7c3a26211ce96735b116e91dffbd247a6f))

## [5.0.0](https://github.com/gravity-ui/dialog-fields/compare/v4.3.1...v5.0.0) (2024-03-04)


### ⚠ BREAKING CHANGES

* update @gravity-ui/uikit v6

### Features

* update @gravity-ui/uikit v6 ([82689df](https://github.com/gravity-ui/dialog-fields/commit/82689df204f3df6ac40899f6f4463c66caefd961))

## [4.3.1](https://github.com/gravity-ui/dialog-fields/compare/v4.3.0...v4.3.1) (2024-02-29)


### Bug Fixes

* better tab errors detection ([737fc89](https://github.com/gravity-ui/dialog-fields/commit/737fc897d3469ec2735a98eec5eb3f18fad857e7))

## [4.3.0](https://github.com/gravity-ui/dialog-fields/compare/v4.2.0...v4.3.0) (2023-12-22)


### Features

* **PlainText:** add PlainText.props.placeholder property ([9cc5dfb](https://github.com/gravity-ui/dialog-fields/commit/9cc5dfb3b62b1df8a66556529ab21467fdf2622f))


### Bug Fixes

* **PlainText:** add padding-top ([8cb7525](https://github.com/gravity-ui/dialog-fields/commit/8cb75256d1747a92051406348098473a2afee2c5))

## [4.2.0](https://github.com/gravity-ui/dialog-fields/compare/v4.1.0...v4.2.0) (2023-11-28)


### Features

* **DFDialog:** add DFDialog.props.footerProps.hidden field ([325cb3d](https://github.com/gravity-ui/dialog-fields/commit/325cb3ddc0b8f55fe1f9600e632321921287e50a))

## [4.1.0](https://github.com/gravity-ui/dialog-fields/compare/v4.0.0...v4.1.0) (2023-11-27)


### Features

* add '_dirty' modifier for '.df-dialog__field-group' ([f805d4e](https://github.com/gravity-ui/dialog-fields/commit/f805d4eabe4d5c96d7061e565e4903502d15580f))

## [4.0.0](https://github.com/gravity-ui/dialog-fields/compare/v3.1.0...v4.0.0) (2023-11-27)

### ⚠ BREAKING CHANGES

- rework ControlField.extras ([9826b75](https://github.com/gravity-ui/dialog-fields/commit/9826b758ccc166bee88aff934f5edd37fd1056e8))
  - definition of function `extras(formValues, form)` is changed to `extras(formValues, {form, field, input})`

### Features

- add Select control ([4b33ffd](https://github.com/gravity-ui/dialog-fields/commit/4b33ffd6fadbf309794a484057490defc21764ef))
- rework ControlField.extras ([9826b75](https://github.com/gravity-ui/dialog-fields/commit/9826b758ccc166bee88aff934f5edd37fd1056e8))

## [3.1.0](https://github.com/gravity-ui/dialog-fields/compare/v3.0.2...v3.1.0) (2023-11-01)

### Features

- make section collapsible ([4ebff66](https://github.com/gravity-ui/dialog-fields/commit/4ebff660534769b8e06947578a64d8c7f570f6b1))

### Bug Fixes

- **block:** block-element should be full-width with vertical tabs ([0496529](https://github.com/gravity-ui/dialog-fields/commit/0496529f697f9e5982beec6ff8650c3aa617a1f2))

## [3.0.2](https://github.com/gravity-ui/dialog-fields/compare/v3.0.1...v3.0.2) (2023-10-04)

### Bug Fixes

- minor style fix for 'textarea' ([71fb737](https://github.com/gravity-ui/dialog-fields/commit/71fb73712c07ece1afd73203ef8b9bea7afab1dc))

## [3.0.1](https://github.com/gravity-ui/dialog-fields/compare/v3.0.0...v3.0.1) (2023-10-04)

### Bug Fixes

- **buid:** babel config should be used for storybook only ([663329e](https://github.com/gravity-ui/dialog-fields/commit/663329eb67c976ca556b9ec7ce546900b4e1ec19))

## [3.0.0](https://github.com/gravity-ui/dialog-fields/compare/v2.0.1...v3.0.0) (2023-09-02)

### ⚠ BREAKING CHANGES

- rename `.page-dialog` classname to `.df-page-dialog`

### chore

- migrate to `@bem-react/classname` ([8e4f3d0](https://github.com/gravity-ui/dialog-fields/commit/8e4f3d01b86fa19011a70a60a21e01251d7a5a27))

## [2.0.1](https://github.com/gravity-ui/dialog-fields/compare/v2.0.0...v2.0.1) (2023-08-17)

### Bug Fixes

- better peerDependencies ([8f9fcba](https://github.com/gravity-ui/dialog-fields/commit/8f9fcba1600580806025cd89228606f40f91c5a4))

## [2.0.0](https://github.com/gravity-ui/dialog-fields/compare/v1.1.1...v2.0.0) (2023-07-25)

### ⚠ BREAKING CHANGES

- use @gravity-ui/uikit v5

### chore

- use @gravity-ui/uikit v5 ([0a4e8da](https://github.com/gravity-ui/dialog-fields/commit/0a4e8da1a4d5536a72a149bbe9f143ed36384873))

## [1.1.1](https://github.com/gravity-ui/dialog-fields/compare/v1.1.0...v1.1.1) (2023-03-21)

### Bug Fixes

- vertical tabs should correctly display controls with fullWidth ([675fbd5](https://github.com/gravity-ui/dialog-fields/commit/675fbd5b2aeaf069db9ca99364bd50ecb56b21ac))

## [1.1.0](https://github.com/gravity-ui/dialog-fields/compare/v1.0.1...v1.1.0) (2023-03-21)

### Features

- add ControlField.fullWidth property ([91dd461](https://github.com/gravity-ui/dialog-fields/commit/91dd461b49d3fc25d146c550ffc4105d2a23a783))

## [1.0.1](https://github.com/gravity-ui/dialog-fields/compare/v1.0.0...v1.0.1) (2023-03-15)

### Bug Fixes

- for CODEOWNERS ([7c9d2e7](https://github.com/gravity-ui/dialog-fields/commit/7c9d2e7eacf093f51873216b494df755fec38417))
- minor fix for right padding ([45f4355](https://github.com/gravity-ui/dialog-fields/commit/45f4355286f147ac04c231d6858d5516f53ca0f3))

## 1.0.0 (2023-02-22)

- First release
