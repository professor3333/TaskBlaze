import { Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native'
import { PermissionsAndroid } from 'react-native';
 
 


 
export const requestUserPermission = async (): Promise<void> => {
    if (Platform.OS === "ios") {
        try {
            const authStatus: FirebaseMessagingTypes.AuthorizationStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
 
            if (enabled) {
                getFcmToken();
            }
        } catch (error) {
            console.error('Error requesting permission in ios:', error);
        }
    } else if (Platform.OS === "android") {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
};
 
export const registerAppWithFCM = async (): Promise<void> => {
    try {
        await messaging().registerDeviceForRemoteMessages();
    } catch (error) {
        console.error('Error registering app with FCM:', error);
    }
};
 
export const getFcmToken = async (): Promise<string | undefined> => {
    try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('Your Firebase Token is:', fcmToken);
            return fcmToken;
        } else {
            console.error('Failed', 'No token received');
        }
    } catch (error) {
        console.error('Failed', error);
    }
}
 
 
export const onDisplayNotification = async (data: FirebaseMessagingTypes.RemoteMessage) => {
    if (Platform.OS === "ios") {
        await notifee.requestPermission()
    } else if (Platform.OS === "android") {
        await requestUserPermission();
    }
 
    console.log("check the data received =>", data)
 
    //create a group
    await notifee.createChannelGroup({
        id: 'default',
        name: 'Default',
    })
 
 
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        groupId: 'default',
        sound: 'default',
        vibration: true,
        lights: true,
        importance: AndroidImportance.HIGH,
    })
 
    await notifee.displayNotification({
        title: data.notification?.title,
        subtitle: 'Notification',
        body:
            data.notification?.body,
        data:{
            ...data.data,
        },
        android: {
            channelId,
            color: '#4caf50',
            actions: [
                {
                    title: '<p style="color: #f44336;"><b>Cancel</b></p>',
                    pressAction: { id: 'cancel' },
                },
                {
                    title: '<p style="color: #f44336;"><b>Open</b></p>',
                    pressAction: { id: 'open' },
                },
            ],
        },
        ios:{
            sound: 'default',
            badgeCount: 1,
            foregroundPresentationOptions: {
                alert: true,
                badge: true,
                sound: true,
            },
        }
    })
}
 
export const notificationListeners = async () => {
    console.log("am i here")
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
        await onDisplayNotification(remoteMessage);
    })
 
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
        );
 
        if (!!remoteMessage?.data) {
            setTimeout(() => {
                console.log('Notification caused app to open from background state navigation to be handled here:', remoteMessage);
            }, 1200);
        }
    });
 
    messaging().getInitialNotification().then(remoteMessage => {
        if (!!remoteMessage?.data) {
            setTimeout(() => {
                console.log('Notification caused app to open from quit state navigation to be handled here:', remoteMessage);
            }, 1200);
        }
    }).catch(err => {
        console.error('getInitialNotification error =>', err);
    });
 
    return unsubscribe;
}