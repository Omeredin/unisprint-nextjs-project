import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <title>Unisprint</title>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-black rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
        <div className="w-3/5 p-5">
          <p>Sign-in Section</p>
          </div>
          {/*Sign-in section*/}
        <div className="w-2/5 bg-blue-500 rounded-tr-2xl rounded-br-2xl py-36 px-12">
          <h2 className="text-3x1 font-bold mb-2">Join Today</h2>
          <div className='border-2 w-10 border-white inline-block mb-2'></div>
          <p className="mb-2">Create an account today to interact with other students</p>
          <a href="#" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-blue-500">Sign up</a>
          </div>
          {/*Sign-up section*/}
      </div>
      </main>
    </div>
  );
}
