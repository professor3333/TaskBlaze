// Import statements
import React, { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { WIDTH } from 'utils/dimension';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FeatherIcon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

// Interface for props
interface IProps {}

// Component
const SignUpScreen: FC<IProps> = (props) => {
  // State variables
  const [email, setEmail] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<any>('');

  // Helper function to check if email is valid
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to check if password is valid
  const isPasswordValid = (password: string): string[] => {
    const errors: string[] = [];

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[@$!%*?&]/;

    if (!uppercaseRegex.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    if (!lowercaseRegex.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    if (!digitRegex.test(password)) {
      errors.push('Password must contain at least one digit.');
    }

    if (!specialCharRegex.test(password)) {
      errors.push(
        'Password must contain at least one special character (@$!%*?&).'
      );
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }

    return errors;
  };

  // Navigation hook
  const navigation = useNavigation<any>();

  // Form validation function
  const isFormValid = () => {
    return isEmailValid(email) && isPasswordValid(password).length === 0;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

 // Handle user creation
 const handleCreateUser = async () => {
  try {
    if (!isFormValid()) {
      // Form validation failed
      setMessage('Invalid email or password');
      return;
    }

    const passwordErrors = isPasswordValid(password);

    if (passwordErrors.length > 0) {
      // Password format is invalid
      setMessage(
        'Invalid password format. Please fix the following issues:\n' +
          passwordErrors.join('\n')
      );
      setPasswordErrors(passwordErrors);
      return;
    }

    const passwordRegex = /^[A-Za-z\d@$!%*?&]+$/;

    if (!passwordRegex.test(password)) {
      // Password doesn't match the regex
      setMessage(
        'Invalid password format. Password can only contain letters, digits, and special characters (@$!%*?&).'
      );
      setPasswordErrors(['Password format is invalid.']);
      return;
    }

    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    // Send email verification
    await user.sendEmailVerification();

    setMessage('');
    setPasswordErrors([]);

    if (user && !user.emailVerified) {
      // If email is not verified, navigate to email verification screen
      navigation.navigate('UserInfoScreen');
    } else {
      // If email is verified, navigate to login screen
      navigation.navigate('LoginScreen');
    }
  } catch (error:any) {
    console.error(error);

    let errorMessage = 'An error occurred.';

    // Handle specific authentication error codes
    if (error.code === 'auth/email-already-in-use') {
      errorMessage =
        'Email address is already in use. Please use a different email.';
    }

    // Show an alert with the error message
    Alert.alert('Error', errorMessage);
  }
};
  // Styles
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
    enterTextEmail,
    enterTextEmailStyle,
    enterTextPassword,
    enterTextPasswordStyle,
    underlineStyle,
    buttonStyle,
  } = styles;

  // Render
  return (
    <KeyboardAwareScrollView style={container}>
      <SafeAreaView>
        {/* Navigation to Login Screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginEmailScreen')}>
          <Text style={textStyle}>Have Account? Log In</Text>
        </TouchableOpacity>

        {/* Heading */}
        <View style={headingTextView}>
          <Text style={headingText}>Sign Up</Text>
        </View>

        {/* Subheading */}
        <View style={askView}>
          <Text style={subhead}>Sign Up To Continue</Text>
        </View>

        {/* Email Input */}
        <View style={askView1}>
          <Text style={subhead1}>YOUR EMAIL</Text>
        </View>
        <View style={enterTextEmail}>
          <TextInput
            style={enterTextEmailStyle}
            placeholder="Your email here"
            inputMode="email"
            placeholderTextColor="lightgrey"
            underlineColorAndroid="black"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        {email.length > 0 && !isEmailValid(email) && (
          <Text style={{ color: 'red', marginLeft: 25 }}>
            Invalid email address
          </Text>
        )}

        {/* Password Input */}
        <View style={askView1}>
          <Text style={subhead1}>YOUR PASSWORD</Text>
        </View>
        <View style={underlineStyle}>
          <View style={enterTextPassword}>
            <TextInput
              style={enterTextPasswordStyle}
              placeholder="Your Password Here"
              secureTextEntry={!showPassword}
              placeholderTextColor="lightgrey"
              multiline={false}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{  position:"absolute",
              marginLeft:300}}
            >
              <FeatherIcon
                name={showPassword ? 'eye-off' : 'eye'}
                style={{
                  fontSize: 30,
                  color: 'red',
                
                }}
              />
              <Text>{showPassword}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {password.length > 0 && !isPasswordValid(password) && (
          <Text style={{ color: 'red', marginLeft: 25 }}>
            Invalid Password Format
          </Text>
        )}

        {/* Continue Button */}
        <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={() => handleCreateUser()}
        disabled={!isFormValid()}
      >
          <Text style={buttonStyle}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('AdminLoginScreen')}>
          <Text style={textStyle}>Admin Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textStyle: {
    color: 'black',
    fontFamily: 'Times New Roman',
    fontSize: 20,
    textAlign: 'right',
    textDecorationLine: 'underline',
    marginRight: 30,
    marginTop: 50,
    marginBottom: 30,
  },
  headingTextView: {
    height: 'auto',
    width: 'auto',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 30,
    marginTop: 50,
  },
  headingText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 45,
    fontWeight: '500',
  },
  underlineStyle: {
    width: 350,
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
  },
  subhead1: {
    fontSize: 16,
    color: 'black',
    justifyContent: 'center',
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  enterTextEmail: {
    marginTop: 25,
    width: 350,
    marginLeft: 25,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  enterTextEmailStyle: {
    color: 'black',
    fontWeight: '400',
    fontSize: 20,
    textTransform: 'lowercase',
  },
  enterTextPassword: {
    marginTop: 25,
    width: 350,
    marginLeft: 25,
    fontWeight: '500',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  enterTextPasswordStyle: {
    color: 'black',
    fontWeight: '400',
    fontSize: 20,
  },
  buttonStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
  },
  buttonDisabled: {
    backgroundColor: 'lightgray', // Choose a color for disabled state
  },

});

export default SignUpScreen;
