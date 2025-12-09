import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

type FocusedRefreshControlProps = RefreshControlProps;

const FocusedRefreshControl = (props: FocusedRefreshControlProps) => {
  const isFocused = useIsFocused();

  if (!isFocused) return undefined;

  return <RefreshControl {...props} />;
};

export default FocusedRefreshControl;
