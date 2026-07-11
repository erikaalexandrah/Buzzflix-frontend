import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import React from 'react';

const EditProfile = () => {
  const inputClass =
    "b-border mb-4 w-full bg-paper px-4 py-3 text-base font-medium placeholder-ink/30 focus:bg-buzz focus:outline-none";

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Side - Info Section */}
        <div className="flex w-full flex-col justify-center border-b-2 border-ink bg-electric px-6 py-12 text-paper md:w-1/2 md:border-b-0 md:border-r-2 md:p-16">
          <a href="/" className="b-border mb-8 w-fit bg-buzz px-3 py-1.5 font-display text-xl uppercase tracking-tight text-ink shadow-brutal">
            Buzzflix
          </a>
          <h2 className="b-display text-5xl md:text-7xl">Edita tu<br />perfil</h2>
          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-paper/90 md:text-lg">
            Personaliza tu experiencia. Usamos esta información para darte mejores recomendaciones
            de trailers y nunca la compartimos con terceros.
          </p>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex w-full items-center justify-center bg-paper px-6 py-12 md:w-1/2 md:p-16">
          <div className="b-card w-full max-w-md bg-paper p-7 md:p-9">
            <h1 className="b-display mb-7 text-3xl md:text-4xl">Tus datos</h1>
            <form>
              <input type="text" placeholder="Usuario" className={inputClass} />
              <input type="email" placeholder="Email" className={inputClass} />
              <input type="password" placeholder="Nueva contraseña" className={inputClass} />
              <select multiple className={`${inputClass} h-32`}>
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Sci-Fi</option>
                <option>Horror</option>
              </select>
              <button className="b-btn w-full bg-buzz text-base">Guardar cambios</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
