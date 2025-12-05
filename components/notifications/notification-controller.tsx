import React from 'react';
import { connect, useDispatch } from 'react-redux';

import Notification from '@/components/notifications/notification';
import { NotificationState, closeNotification } from '@/features/notifications/state';
import { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => {
  return {
    notification: state.notifications,
  };
};

type Props = {
  notification: NotificationState;
};

const NotificationController: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const onClose = () => dispatch(closeNotification());

  return props.notification.isVisible ? (
    <Notification
      type={props.notification.type!}
      message={props.notification.message!}
      onClose={onClose}
    />
  ) : null;
};

export default connect(mapStateToProps)(NotificationController);
