import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AdminLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const adminLogin = async () => {
    try {   
      const users = await firestore().collection('admin').get();
      const userData = users.docs[0].data();
      if (email === userData.email && password === userData.password) {
        await AsyncStorage.setItem('EMAIL', email);
        navigation.navigate('AdminTaskScreen');
      } else {
        Alert.alert('Wrong email/password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'An error occurred while logging in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      
      <Text style={styles.label}>Email Id</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Email Id'}
        value={email}
        onChangeText={(txt) => setEmail(txt)}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Password'}
        value={password}
        onChangeText={(txt) => setPassword(txt)}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          if (email !== '' && password !== '') {
            adminLogin();
          } else {
            Alert.alert('Please Enter Data');
          }
        }}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light grey background for the whole screen
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginTop: 60,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 30,
    marginLeft: '5%', // Aligns with the input box
    marginBottom: 10, // Space before the input box
  },
  inputStyle: {
    paddingLeft: 20,
    height: 50,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    width: '90%',
    backgroundColor: '#ffffff', // White background for input
    color: 'black', // Text color
  },
  loginBtn: {
    backgroundColor: '#007bff', // Bootstrap primary button color
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff', // White text for better visibility
  },
});

export default AdminLoginScreen;
