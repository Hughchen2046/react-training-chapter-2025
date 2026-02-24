import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { stateIsLoading } from '../features/loading/LoadingSlice';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  // console.log('ProtectedRoute Redux token:', token);
  // console.log('ProtectedRoute localStorage.token:', localStorage.token);

  // if (!token && localStorage.token)
  //   return <div className="container py-5 text-center">驗證中...</div>;

  if (!token && localStorage.token === undefined) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const gloalLoading = useSelector(stateIsLoading('global'));

  return children;
}

export function GuestRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // 已登入就直接去原位；沒帶就回首頁
  const params = new URLSearchParams(location.search);
  const path = params.get('path') || '/';

  if (token !== 'undefined' && token !== 'null' && token !== null) {
    return <Navigate to={path} replace />;
  }

  return children;
}
