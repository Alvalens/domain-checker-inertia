import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row p-6 gap-4 sm:gap-0">
      <div className="flex flex-row justify-between items-center w-full sm:w-auto">
        <div className="font-bold text-3xl mx-5">logo</div>
        <button className="sm:hidden text-3xl" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`flex-col sm:flex-row items-start w-full sm:w-auto ${
          isOpen ? "flex justify-center items-center" : "hidden"
        } sm:flex`}
      >
        <ul className="flex flex-col sm:flex-row gap-4 md:ms-5 items-center">
          <li>Website</li>
          <li>Hosting</li>
          <li>Domain</li>
          <li>VPS</li>
          <li>Email</li>
          <li>Add-on</li>
        </ul>
      </div>
      <div className="mt-4 sm:mt-0 sm:ms-auto sm:me-5 hidden md:block">
        <button className="rounded-3xl border-2 px-3 py-1 border-black font-semibold">
          Login
        </button>
      </div>
    </div>
  );
}
