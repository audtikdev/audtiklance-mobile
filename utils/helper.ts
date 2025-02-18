import { Alert, Linking } from "react-native";
// import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';

export const formatCurrency = (
  locale: string,
  symbol: string,
  amount: number
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: symbol,
  }).format(amount);
};

export const validateEmail = (email: string) => {
  var re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const containNumber = (text: string) => {
  return /\d/.test(text);
}

export const makeCall = (number: string) => {
  if (!number) {
    return;
  }
  Linking.canOpenURL(`tel:${number}`).then((supported) => {
    if (supported) {
      Linking.openURL(`tel:${number}`);
    } else {
      Alert.alert("Error", "Your device does not support this feature.");
    }
  });
};

export const openLink = async (url: string) => {
  // Check if the URL can be opened
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Open the URL in the browser
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
};

export async function uriToFile(uri: string, fileName: string) {
  const response = await fetch(uri);
  const blob = await response.blob();

  // Create a File object from the Blob
  const file = new File([blob], fileName, { type: blob.type });
  return file;
}
