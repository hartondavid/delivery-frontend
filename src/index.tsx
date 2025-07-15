import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import Auth from './layouts/Auth';
import { ThemeProvider } from '@emotion/react';
import theme from './theme/Default';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/auth/*" element={<Auth />} />
                    <Route path="*" element={<Auth />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

root.render(<App />);

reportWebVitals(); 