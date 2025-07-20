import toast from "react-hot-toast";
import { authenticate } from "./api";

interface FormValues {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  image?: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  image?: string;
  exist?: string;
}

// VALIDATE USERNAME
function usernameVerify(error: FormErrors = {}, values: FormValues) {
  if (!values.username) {
    error.username = toast.error("Username is required");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid username");
  }

  return error;
}

// VALIDATE LOGIN PAGE USERNAME
export async function usernameValidate(values: FormValues) {
  const errors = usernameVerify({}, values);
  if (values.username) {
    const response = await authenticate(values.username);
    if ("error" in response) {
      errors.exist = toast.error("Username does not exist");
    }
  }
  return errors;
}

// VALIDATE PASSWORD
function passwordVerify(error: FormErrors = {}, values: FormValues) {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    error.password = toast.error("Password is required");
  } else if (values.password.length < 4) {
    error.password = toast.error("Password must be more 4 characters");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character");
  }

  return error;
}

// VALIDATE LOGIN PAGE PASSWORD
export async function passwordValidate(values: FormValues) {
  const errors = passwordVerify({}, values);
  return errors;
}

// VALIDATE RESET PASSWORD
function resetPasswordVerify(error: FormErrors = {}, values: FormValues) {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    error.password = toast.error("Password is required");
  } else if (values.password.length < 4) {
    error.password = toast.error("Password must be more 4 characters");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character");
  } else if (values.password !== values.confirmPassword) {
    error.confirmPassword = toast.error("Passwords do not match");
  }

  return error;
}

// VALIDATE RESET PAGE PASSWORD
export async function resetPasswordValidate(values: FormValues) {
  const errors = resetPasswordVerify({}, values);
  return errors;
}

// EMAIL VALIDATION
function emailVerify(error: FormErrors = {}, values: FormValues) {
  if (!values.email) {
    error.email = toast.error("Email is required");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Invalid email");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email");
  }

  return error;
}

// VALIDATE REGISTER FORM
export async function registerValidate(values: FormValues) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

// VALIDATE PROFILE FORM
export async function profileValidate(values: FormValues) {
  const errors = emailVerify({}, values);
  return errors;
}
