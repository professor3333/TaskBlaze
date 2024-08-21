// AddTaskScreen.tsx
import React, { FC, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/database';

interface IProps {}

const AddTaskScreen: FC<IProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const navigation = useNavigation<any>();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmDate = (event: any, date?: Date | undefined) => {
    if (date) {
      const currentDate = new Date();
      if (date < currentDate) {
        Alert.alert('Invalid Date', 'Please select a future date and time.');
      } else {
        setSelectedDate(date);
      }
    }
    hideDatePicker();
  };

  const handleConfirmTime = (event: any, date?: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
    hideTimePicker();
  };

  const handleAddTask = async () => {
    try {
      if (!selectedDate || selectedDate < new Date()) {
        Alert.alert('Invalid Date', 'Please select a future date and time.');
        return;
      }

      const taskRef = firebase
        .app()
        .database('https://taskblaze-d5705-default-rtdb.asia-southeast1.firebasedatabase.app/')
        .ref('/todo/');

      const newTaskRef = taskRef.push(); // Generates a unique key for the task

      const taskData = {
        taskId: newTaskRef.key,
        selectedDate: selectedDate.toISOString(),
        title,
        description,
      };

      await newTaskRef.set(taskData);

      Alert.alert('Task created successfully!');
      navigation.navigate('TaskViewScreen', { selectedDate: selectedDate.toISOString() });
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task. Check console for details.');
    }
  };

  const {
    container,
    headerContainer,
    headerText,
    inputContainer,
    inputStyle,
    descriptionInputStyle,
    buttonContainer,
    createTaskButton,
    iconContainer,
    iconStyle,
    screenHeading,
    textStyle,
    imageContainer,
    svgContainer,
    svgStyle,
    profileContainer,
    infoStyle,
    configureContainer,
    assignStyle,
    assignStyle2,
    icon2Container,
    icon2Style,
    dateInfoContainer,
    dateShowContainer,
  } = styles;

  return (
    <SafeAreaView style={container}>
      <View style={screenHeading}>
        <View style={iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('TaskViewScreen')}>
            <FeatherIcon name="arrow-left-circle" style={iconStyle} />
          </TouchableOpacity>
        </View>
        <Text style={[textStyle, { fontSize: 36 }]}>Create Task</Text>
      </View>
      <View style={configureContainer}>
        <View style={dateInfoContainer}>
          <View style={icon2Container}>
            <TouchableOpacity>
              <FeatherIcon
                name="calendar"
                size={30}
                color="black"
                style={icon2Style}
                onPress={showDatePicker}
              />
            </TouchableOpacity>
          </View>
          <View style={dateShowContainer}>
            <Text style={assignStyle}>Due Date</Text>
            {selectedDate && (
              <Text style={assignStyle2}>
                {selectedDate.toDateString().split('T')[0]}{' '}
              </Text>
            )}
            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={handleConfirmDate}
              />
            )}
          </View>
          <View style={icon2Container}>
            <TouchableOpacity>
              <FeatherIcon
                name="clock"
                size={30}
                color="black"
                style={icon2Style}
                onPress={showTimePicker}
              />
            </TouchableOpacity>
          </View>
          <View style={dateShowContainer}>
            <Text style={assignStyle}>Due Time</Text>
            {selectedDate && (
              <Text style={assignStyle2}>
                {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
            {isTimePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="time"
                display="default"
                onChange={handleConfirmTime}
              />
            )}
          </View>
        </View>
      </View>
      <View style={headerContainer}>
        <Text style={headerText}>Add Task</Text>
      </View>
      <View style={inputContainer}>
        <Text style={[textStyle, { fontSize: 18, marginBottom: 5, color: 'black' }]}>Task Title:</Text>
        <TextInput
          style={inputStyle}
          placeholder="Enter Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      <View style={inputContainer}>
        <Text style={[textStyle, { fontSize: 18, marginBottom: 5, color: 'black' }]}>Task Description:</Text>
        <TextInput
          style={descriptionInputStyle}
          placeholder="Enter Task Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

      <View style={buttonContainer}>
        <TouchableOpacity style={createTaskButton} onPress={handleAddTask}>
          <Text style={{ fontSize: 18, color: 'white' }}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 65,
    marginLeft: 10,
    backgroundColor: 'white',
    width: 100,
    height: 100,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
  svgStyle: {
    height: 55,
    width: 55,
    marginTop: 8,
    marginRight: 1,
    borderRadius: 50,
  },
  svgContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 65,
    marginLeft: 10,
    backgroundColor: 'white',
    width: 80,
    height: 80,
    alignItems: 'center',
  },
  screenHeading: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 80,
    marginLeft: 20,
  },
  iconStyle: {
    fontSize: 25,
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 9,
    marginRight: 2.5,
  },
  iconContainer: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 60,
  },
  profileContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  infoStyle: {
    flexDirection: 'column',
    marginLeft: 0,
  },
  configureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Center the content horizontally
  alignItems: 'center', // Center the content vertically
  marginHorizontal:18,
  },
  assignStyle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'black',
    marginLeft:42,
    overflow:'visible'
  },
  assignStyle2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginLeft:42,
    overflow:'visible'
  },
  icon2Style: {
    fontSize: 40,
    color: 'black',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 50,
  },
  icon2Container: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
  },
  dateInfoContainer: {
    flexDirection: 'row',
  },
  dateShowContainer: {
    marginLeft:-42,
    alignSelf: 'center',
    marginRight: 20,
    flexDirection: 'column',
  },
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  inputStyle: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: 'black',
  },
  descriptionInputStyle: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  createTaskButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default AddTaskScreen;
