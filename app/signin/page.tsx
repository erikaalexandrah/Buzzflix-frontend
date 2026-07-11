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
    "b-border mb-5 w-full bg-paper px-4 py-3 text-base font-medium focus:bg-buzz focus:outline-none";
  const inputClass =
    "b-border mb-5 w-full bg-paper px-4 py-3 text-base font-medium placeholder-ink/30 focus:bg-buzz focus:outline-none";

  return (
    <>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Side - Info Section */}
        <div className="relative flex w-full flex-col justify-center border-b-2 border-ink bg-coral px-6 py-12 text-paper md:w-1/2 md:border-b-0 md:border-r-2 md:p-16">
          <a href="/" className="b-border mb-8 w-fit bg-buzz px-3 py-1.5 font-display text-xl uppercase tracking-tight text-ink shadow-brutal">
            Buzzflix
          </a>
          <h2 className="b-display text-5xl md:text-7xl">
            ¿Por qué<br />Buzzflix?
          </h2>
          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-paper/90 md:text-lg">
            Los trailers son más que adelantos: son una forma de arte. Seleccionamos los mejores
            y te los mostramos sin spoilers, preservando la sorpresa de cada estreno.
          </p>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex w-full items-center justify-center bg-paper px-6 py-12 md:w-1/2 md:p-16">
          <form onSubmit={handleSubmit} className="b-card w-full max-w-sm bg-paper p-7 md:p-9">
            <h1 className="b-display text-3xl md:text-4xl">Crear cuenta</h1>
            <p className="mb-7 mt-1 text-sm font-bold uppercase tracking-tight text-ink/50">Únete a Buzzflix</p>

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
              <option value="">Género favorito</option>
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
              className={selectClass}
            >
              <option value="">País</option>
              {countries.map((country) => (
                <option key={country} value={country}>
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
            <button type="submit" className="b-btn w-full bg-buzz text-base">
              Crear cuenta
            </button>
            <p className="mt-5 text-center text-sm font-medium">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="font-bold underline decoration-2 underline-offset-2 hover:text-grape">
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
