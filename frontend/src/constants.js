// Check if the app is running locally
export const IS_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Base URL for the backend API
// If running locally, it points to localhost:5000. 
// Otherwise, it falls back to a production URL (which you can set in your environment variables or replace here)
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  IS_DEVELOPMENT 
    ? 'http://localhost:5000' 
    : 'https://intellmeet-ai-powered-enterprise-meeting-2de8.onrender.com'
);

// Full API Base URL
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;

// Socket URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || BACKEND_URL;
