import React from "react";
import videoFile from "../src/assets/HomeVed.mp4";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const Frontpage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
      
      {/* Background Video */}
      <video
        className="w-full h-full object-cover absolute"
        src={videoFile}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white transform scale-y-150 scale-x-150 drop-shadow-md"
          style={{ WebkitTextStroke: "1px black" }}
        >
          The Flower
        </h2>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold transform scale-y-150 scale-x-150 text-white mt-5"
          style={{ WebkitTextStroke: "1px black" }}
        >
          Tradition
        </h2>

        <p
          style={{ WebkitTextStroke: "0.5px black" }}
          className="mt-10 text-base sm:text-lg md:text-xl lg:text-2xl text-white drop-shadow-md"
        >
          Delicious food with tradition and taste.
        </p>

        <Link to="/Homepage1">
          <button className="w-[150px] sm:w-[180px] h-[45px] sm:h-[50px] border-2 mt-8 sm:mt-12 text-white font-bold text-base sm:text-lg rounded-3xl flex items-center justify-center gap-2 hover:shadow-2xl hover:bg-black transition-all duration-300">
            GET STARTED <FaArrowRightLong size={22} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Frontpage;