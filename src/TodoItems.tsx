import { useCallback, useMemo } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { TodoItem, useTodoItems } from './TodoItemsContext';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const spring = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
  duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
  root: {
    listStyle: 'none',
    padding: 0,
  },
});

export const TodoItemsList = function () {
  const classes = useTodoItemListStyles();

  const { todoItems } = useTodoItems();

  const sortedItems = useMemo(() => {
    todoItems.slice().sort((a, b) => {
      if (a.done && !b.done) return 1;
      if (!a.done && b.done) return -1;
      return 0;
    });
    return todoItems;
  }, [todoItems]);

  return (
    <Droppable droppableId="todo">
      {provided => (
        <ul
          className={classes.root}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {sortedItems.map((item, index) => {
            return (
              <motion.li key={item.id} transition={spring} layout={true}>
                <TodoItemCard item={item} index={index} />
              </motion.li>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

const useTodoItemCardStyles = makeStyles({
  root: {
    marginTop: 24,
    marginBottom: 24,
  },
  doneRoot: {
    textDecoration: 'line-through',
    color: '#888888',
  },
});

export const TodoItemCard = function ({
  item,
  index,
}: {
  item: TodoItem;
  index: number;
}) {
  const classes = useTodoItemCardStyles();
  const { dispatch } = useTodoItems();

  const handleDelete = useCallback(
    () => dispatch({ type: 'delete', data: { id: item.id } }),
    [item.id, dispatch],
  );

  const handleToggleDone = useCallback(
    () =>
      dispatch({
        type: 'toggleDone',
        data: { id: item.id },
      }),
    [item.id, dispatch],
  );

  return (
    <Draggable draggableId={item.id} index={index}>
      {provided => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={classnames(classes.root, {
            [classes.doneRoot]: item.done,
          })}
        >
          <CardHeader
            action={
              <IconButton aria-label="delete" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            }
            title={
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.done}
                    onChange={handleToggleDone}
                    name={`checked-${item.id}`}
                    color="primary"
                  />
                }
                label={item.title}
              />
            }
          />
          {item.details ? (
            <CardContent>
              <Typography variant="body2" component="p">
                {item.details}
              </Typography>
            </CardContent>
          ) : null}
        </Card>
      )}
    </Draggable>
  );
};
