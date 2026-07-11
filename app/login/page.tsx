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
            Bienvenido de nuevo
          </h2>
          <p className="max-w-md text-base md:text-lg text-white/70 leading-relaxed">
            Retoma tus trailers favoritos y descubre los estrenos del mundo del cine y las series.
            Tu puerta de entrada al entretenimiento, sin spoilers.
          </p>
        </div>

        {/* Right Side - Log In Form */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-10 md:p-16">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/60 p-8 md:p-10 shadow-2xl backdrop-blur-md"
          >
            <h1 className="mb-1 text-2xl md:text-3xl font-bold text-white">Iniciar sesión</h1>
            <p className="mb-8 text-sm text-white/50">Accede a tu cuenta</p>

            <label className="mb-2 block text-xs font-medium text-white/60">Usuario</label>
            <input
              type="text"
              name="username"
              placeholder="Tu usuario"
              value={formData.username}
              onChange={handleChange}
              className="mb-5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/30 transition focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              required
            />

            <label className="mb-2 block text-xs font-medium text-white/60">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mb-7 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/30 transition focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              required
            />

            <button
              type="submit"
              className="mb-4 w-full rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/85"
            >
              Iniciar sesión
            </button>
            <p className="text-center text-sm text-white/50">
              ¿No tienes cuenta?{' '}
              <a href="/signin" className="font-medium text-white hover:underline">
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
