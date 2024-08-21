import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging'; // Import messaging from Firebase
import notifee from "@notifee/react-native"

interface IUser {
  id: string;
  name: string;
  email: string;
}
 async function onDisplayNotification() {
      // Request permissions (required for iOS)
      // await notifee.requestPermission()
  
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: "Update Coming Soon",
        subtitle: 'Notification',
        body:
            "This app will have some update later.",
        data:{
            "hi":"hi",
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
  
    
const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    // Fetch users from Firestore
    const unsubscribe = firestore().collection('users').onSnapshot(snapshot => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IUser));
      setUsers(usersData);
    });

    return () => unsubscribe(); // Unsubscribe from snapshot listener on unmount
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user document from Firestore
      await firestore().collection('users').doc(userId).delete();
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>
    
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View>
            <View style={styles.userItem}>
              <Text style={styles.userInfo}>{`Email: ${item.email}`}</Text>
              <Text style={styles.userInfo}>{`UID: ${item.id}`}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id} // Use id directly as key
      />
        <TouchableOpacity
        onPress={()=>{onDisplayNotification()}}
        style={styles.notificationButton}>
        <Text style={styles.notificationButtonText}>Send Update Notification</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    fontSize: 16,
    color: '#333333',
  },
  deleteButton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  notificationButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  notificationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
