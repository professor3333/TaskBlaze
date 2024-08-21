import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/database';
// import { RouteParams } from '../navigation/types';
import auth from '@react-native-firebase/auth';



const TaskDetailScreen: FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();  
  const taskId = route.params?.task?.id;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (route.params?.task) {
      const { title, description, selectedDate } = route.params.task;
      setTitle(title);
      setDescription(description);
      setSelectedDate(selectedDate);
    }
  }, [route.params?.task]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    try {
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      await firebase
        .app()
        .database('https://taskblaze-d5705-default-rtdb.asia-southeast1.firebasedatabase.app/')
        .ref(`todo/${taskId}`)
        .update({
          title,
          description,
          selectedDate,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      Alert.alert('Task updated successfully!');
      navigation.navigate('TaskViewScreen');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      await firebase
        .app()
        .database('https://taskblaze-d5705-default-rtdb.asia-southeast1.firebasedatabase.app/')
        .ref(`todo`)
        .set(null);
      Alert.alert('Task deleted successfully!');
      navigation.navigate('TaskViewScreen');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      <Text style={styles.label}>Selected Date and Time:</Text>
      <TextInput
        style={styles.input}
        value={selectedDate}
        onChangeText={setSelectedDate}
        placeholder="Enter date and time"
      />

      <View style={styles.buttonContainer}>
        <Button title="Update Task" onPress={handleUpdate} color="#4CAF50" />
        <Button title="Delete Task" onPress={handleDelete} color="#f44336" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8, 
    color:'grey'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color:'black',
    fontWeight:'500'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default TaskDetailScreen;
