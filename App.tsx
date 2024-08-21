import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Root from './src/Root';
import {NavigationContainer} from '@react-navigation/native';
import useMount from 'Hooks/useMount';
import {
  getFcmToken,
  notificationListeners,
  registerAppWithFCM,
  requestUserPermission,
} from 'utils/firebase';

interface IProps {}

/**
 * @author
 * @function @app
 **/

const App: FC<IProps> = props => {
  useMount(() => {
    const initApp = async () => {
      try {
        requestUserPermission();
        registerAppWithFCM();
        getFcmToken();
        notificationListeners();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();
  });
  const {container} = styles;
  return <Root />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
