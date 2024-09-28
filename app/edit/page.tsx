import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import React from 'react';

const EditProfile = () => {
  return (
    <>
      <Navbar />
      <div
        className="relative w-full min-h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/powerleds-49579.appspot.com/o/buzzflix-edit-profile.jpg?alt=media&token=0c67d494-55f3-41b7-9e68-daf6b00eccce')`,
          filter: 'brightness(60%)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Left Side - Info Section */}
        <div className="relative z-10 flex flex-col justify-center h-full w-full md:w-1/2 p-10 text-white bg-black bg-opacity-50">
          <div className="flex flex-col justify-center h-full min-h-screen">
            <h2 className="text-5xl font-bold mb-6 ">Edit Your Profile</h2>
            <p className="mb-4 text-lg ">
              Customize your BuzzFlix experience by updating your profile information. This helps us
              provide you with better trailer recommendations and a more personalized experience.
            </p>
            <p className="mb-4 text-lg ">
              Remember, your privacy is important to us. We only use this information to enhance
              your BuzzFlix experience and never share it with third parties.
            </p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full md:w-1/2 p-10">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm p-10 rounded-lg shadow-lg max-w-lg w-full">
            <h1 className="text-4xl font-bold mb-4 text-center text-white">Your Profile Details</h1>
            <form>
              <input
                type="text"
                placeholder="Username"
                className="w-full mb-4 px-4 py-2 text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-2 text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full mb-6 px-4 py-2 text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              <select
                multiple
                className="w-full mb-4 px-4 py-2 text-lg rounded-md bg-white bg-opacity-50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Sci-Fi</option>
                <option>Horror</option>
              </select>
              <button className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg transition duration-300">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
