import React from 'react';
import { Wind, Sun, Cloud, Umbrella } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-rd-cream text-rd-brown">
      <header className="bg-rd-red text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-playfair font-bold flex items-center">
            <Umbrella className="mr-2" /> Soarkite
          </h1>
          <nav>
            <ul className="flex space-x-4 font-source-serif">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#products" className="hover:underline">Products</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Rest of the component remains the same */}
    </div>
  );
}

export default App;