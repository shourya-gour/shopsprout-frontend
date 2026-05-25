import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopSprout from './pages/ShopSprout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopSprout />} />
        <Route path="*" element={<ShopSprout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

