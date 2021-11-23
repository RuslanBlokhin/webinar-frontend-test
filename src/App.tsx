import { useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TodoItemsList } from './TodoItems';
import { TodoItemsContextProvider } from './TodoItemsContext';
import TodoItemForm from './TodoItemForm';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTodoItems } from './TodoItemsContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9012fe',
    },
    secondary: {
      main: '#b2aabf',
    },
  },
});

function App() {
  return (
    <TodoItemsContextProvider>
      <ThemeProvider theme={theme}>
        <Content />
      </ThemeProvider>
    </TodoItemsContextProvider>
  );
}

function Content() {
  const { todoItems } = useTodoItems();

  // const array = TodoItemsList.sortedItems;

  const [todo, setTodo] = useState(todoItems);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const items = Array.from(todo);

    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);
    setTodo(items);
  };

  return (
    <Container maxWidth="sm">
      <header>
        <Typography variant="h2" component="h1">
          Todo List
        </Typography>
      </header>
      <main>
        <TodoItemForm />
        <DragDropContext onDragEnd={onDragEnd}>
          <TodoItemsList />
        </DragDropContext>
      </main>
    </Container>
  );
}

export default App;
