import auth from '@react-native-firebase/auth';

export const createUser = async (email: string, password: string): Promise<string | null> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user?.uid || null;
  } catch (error) {
    console.error('User creation failed:', error);
    return null;
  }
};

export const sendVerificationEmail = async (email: string): Promise<void> => {
  try {
    const user = auth().currentUser;
    if (user) {
      await user.sendEmailVerification();
    }
  } catch (error) {
    console.error('Sending verification email failed:', error);
  }
};

export const checkIfUserExists = async (email: string): Promise<boolean> => {
  try {
    const userRecord = await auth().getUserByEmail(email);
    return !!userRecord;
  } catch (error) {
    return false;
  }
};
