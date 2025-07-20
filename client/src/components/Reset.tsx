import styles from "../styles/username.module.css";
import { useFormik } from "formik";
import { resetPasswordValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { resetPassword } from "../helper/api";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";
import { useNavigate } from "react-router-dom";

export default function Reset() {
  const navigate = useNavigate()
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, serverError, status }] = useFetch("createResetSession");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    validate: resetPasswordValidate,
    onSubmit: async (values) => {
      const resetResponse = resetPassword({
        username,
        password: values.password,
      });
      resetResponse
        .then((item) => {
          toast.success(item.data.message);
          navigate("/password");
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });

      toast.promise(resetResponse, {
        loading: "Resetting...",
      });

      return resetPassword;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (serverError) {
    return <div>{serverError.message}</div>;
  }
  if (status !== 201) {
    return <div>{status}</div>;
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Reset Password</h4>
            <span className="py-4 text-xl text-center text-gray-500">
              Enter new password
            </span>
          </div>
          <form className="pt-10" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="text"
                placeholder="New Password"
                className={styles.text_box}
                {...formik.getFieldProps("password")}
              />
              <input
                type="text"
                placeholder="Confirm Password"
                className={styles.text_box}
                {...formik.getFieldProps("confirmPassword")}
              />
              <button type="submit" className={`${styles.btn}`}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
