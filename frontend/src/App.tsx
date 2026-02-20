import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="font-sans antialiased">
                    <Navbar />
                    <AppRouter />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
