import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SimpleDashboard } from './components/SimpleDashboard';
import { Demo } from './pages/Demo';
import { Archive } from './pages/Archive';
// import { IntelligenceDashboard } from './components/IntelligenceDashboard';
import './App.css';
// import './styles/dashboard.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/week/:year/:week" element={<SimpleDashboard />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App
