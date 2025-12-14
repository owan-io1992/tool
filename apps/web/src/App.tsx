import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PasswordGenerator from './pages/secret/Generator';
import Base64Converter from './pages/secret/Base64';
import CidrCalculator from './pages/network/Cidr';
import EpochConverter from './pages/time/Converter';
import './i18n';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="secret">
            <Route path="generator" element={<PasswordGenerator />} />
            <Route path="base64" element={<Base64Converter />} />
          </Route>
          <Route path="network">
            <Route path="cidr" element={<CidrCalculator />} />
          </Route>
          <Route path="time">
            <Route path="converter" element={<EpochConverter />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
