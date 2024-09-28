'use client';
import { useState, ChangeEvent, FormEvent } from "react";
import Footer from "@/components/footer/footer";
import { useUserData } from "@/context/userContext";
import { FormDataSignIn } from "@/config/intefaces";
import { genres, countries } from "@/config/data";
import { registerUser } from "@/config/api";  // Importa la función

const SignIn = () => {
  const { handleLogin } = useUserData(); 
  const [formData, setFormData] = useState<FormDataSignIn>({
    username: "",
    password: "",
    favoriteGenre: "",
    country: "",
    age: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { access_token, ...userData } = await registerUser(formData);  // Usa la función
      handleLogin(access_token, userData); // Llama a handleLogin para guardar el JWT y los datos del usuario
      console.log("User registered successfully");
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error registering user:", (error as any).response?.data);
      // Manejar el error mostrando un mensaje al usuario
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
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Why BuzzFlix?</h2>
          <p className="mb-2 md:mb-4 text-base md:text-lg">
            Trailers are more than just previews. They are an art form that gives you a sneak peek
            into the story, characters, and emotions of a film or series. At BuzzFlix, we believe in the power
            of trailers to build excitement and anticipation.
          </p>
          <p className="mb-2 md:mb-4 hidden md:flex text-base md:text-lg">
            But we also know that trailers should be spoiler-free. That's why we handpick the best trailers
            and offer a platform where you can enjoy them without worrying about ruining the full experience.
          </p>
          <p className="mb-2 md:mb-4 hidden md:flex text-base md:text-lg">
            Whether you're a movie buff, a series addict, or just looking for your next watch, BuzzFlix is the
            place to discover new content while preserving the surprise.
          </p>
          <p className="mb-2 md:mb-4  text-base md:text-lg">
            Join us and dive into a world of incredible trailers, carefully curated for your enjoyment!
          </p>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="relative z-10 flex flex-col items-center justify-center h-2/3 md:h-full w-full md:w-1/2 p-6 md:p-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-20 backdrop-blur-sm p-6 md:p-10 rounded-lg shadow-lg max-w-sm w-full"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">Sign Up</h1>
            <p className="mb-6 md:mb-8 text-center text-white">Create your account</p>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />

            <select
              name="favoriteGenre"
              value={formData.favoriteGenre}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full mb-6 px-4 py-2 text-base md:text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <button type="submit" className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg mb-4">
              Sign Up
            </button>
            <button className="w-full flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300">
              Have an account? Log In
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default SignIn;
