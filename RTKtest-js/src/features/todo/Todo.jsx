import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { todoAdded, todoToggled, todoRemoved } from './todoSlice';

export const Todo = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [newTodoText, setNewTodoText] = useState('');

  return (
    <div>
      <ol style={{ padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => dispatch(todoToggled(todo.id))}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
            }}
          >
            {todo.text}
          </li>
        ))}
      </ol>
      <input type="text" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />
      <button
        onClick={() => {
          if (!newTodoText.trim()) return;
          dispatch(todoAdded({ id: nanoid(), text: newTodoText }));
          setNewTodoText('');
        }}
      >
        Add Todo
      </button>
      <button
        onClick={() => {
          const lastTodo = todos[todos.length - 1];
          if (lastTodo) {
            dispatch(todoRemoved(lastTodo.id));
          }
        }}
      >
        Remove Last Todo
      </button>
    </div>
  );
};
