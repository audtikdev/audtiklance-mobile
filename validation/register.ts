import * as yup from "yup";

export const userRegisterSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "Fullname must be at least 4 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Fullname must be at least 4 characters")
    .required("First name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().min(9, "Phone number must be at least 9 characters").required("Phone Number is required"),
  password: yup
    .string()
    .matches(/\d/, "Password must include at least a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least a symbol")
    .min(6, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .matches(/\d/, "Password must include at least a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least a symbol")
    .min(6, "Confirm Password must be at least 8 characters")
    .required("Password is required"),
});

export const providerRegisterOneSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "Fullname must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Fullname must be at least 2 characters")
    .required("First name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .matches(/\d/, "Password must include at least a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least a symbol")
    .min(6, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .matches(/\d/, "Password must include at least a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least a symbol")
    .min(6, "Confirm Password must be at least 8 characters")
    .required("Password is required"),
});

export const providerRegisterTwoSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, "Business name must be at least 2 characters")
    .required("Business name is required"),
  phoneNumber: yup.string().min(9, "Phone number must be at least 9 characters").required("Phone Number is required"),
  profilePicture: yup
    .string()
    .required("Image is required"),
  address: yup
    .string()
    .required("Address is required"),
  longitude: yup
    .string()
    .required("Address is required"),
  latitude: yup
    .string()
    .required("Address is required"),
  description: yup
    .string()
    .min(100, "Description must be at least 100 characters")
    .required("Description is required"),
});
