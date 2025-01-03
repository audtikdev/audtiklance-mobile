import { Alert, Linking } from "react-native";

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
