// RTKtest-js/src/App.jsx
import './App.css';
import { Counter } from './features/counter/Counter';
import { Todo } from './features/todo/Todo';

function App() {
  return (
    <div>
      <h1>Redux Toolkit Counter</h1>
      <Counter />
      <h2>Redux Todo list</h2>
      <Todo />
    </div>
  );
}

export default App;
