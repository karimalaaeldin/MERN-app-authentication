import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/username.module.css";
import profilePic from "../assets/profile.png";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";
import { verifyPassword } from "../helper/api";

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth); 
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    validate: passwordValidate,
    onSubmit: async (values) => {
      const loginPassword = verifyPassword({username, password: values.password})
      loginPassword.then((item) => {
        localStorage.setItem("token", item?.data.token);
        toast.success(item?.data.message);
        navigate("/profile");
      }).catch((err) => {
        toast.error(err.response.data.error);
      })

      toast.promise(loginPassword, {
        loading: "Registering...",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (serverError) {
    return <div>{serverError.message}</div>;
  }



  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Hello {apiData?.username}</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || profilePic}
                alt="profile-pic"
                className={styles.profile_img}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="password"
                placeholder="Password"
                className={styles.text_box}
                {...formik.getFieldProps("password")}
              />
              <button type="submit" className={`${styles.btn}`}>
                Sign In
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Forget password?{" "}
                <Link to="/recovery" className="text-red-500">
                  Recovery Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
