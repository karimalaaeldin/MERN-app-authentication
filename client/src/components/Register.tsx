import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/username.module.css";
import profilePic from "../assets/profile.png";
import { useFormik } from "formik";
import { registerValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { convertFileToBase64 } from "../helper/convert";
import { register } from "../helper/api";

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      profile: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    validate: registerValidate,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });

      const registerResponse = register(values);

      registerResponse
        .then((item) => {
          toast.success(<b>{item.data.message}</b>);
          navigate("/");
        })
        .catch((err) => {
          toast.error(<b>{err.response.data.error}</b>);
        });

      toast.promise(registerResponse, {
        loading: "Registering...",
      });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const base64 = await convertFileToBase64(
      e.target.files?.[0] || new File([], "")
    );
    setFile(base64 as string);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "45%", paddingTop: "3rem", height: "max-content" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              We are happy to join us
            </span>
            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <label htmlFor="profile-pic">
                  <img
                    src={file || profilePic}
                    alt="profile-pic"
                    className={styles.profile_img}
                  />
                </label>
                <input
                  type="file"
                  id="profile-pic"
                  name="profile-pic"
                  onChange={handleFileChange}
                />
              </div>
              <div className="textbox flex flex-col items-center gap-6">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className={styles.text_box}
                  {...formik.getFieldProps("email")}
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={styles.text_box}
                  {...formik.getFieldProps("username")}
                />
                <input
                  type="text"
                  placeholder="Enter your password"
                  className={styles.text_box}
                  {...formik.getFieldProps("password")}
                />
                <button type="submit" className={`${styles.btn}`}>
                  Register
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                  Already a have an account?{" "}
                  <Link to="/" className="text-red-500">
                    Login Now
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
