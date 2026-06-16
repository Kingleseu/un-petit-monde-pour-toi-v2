import { useState } from 'react';
import AppShell from './components/AppShell';
import ExternalWordsForm from './components/ExternalWordsForm';
import LandingPage from './components/LandingPage';
import { sampleStory } from './data_v2';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  if (window.location.pathname === '/message') {
    return <ExternalWordsForm />;
  }

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return <AppShell initialStory={sampleStory} />;
}
