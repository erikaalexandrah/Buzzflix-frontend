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

  const selectClass =
    "w-full mb-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40";
  const inputClass =
    "w-full mb-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/30 transition focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40";

  return (
    <>
      <div className="relative flex min-h-screen flex-col md:flex-row overflow-hidden bg-[#141414]">
        {/* Fondo con imagen y overlay (sin filtro que oscurezca el contenido) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/powerleds-49579.appspot.com/o/buzzflix-login-image.jpg?alt=media&token=f3c0dd13-18b1-4c64-8a6a-6ea2a62d453c')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>

        {/* Left Side - Info Section */}
        <div className="relative z-10 flex flex-col justify-center w-full md:w-1/2 px-6 py-10 md:p-16 text-white">
          <a href="/" className="mb-8 text-2xl font-bold tracking-tight">BuzzFlix</a>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-5">
            ¿Por qué BuzzFlix?
          </h2>
          <p className="max-w-md text-base md:text-lg text-white/70 leading-relaxed mb-4">
            Los trailers son más que adelantos: son una forma de arte que te da un vistazo a la historia,
            los personajes y las emociones de una película o serie.
          </p>
          <p className="hidden md:block max-w-md text-base md:text-lg text-white/70 leading-relaxed">
            Seleccionamos los mejores trailers y te ofrecemos una plataforma para disfrutarlos sin spoilers,
            preservando la sorpresa de cada estreno.
          </p>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-10 md:p-16">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/60 p-8 md:p-10 shadow-2xl backdrop-blur-md"
          >
            <h1 className="mb-1 text-2xl md:text-3xl font-bold text-white">Crear cuenta</h1>
            <p className="mb-8 text-sm text-white/50">Únete a BuzzFlix</p>

            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />

            <select
              name="favoriteGenre"
              value={formData.favoriteGenre}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="" className="bg-[#181818]">Género favorito</option>
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-[#181818]">
                  {genre}
                </option>
              ))}
            </select>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="" className="bg-[#181818]">País</option>
              {countries.map((country) => (
                <option key={country} value={country} className="bg-[#181818]">
                  {country}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="age"
              placeholder="Edad"
              value={formData.age || ''}
              onChange={handleChange}
              className={inputClass}
            />
            <button
              type="submit"
              className="mb-4 w-full rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/85"
            >
              Crear cuenta
            </button>
            <p className="text-center text-sm text-white/50">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="font-medium text-white hover:underline">
                Inicia sesión
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default SignIn;
