import { useSelector } from 'react-redux';
import { stateIsLoading } from './LoadingSlice';
import { Slab } from 'react-loading-indicators';

export function GlobalLoading() {
  const isGlobalLoading = useSelector(stateIsLoading('global'));

  if (!isGlobalLoading) return null;
  return (
    <Slab
      color={['#32cd32', '#327fcd', '#cd32cd', '#cd8032']}
      size="large"
      speedPlus="-3"
      text=""
      textColor=""
    />
  );
}
