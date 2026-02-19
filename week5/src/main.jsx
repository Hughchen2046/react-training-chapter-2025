import { Profiler,StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/all.scss';

import App from './App.jsx'

const onRender = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
    const hasIterable = interactions && typeof interactions[Symbol.iterator] === 'function';
  const names = hasIterable ? [...interactions].map(i => i.name).join(', ') : 'none';
  console.log(
    `[Profiler] ${id} ${phase} actual=${actualDuration.toFixed(2)}ms base=${baseDuration.toFixed(2)}ms start=${startTime.toFixed(1)} commit=${commitTime.toFixed(1)} interactions=${names}`
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Profiler id="App" onRender={onRender}>
      <App />
    </Profiler>
  </StrictMode>,
)
