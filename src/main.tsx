import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App/index';
import { AuthProvider } from './components/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Add global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Safely get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
  document.body.innerHTML = '<div>Failed to load the application. Root element not found.</div>';
} else {
  const root = createRoot(rootElement);
  
  // Custom error handler for React errors
  const onError = (error: Error) => {
    console.error("React render error:", error);
    // You might want to send this to an error tracking service
  };

  try {
    root.render(
      <ErrorBoundary>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
              <Toaster position="top-center" />
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Error during initial render:", error);
    onError(error as Error);
    
    // Render a fallback UI
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #333; margin-bottom: 1rem;">Unable to load application</h1>
        <p style="color: #666;">Please try refreshing the page or contact support if the issue persists.</p>
        <button 
          style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;"
          onclick="window.location.reload()">
          Refresh Page
        </button>
      </div>
    `;
  }
}