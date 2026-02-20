import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ENV from './env';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_CLIENT_ID, // Mesmo GOOGLE_CLIENT_ID do backend
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};