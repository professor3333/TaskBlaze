import {useNavigation} from '@react-navigation/native';
import React, {FC, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

import {WIDTH, HEIGHT} from 'utils/dimension';
import auth from '@react-native-firebase/auth';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';

interface IProps {}

/**
 * @author
 * @function @loginScreen
 **/

const LoginEmailScreen: FC<IProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();
  const isEmailValid = (email: string): boolean => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  const handleLogin = async () => {
    console.log("Attempting login...");
    
    if (!email.trim()) {
      console.log("Email is empty. Showing alert.");
      Alert.alert("Please enter your email.");
      return;
    }
    
    if (!isEmailValid(email)) {
      console.log("Invalid email format. Showing alert.");
      Alert.alert("Invalid email address.");
      return;
    }
    
    try {
      // Attempt to sign in with the provided email and password
      console.log("Attempting Firebase authentication...");
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;
      
      // Query the Firestore database to see if the user exists
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
  
      if (userSnapshot.empty) {
        console.log("User does not exist in the database. Navigating to UserInfoScreen...");
        navigation.navigate('UserInfoScreen', { userId });
      } else {
        console.log("User exists in the database. Navigating to TabNav...");
        navigation.navigate('TabNav');
      }
  
      // If successful, userCredential.user will contain the signed-in user information
      if (userCredential && userCredential.user) {
        console.log("Login successful. Navigating to TabNav...");
        // Navigate to the UserInfoScreen or perform any other actions you need
        navigation.navigate("TabNav");
      } else {
        // Handle the case where userCredential.user is not available
        console.log("Authentication failed. User data not available.");
      }
    } catch (error: any) {
      // If an error occurs, check the error code to determine the case
      console.log("Error during authentication:", error);
  
      // Handle authentication errors
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        console.log("Invalid credentials. Showing alert.");
        Alert.alert("Authentication Failed", "Invalid credentials. Please check your email and password.");
      } else {
        // Handle other errors
        console.log("Authentication error:", error);
      }
    }
  };
  
  
  
  


  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  
  const {
    container,
    textStyle,
    headingText,
    subhead,
    headingTextView,
    askView,
    askView1,
    button,
    subhead1,
    enterText,
    enterTextStyle,
    buttonStyle,
    underlineStyle,
    enterText1,enterTextStyle1
  } = styles;
  return (
    <KeyboardAwareScrollView style={container}>
 
      <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={textStyle}>Create Account</Text>
      </TouchableOpacity>
      <View style={headingTextView}>
        <Text style={headingText}>Log In</Text>
      </View>
      <View style={askView}>
        <Text style={subhead}>What's your email?</Text>
      </View>
      <View style={askView1}>
        <Text style={subhead1}>YOUR EMAIL</Text>
      </View>
      <View style={enterText}>
        <TextInput
          style={enterTextStyle}
          placeholder="Your email here"
          inputMode="email"
          placeholderTextColor="lightgrey"
          underlineColorAndroid="black"
          onChangeText={text => setEmail(text)}
          value={email}
          
        />
        {email.length > 0 && !isEmailValid(email) && (
    <Text style={{ color: 'red' }}>Invalid email address</Text>
  )}
      </View>
      <View style={askView1}>
        <Text style={subhead1}>YOUR PASSWORD</Text>
      </View>
      <View style={underlineStyle}>
      <View style={enterText1}>
        <TextInput
          style={enterTextStyle1}
          placeholder="Your Password Here"
          secureTextEntry={!showPassword}
          placeholderTextColor="lightgrey"
          multiline={false}
          onChangeText={text => setPassword(text)}
          value={password} />
        <TouchableOpacity onPress={togglePasswordVisibility}    style={{  position:"absolute",
              marginLeft:300}}>
          <FeatherIcon
            name={showPassword ? 'eye-off' : 'eye'}
            style={{
              fontSize: 30,
              color: 'red',
            }} />
          <Text>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={button}
        onPress={() => handleLogin()}
        disabled={!isEmailValid(email)}>
        <Text style={buttonStyle}>Continue</Text>
      </TouchableOpacity>
   
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textStyle: {
    color: 'black',
    fontFamily: 'Times New Roman',
    fontSize: 20,
    textAlign: 'justify',
    textDecorationLine: 'underline',
    marginLeft: 219,
    marginTop: 80,
  },
  underlineStyle: {
    width:350
  },

  headingTextView: {
    height: 'auto',
    width: 'auto',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 30,
    marginTop: 50,
  },
  enterText1: {
    marginTop: 25,
    width: 350,
    marginLeft: 25,
    fontWeight: '400',
    flexDirection:'row',
    justifyContent:"space-between",
    borderBottomWidth: 1, 
    borderBottomColor: 'black',
  },
  enterTextStyle1: {
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
  },
  headingText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 45,
    fontWeight: '500',
  },
  subhead: {
    fontSize: 18,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '300',
    textTransform: 'capitalize',
  },
  askView: {
    height: 'auto',
    width: 'auto',
    justifyContent: 'center',
    marginLeft: 30,
    marginTop: 20,
  },
  askView1: {
    height: 'auto',
    width: 'auto',
    marginLeft: 30,
    marginTop: 50,
  },
  button: {
    justifyContent: 'center',
    marginLeft: 50,
    marginTop: 50,
    backgroundColor: 'royalblue',
    width: WIDTH - 100,
    borderRadius: 25,
    textDecorationLine: 'underline',
    height: 70,
    alignItems: 'center',
    textTransform: 'lowercase',
  },
  subhead1: {
    fontSize: 16,
    color: 'black',
    justifyContent: 'center',
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  enterText: {
    marginTop: 25,
    width: 350,
    marginLeft: 25,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  enterTextStyle: {
    color: 'black',
    fontWeight: '400',
    fontSize: 20,
    textTransform: 'lowercase',
  },
  buttonStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
  },
});

export default LoginEmailScreen;
