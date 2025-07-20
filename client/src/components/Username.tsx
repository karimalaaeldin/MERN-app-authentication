import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/username.module.css";
import profilePic from "../assets/profile.png";
import { useFormik } from "formik";
import { usernameValidate } from "../helper/validate";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";

export default function Username() {
  const navigate = useNavigate()
  const setUsername = useAuthStore(state => state.setUsername)

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    validate: usernameValidate,
    onSubmit: async (values) => {
      setUsername(values.username)
      navigate("/password")
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Hello Again!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={profilePic}
                alt="profile-pic"
                className={styles.profile_img}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="text"
                placeholder="Username"
                className={styles.text_box}
                {...formik.getFieldProps("username")}
              />
              <button type="submit" className={`${styles.btn}`}>
                Let's Go
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a member?{" "}
                <Link to="/register" className="text-red-500">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
