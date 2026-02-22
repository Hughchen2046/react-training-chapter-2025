import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice.jsx';
import todosReducer from '../features/todo/todoSlice.jsx';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    // filters: filtersReducer
  },
  devTools: import.meta.env.DEV, // 啟用devTools, Vite: 開發模式開啟，production 關閉
});

export default store;
