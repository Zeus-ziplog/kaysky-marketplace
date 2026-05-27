import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start';
import { startInstance } from './start';

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <StartClient start={startInstance} />
  </StrictMode>
);