import copy from "copy-to-clipboard"
import toast, { Toaster } from "react-hot-toast"
import { AiFillCopy } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"

import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  const handleCopy = (text) => {
    copy(text)
    toast.success("Copied to clipboard: " + text)
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <Toaster />
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-x-12 md:gap-y-0">
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </div>
        </div>
      )}
      <div className="mt-8 flex w-full max-w-2xl flex-col space-y-4 text-white">
        <div className="bg-gray-800 flex flex-col items-center justify-between rounded-md p-4 lg:flex-row">
          <div className="w-full lg:w-1/2 lg:text-left">
            <div className="text-center font-semibold lg:text-left">
              Test Email Student
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2 lg:justify-start">
              <span className="text-gray-300">mirailearning@gmail.com</span>
              <AiFillCopy
                onClick={() => handleCopy("mirailearning@gmail.com")}
                className="cursor-pointer text-blue-500"
                size={20}
              />
            </div>
          </div>
          <div className="mt-4 w-full lg:mt-0 lg:w-1/2 lg:text-left">
            <div className="text-center font-semibold lg:text-left">
              Test Password
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2 lg:justify-start">
              <span className="text-gray-300">123456</span>
              <AiFillCopy
                onClick={() => handleCopy("123456")}
                className="cursor-pointer text-blue-500"
                size={20}
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 flex flex-col items-center justify-between rounded-md p-4 lg:flex-row">
          <div className="w-full lg:w-1/2 lg:text-left">
            <div className="text-center font-semibold lg:text-left">
              Test Email Instructor
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2 lg:justify-start">
              <span className="text-gray-300">
                mirailearninginstructor@gmail.com
              </span>
              <AiFillCopy
                onClick={() => handleCopy("mirailearninginstructor@gmail.com")}
                className="cursor-pointer text-blue-500"
                size={20}
              />
            </div>
          </div>
          <div className="mt-4 w-full lg:mt-0 lg:w-1/2 lg:text-left">
            <div className="text-center font-semibold lg:text-left">
              Test Password
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2 lg:justify-start">
              <span className="text-gray-300">010101</span>
              <AiFillCopy
                onClick={() => handleCopy("010101")}
                className="cursor-pointer text-blue-500"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Template
