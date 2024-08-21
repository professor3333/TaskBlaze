import React, {FC} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginEmailScreen from 'screens/LoginEmailScreen';
import TaskDetailScreen from 'screens/TaskDetailScreen';

import SignUpScreen from 'screens/SignUpScreen';
import UserInfoScreen from 'screens/UserInfoScreen';
import TaskViewScreen from 'screens/TaskViewScreen';
import AddTaskScreen from 'screens/AddTaskScreen';
import TabNav from './TabNav';
import AdminLoginScreen from 'screens/AdminLoginScreen';
import AdminTaskScreen from 'screens/AdminTaskScreen';
import EmailVerificationScreen from 'screens/EmailVerificationScreen';

interface IProps {}

/**
 * @author
 * @function @stack
 **/

const StackNav: FC<IProps> = props => {
  const Stack = createStackNavigator<any>();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignUpScreen'>
      
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AdminLoginScreen"
          component={AdminLoginScreen}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="AdminTaskScreen"
          component={AdminTaskScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EmailVerificationScreen"
          component={EmailVerificationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LoginEmailScreen"
          component={LoginEmailScreen}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="UserInfoScreen"
          component={UserInfoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TabNav"
          component={TabNav}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TaskViewScreen"
          component={TaskViewScreen}
          options={{

            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TaskDetailScreen"
          component={TaskDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="AddTaskScreen"
          component={AddTaskScreen}
          options={{
            headerShown: false,
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
