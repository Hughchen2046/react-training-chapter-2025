import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { useDispatch } from 'react-redux';
import { checkThunk } from './features/auth/AuthThunk.jsx';
import { useEffect } from 'react';
import { GlobalLoading } from './features/loading/Loading.jsx';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkThunk());
  }, [dispatch]);

  return (
    <>
      <GlobalLoading />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
