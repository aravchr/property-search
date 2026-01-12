import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PropertiesList from './components/PropertiesList';
import PropertyDetail from './components/PropertyDetail';
import SearchByCoordinates from './components/SearchByCoordinates';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex gap-6">
      <Link
        to="/"
        className={`text-base hover:underline ${
          location.pathname === '/' ? 'font-bold text-white' : 'text-gray-300'
        }`}
      >
        Properties List
      </Link>
      <Link
        to="/search"
        className={`text-base hover:underline ${
          location.pathname === '/search' ? 'font-bold text-white' : 'text-gray-300'
        }`}
      >
        Search
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#222] text-white">
        <header className="bg-black p-4 mb-4 border-b border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">
              Property Search
            </h1>
            <Navigation />
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<PropertiesList />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/search" element={<SearchByCoordinates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

