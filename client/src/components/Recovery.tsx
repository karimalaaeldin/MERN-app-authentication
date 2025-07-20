import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/store";
import styles from "../styles/username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { generateOTP, verifyOTP } from "../helper/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Recovery() {
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState<string>("");

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    generateOTP(username).then((OTP) => {
      console.log(OTP);
      if (OTP) {
        return toast.success("OTP sent to your email address.");
      }
      return toast.error("Error sending OTP.");
    });
  }, [username]);

  const checkOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await verifyOTP({ username, code: OTP });
      if (response.status === 201) {
        toast.success(response.data.message);
        return navigate("/reset");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return toast.error(error.response?.data?.error);
      }
    }
  };

  const resendOTP = () => {
    const response = generateOTP(username)
      .then(() => {
        toast.success("OTP has been sent to your email address");
      })
      .catch(() => {
        toast.error("cannot sent OTP");
      });

    toast.promise(response, {
      loading: "Sending OTP...",
    });

    return response;
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover your password
            </span>
          </div>
          <form className="pt-10" onSubmit={(e) => checkOTP(e)}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOTP(e.target.value)
                  }
                  placeholder="Enter OTP code"
                  className={`${styles.text_box} mt-2`}
                />
              </div>
              <button type="submit" className={`${styles.btn}`}>
                Recover
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Cna't get OTP?{" "}
                <button
                  className="text-red-500 cursor-pointer"
                  onClick={resendOTP}
                  type="button"
                >
                  Resend again
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
