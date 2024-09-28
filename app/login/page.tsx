'use client';
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; 
import Footer from "@/components/footer/footer";
import { useUserData } from "@/context/userContext";
import { FormDataLogIn } from "@/config/intefaces";
import { loginUser } from "@/config/api";  

const LogIn = () => {
  const { handleLogin } = useUserData(); 
  const [formData, setFormData] = useState<FormDataLogIn>({
    username: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { access_token, ...userData } = await loginUser(formData);  
      handleLogin(access_token, userData); 
      console.log("User logged in successfully");
      router.push("/"); 
    } catch (error) {
      console.error("Error logging in user:", (error as any).response?.data);
    }
  };

  return (
    <>
      <div
        className="relative w-full h-screen bg-cover bg-center flex flex-col md:flex-row"
        style={{
          backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/powerleds-49579.appspot.com/o/buzzflix-login-image.jpg?alt=media&token=f3c0dd13-18b1-4c64-8a6a-6ea2a62d453c')`,
          filter: 'brightness(60%)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Left Side - Info Section */}
        <div className="relative z-10 flex flex-col justify-center h-1/3 md:h-full w-full md:w-1/2 p-6 md:p-10 text-white bg-black bg-opacity-50">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Welcome Back to BuzzFlix!</h2>
          <p className="mb-2 md:mb-4 text-base md:text-lg">
            Dive back into your favorite trailers, and discover what's new in the world of movies and series.
            BuzzFlix is your gateway to a world of excitement, mystery, and entertainment.
          </p>
          <p className="mb-2 md:mb-4 hidden md:flex text-base md:text-lg">
            Reconnect with the stories you love and find out what's next. Let's continue the journey together!
          </p>
        </div>

        {/* Right Side - Log In Form */}
        <div className="relative z-10 flex flex-col items-center justify-center h-2/3 md:h-full w-full md:w-1/2 p-6 md:p-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-20 backdrop-blur-sm p-6 md:p-10 rounded-lg shadow-lg max-w-sm w-full"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">Log In</h1>
            <p className="mb-6 md:mb-8 text-center text-white">Access your account</p>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-6 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
            <button type="submit" className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg mb-4">
              Log In
            </button>
            <button className="w-full flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300">
              Don't have an account? Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default LogIn;
