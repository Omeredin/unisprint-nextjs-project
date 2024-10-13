import Image from "next/image";
import Head from "next/head";
import {FaFacebookF, FaLinkedinIn, FaGoogle, FaRegEnvelope} from "react-icons/fa";
import {MdLockOutline} from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <title>Unisprint</title>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-black rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
        <div className="w-3/5 p-5">
          <div className="text-left font-bold">
            <span className="text-blue-500">Unisprint</span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-blue-500">Sign in to your Account</h2>
              <div className="border-2 w-10 border-white inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <a href="#" className="border-2 border-blue-500 rounded-full p-3 mx-1">
                  <FaFacebookF className="text-sm"/>
                </a>
                <a href="#" className="border-2 border-blue-500 rounded-full p-3 mx-1">
                  <FaLinkedinIn className="text-sm"/>
                </a>
                <a href="#" className="border-2 border-blue-500 rounded-full p-3 mx-1">
                  <FaGoogle className="text-sm"/>
                </a>
                </div>{/*login section from social accounts*/}
                <p className="text-blue-500 my-3">or use your email account</p>
                <div className="flex flex-col items-center ">
                  <div className="bg-white w-64 p-2 flex items-center mb-3">
                    <FaRegEnvelope className= "text-blue-500 mr-2"/>
                  <input type="email" name="email" placeholder="Email" className="bg-white outline-none text-sm flex-1"/>
                  </div>
                  <div className="bg-white w-64 p-2 flex items-center mb-3">
                    <MdLockOutline className= "text-blue-500 mr-2"/>
                  <input type="password" name="password" placeholder="Password" className="bg-white outline-none text-sm flex-1"/>
                  </div>
                  <div className="flex justify-between w-64 mb-5">
                    <label className="flex items-center text-xs"><input type="checkbox" name="remember" className="mr-1"/>Remember me</label>
                    <a href="#" className="text-xs">Forgot Password?</a>
                  </div>
                  <a href="#" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-500 hover:text-black">Sign In</a>
                </div>
            
            </div>
          </div>
          {/*Sign-in section*/}
        <div className="w-2/5 bg-blue-500 rounded-tr-2xl rounded-br-2xl py-36 px-12">
          <h2 className="text-3x1 font-bold mb-2 text-black">Join Today</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p className="mb-2 text-black">Create an account today to interact with other students</p>
          <a href="#" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-blue-500">Sign up</a>
          </div>
          {/*Sign-up section*/}
      </div>
      </main>
    </div>
  );
}
