import { createConsumer } from '@rails/actioncable';

// The backend typically exposes ActionCable on /cable
// If the API runs on port 3000, we connect to ws://localhost:3000/cable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const WS_URL = API_URL.replace(/^http/, 'ws') + '/cable';

// Create a single consumer connection to be shared across the application
export const consumer = createConsumer(WS_URL);
