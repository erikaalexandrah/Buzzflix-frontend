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
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Side - Info Section */}
        <div className="relative flex w-full flex-col justify-center border-b-2 border-ink bg-grape px-6 py-12 text-paper md:w-1/2 md:border-b-0 md:border-r-2 md:p-16">
          <a href="/" className="b-border mb-8 w-fit bg-buzz px-3 py-1.5 font-display text-xl uppercase tracking-tight text-ink shadow-brutal">
            Buzzflix
          </a>
          <h2 className="b-display text-5xl md:text-7xl">
            Bienvenido<br />de nuevo
          </h2>
          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-paper/90 md:text-lg">
            Retoma tus trailers favoritos y descubre los estrenos del cine y las series.
            Tu puerta de entrada al entretenimiento, sin spoilers.
          </p>
        </div>

        {/* Right Side - Log In Form */}
        <div className="flex w-full items-center justify-center bg-paper px-6 py-12 md:w-1/2 md:p-16">
          <form onSubmit={handleSubmit} className="b-card w-full max-w-sm bg-paper p-7 md:p-9">
            <h1 className="b-display text-3xl md:text-4xl">Iniciar sesión</h1>
            <p className="mb-7 mt-1 text-sm font-bold uppercase tracking-tight text-ink/50">Accede a tu cuenta</p>

            <label className="mb-2 block text-xs font-bold uppercase tracking-tight">Usuario</label>
            <input
              type="text"
              name="username"
              placeholder="tu usuario"
              value={formData.username}
              onChange={handleChange}
              className="b-border mb-5 w-full bg-paper px-4 py-3 text-base font-medium placeholder-ink/30 focus:bg-buzz focus:outline-none"
              required
            />

            <label className="mb-2 block text-xs font-bold uppercase tracking-tight">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="b-border mb-7 w-full bg-paper px-4 py-3 text-base font-medium placeholder-ink/30 focus:bg-buzz focus:outline-none"
              required
            />

            <button type="submit" className="b-btn w-full bg-buzz text-base">
              Iniciar sesión
            </button>
            <p className="mt-5 text-center text-sm font-medium">
              ¿No tienes cuenta?{' '}
              <a href="/signin" className="font-bold underline decoration-2 underline-offset-2 hover:text-grape">
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default LogIn;
