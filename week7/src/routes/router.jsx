import { createHashRouter } from 'react-router-dom';

import Home from '../views/front/Home';
import Login from '../views/front/Login';
import NotFound from '../views/front/NotFound';
import Product from '../views/front/Products';
import Cart from '../views/front/Cart';
import SingleProduct from '../views/front/SingleProduct';

import FrontendLayout from '../layout/FrontendLayout';
import AdminLayout from '../layout/AdminLayout';
import AdminProducts from '../views/admin/AdminProducts';
import AdminOrders from '../views/admin/AdminOrders';
import { GuestRoute, ProtectedRoute } from './CheckRouter';

// import AuthRender from '../features/auth/Auth';

export const router = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'product',
        element: <Product />,
      },
      {
        path: 'product/:id',
        element: <SingleProduct />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    // 加入ProtectRoute來避免進入admin
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
