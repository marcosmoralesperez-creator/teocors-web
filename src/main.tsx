import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/montserrat';
import '@fontsource/cormorant/latin-500.css';
import '@fontsource/cormorant/latin-500-italic.css';
import '@fontsource/cormorant/latin-600.css';

import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
