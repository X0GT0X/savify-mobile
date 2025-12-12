import { store } from '@/store/store';
import 'react-native-reanimated';

import NotificationController from '@/components/notifications/notification-controller';
import AppContent from '@/components/root/app-content';
import '@/translations/i18n.config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

const RootLayout = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NotificationController />
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default RootLayout;
