import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NumbersChart from './pages/NumbersChart';
import LevelSelect from './pages/LevelSelect';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LevelSelect />} />
          <Route path="/chart/:level" element={<NumbersChart />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;