import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import store from './app/store.jsx';
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
