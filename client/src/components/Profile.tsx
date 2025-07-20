import styles from "../styles/username.module.css";
import extend from "../styles/profile.module.css";
import profilePic from "../assets/profile.png";
import { useFormik } from "formik";
import { profileValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { convertFileToBase64 } from "../helper/convert";
import { updateUser } from "../helper/api";
import useFetch from "../hooks/fetch.hook";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [file, setFile] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      email: apiData?.email || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
      profile: apiData?.profile || "",
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validate: profileValidate,
    onSubmit: async (values) => {
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      const response = updateUser(values);
      response
        .then((item) => {
          toast.success(item.data.message);
        })
        .catch((err) => {
          console.log(err);
          console.log("err");
        });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const base64 = await convertFileToBase64(
      e.target.files?.[0] || new File([], "")
    );
    setFile(base64 as string);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
        <div className={`${styles.glass} ${extend.glass}`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              We are happy to join us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile-pic">
                <img
                  src={file || apiData?.profile || profilePic}
                  alt="profile-pic"
                  className={`${styles.profile_img} ${extend.profile_img}`}
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
              <div className="name flex w-3/4 gap-10">
                <input
                  type="text"
                  placeholder="first name"
                  className={`${styles.text_box} ${extend.text_box}`}
                  {...formik.getFieldProps("firstName")}
                />
                <input
                  type="text"
                  placeholder="last name"
                  className={`${styles.text_box} ${extend.text_box}`}
                  {...formik.getFieldProps("lastName")}
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  type="text"
                  placeholder="email"
                  className={`${styles.text_box} ${extend.text_box}`}
                  {...formik.getFieldProps("email")}
                />
                <input
                  type="text"
                  placeholder="phone"
                  className={`${styles.text_box} ${extend.text_box}`}
                  {...formik.getFieldProps("mobile")}
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  type="text"
                  placeholder="address"
                  className={`${styles.text_box} ${extend.text_box}`}
                  style={{ width: "100%" }}
                  {...formik.getFieldProps("address")}
                />
              </div>
              <button type="submit" className={`${styles.btn}`}>
                Update
              </button>
              <button
                type="button"
                className={`${styles.btn}`}
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
