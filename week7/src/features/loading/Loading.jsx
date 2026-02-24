import { useSelector } from 'react-redux';
import { stateIsLoading } from './LoadingSlice';
import { Slab } from 'react-loading-indicators';

export function GlobalLoading() {
  const isGlobalLoading = useSelector(stateIsLoading('global'));
  if (!isGlobalLoading) return null;
  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
        style={{ zIndex: 9999 }}
      >
        <Slab color="#cc31ac" size="large" text="loading..." textColor="#810b0b" />
      </div>
    </>
  );
}
