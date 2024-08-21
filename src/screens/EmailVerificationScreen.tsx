import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

interface IProps {}

const EmailVerificationScreen: FC<IProps> = (props) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setIsEmailVerified(user.emailVerified);
      }
    });

    return unsubscribe;
  }, []);

  const handleVerifyEmail = () => {
    const user = auth().currentUser;
    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          navigation.navigate('UserInfoScreen');
        } else {
          Alert.alert('Email Not Verified', 'Please verify your email to proceed.');
        }
      }).catch(error => {
        console.error('Error reloading user:', error);
      });
    } else {
      console.error('No user signed in.');
    }
  };
  
  

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Verify Your Email</Text>
    <Text style={styles.subtitle}>Please verify your email to proceed.</Text>
    <TouchableOpacity onPress={handleVerifyEmail} style={styles.button}>
      <Text style={styles.buttonText}>Verified</Text>
    </TouchableOpacity>
    <View style={styles.buttonview}> 
      <TouchableOpacity onPress={() => navigation.navigate('LoginEmailScreen')} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  </View>
  )
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F5F9', // Light blue background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonview:{
    marginTop:20,
  }
});

export default EmailVerificationScreen;
