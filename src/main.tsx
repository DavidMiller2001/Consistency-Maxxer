import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root>
      <App />
    </Root>
  </StrictMode>,
);

function Root(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      {children}
    </ThemeProvider>
  );
}
