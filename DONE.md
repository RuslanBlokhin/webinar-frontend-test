#### F1. Приоритеты

Не получается фиксироывть выбранные todo на новом месте

### Технические задачи

#### T1. Форматирование кода

- Подключите и настройте [Prettier](https://prettier.io/)
- Настройте проверку форматирования кода на pre-commit hook (с помощью
  [husky](https://github.com/typicode/husky))

#### T2. Типизация

- Избавьтесь от `any` в интерфейсе `TodoItemsAction` // Не получилось избавиться
  до конца от any =(

#### T3. Иммутабельность

- Переведите код `todoItemsReducer` на
  [ImmerJS](https://immerjs.github.io/immer/)

#### I3. Свои идеи

- Сделал добавление item'ов через push, чтобы новые дела добавлялись в конец
