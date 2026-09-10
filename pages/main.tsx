import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/app/globals.css';
import { VisitorCompanion } from '@/components/visitor-companion';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Curtis Orchard app root was not found.');
}

createRoot(root).render(
  <StrictMode>
    <VisitorCompanion />
  </StrictMode>,
);
