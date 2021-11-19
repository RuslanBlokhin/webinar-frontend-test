import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import produce from 'immer';

export interface TodoItem {
  id: string;
  title: string;
  details?: string;
  done: boolean;
}

interface TodoItemsState {
  todoItems: TodoItem[];
}

interface AddItem {
  todoItem: {
    title: string;
    details?: string;
  };
}
interface DeleteItem {
  id: string;
}

interface TodoItemsAction {
  type: 'loadState' | 'add' | 'delete' | 'toggleDone';
  data: (TodoItemsState & TodoItem & AddItem & DeleteItem) | any;
}

const TodoItemsContext = createContext<
  (TodoItemsState & { dispatch: (action: TodoItemsAction) => void }) | null
>(null);

const defaultState = { todoItems: [] };
const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const [state, dispatch] = useReducer(todoItemsReducer, defaultState);

  useEffect(() => {
    const savedState = localStorage.getItem(localStorageKey);

    if (savedState) {
      try {
        dispatch({ type: 'loadState', data: JSON.parse(savedState) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [state]);

  return (
    <TodoItemsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TodoItemsContext.Provider>
  );
};

export const useTodoItems = () => {
  const todoItemsContext = useContext(TodoItemsContext);

  if (!todoItemsContext) {
    throw new Error(
      'useTodoItems hook should only be used inside TodoItemsContextProvider',
    );
  }

  return todoItemsContext;
};

function todoItemsReducer(state: TodoItemsState, action: TodoItemsAction) {
  switch (action.type) {
    case 'loadState':
      return action.data;

    case 'add':
      const addItem = produce(state, draft => {
        const mewItem = {
          id: generateId(),
          done: false,
          ...action.data.todoItem,
        };
        draft.todoItems.push(mewItem);
      });
      return addItem;

    case 'delete':
      const deleteItem = produce(state, draft => {
        draft.todoItems = draft.todoItems.filter(
          ({ id }) => id !== action.data.id,
        );
      });
      return deleteItem;

    case 'toggleDone':
      const itemIndex = state.todoItems.findIndex(
        ({ id }) => id === action.data.id,
      );
      const item = state.todoItems[itemIndex];
      console.log(item);
      const toggleItem = produce(state, draft => {
        // const todo = draft.todoItems.find(({ id }) => id === action.data.id);
        // console.log(todo);
        draft.todoItems[itemIndex].done = !item.done;
      });
      return toggleItem;
    default:
      throw new Error();
  }
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.floor(
    Math.random() * 1e16,
  ).toString(36)}`;
}
