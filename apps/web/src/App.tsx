import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PasswordGenerator from './pages/password/Generator';
import PasswordLeak from './pages/password/Leak';
import CidrCalculator from './pages/network/Cidr';
import EpochConverter from './pages/epoch/Converter';
import './i18n';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="password">
            <Route path="generator" element={<PasswordGenerator />} />
            <Route path="leak" element={<PasswordLeak />} />
          </Route>
          <Route path="network">
            <Route path="cidr" element={<CidrCalculator />} />
          </Route>
          <Route path="epoch">
            <Route path="converter" element={<EpochConverter />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
