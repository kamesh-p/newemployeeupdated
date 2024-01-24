import React, { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const router = useRouter();
  const { userid } = router.query;
  const [inputValue, setInputValue] = useState("");
  const [inputchangeValue, setChangePasswordValue] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChangepassword = (e) => {
    setChangePasswordValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/checkpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
          checkPassword: inputValue,
          newpassword: inputchangeValue,
        }),
      });

      if (response.ok) {
        console.log("Password changed successfully!");
        setIsChangePassword(true);
        toast.success("Password changed successfully!");
        setInputValue("");
        setChangePasswordValue("");
        router.push("/");
      } else {
        console.error("Failed to change password.");
        toast.error("Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      toast.error("Error changing password.");
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10 mt-20">
        <img
          src="https://www.postman.com/_wp-assets/home/homepage-footer-illustration.d3da12776e6f2f03c589282053789222.svg"
          className="btn-"
          alt="Illustration"
        />
      </div>
      <div className="container   mt-8 p-4 max-w-md">
        <h1 className="text-3xl my-10  text-teal-700 font-extrabold">
          Change Password
        </h1>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm my-3 font-medium text-gray-700"
          >
            Enter current password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter current password"
            className="border p-2 w-full rounded"
            onChange={handleChange}
            value={inputValue}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium my-5 text-gray-700"
          >
            Enter new password
          </label>
          <input
            type="password"
            id="newPassword"
            placeholder="Enter new password"
            className="border p-2 w-full rounded"
            onChange={handleChangepassword}
            value={inputchangeValue}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-teal-500  my-5 text-white py-2 px-4 rounded cursor-pointer"
        >
          Change Password
        </button>

        {/* <ToastContainer position="bottom-right" /> */}
      </div>
    </div>
  );
};

export default ChangePassword;
