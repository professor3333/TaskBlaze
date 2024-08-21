import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AddTaskScreen from 'screens/AddTaskScreen';
import TaskViewScreen from 'screens/TaskViewScreen';

/**
 * @author
 * @function @TabNav
 **/

const TabNav = () => {
  const Tab = createBottomTabNavigator();
  return (
    <>
      <Tab.Navigator
        initialRouteName='TaskViewScreen'
        
        screenOptions={({ route }) => ({
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            
            display: 'flex',
            position: 'absolute',
            bottom: 20,
            left: 25,
            right: 25,
            elevation: 5,
            backgroundColor: '#5856D6',
            borderRadius: 30,
            height: 60,
          },
          tabBarShowLabel: false,
          headerShown: false,
        })}>
        <Tab.Screen
          name="AddTaskScreen"
          component={AddTaskScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  top: Platform.OS === 'ios' ? 10 : 0,
                }}>
                {/* Outer circle */}
                <View
                  style={{
                    backgroundColor: 'slategrey', 
                    borderRadius: 30,
                    width: 60,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {/* Inner plus-circle */}
                  <FeatherIcon
                    name="plus-circle"
                    size={40}
                    color={focused ? 'red' : '#9594e5'}
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="TaskViewScreen"
          component={TaskViewScreen}
          options={{ 
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  top: Platform.OS === 'ios' ? 10 : 0,
                }}>
                <FeatherIcon
                  name="list"
                  size={30}
                  color={focused ? 'red' : '#9594e5'}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNav;
