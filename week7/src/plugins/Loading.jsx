import { useEffect, useState } from 'react';
import { ClockLoader } from 'react-spinners';

const liquidStyles = {
  root: {
    position: 'relative',
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background:
      'radial-gradient(circle at 20% 20%, #a0c4ff 0, transparent  65%), radial-gradient(circle at 80% 0%, #ffc6ff 0, transparent 40%), radial-gradient(circle at 50% 90%, #bdb2ff 0, transparent 40%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    overflow: 'hidden',
  },
  blurLayer: {
    position: 'absolute',
    inset: '-20%',
    background:
      'radial-gradient(400px 400px at 20% 30%, rgba(255, 255, 255, 0.15), transparent 60%), radial-gradient(500px 500px at 80% 40%, rgba(255, 255, 255, 0.12), transparent 60%), radial-gradient(350px 350px at 60% 80%, rgba(255, 255, 255, 0.1), transparent 60%)',
    filter: 'blur(40px)',
    zIndex: 0,
  },
  glassCard: {
    position: 'relative',
    zIndex: 1,
    width: 'min(420px, 90vw)',
    padding: '48px 40px',
    borderRadius: '28px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    display: 'grid',
    placeItems: 'center',
  },
  loaderOverride: {
    display: 'block',
    margin: '0 auto',
    filter: 'drop-shadow(0 0 14px rgba(179, 163, 208, 0.8))',
  },
  hint: {
    marginTop: '16px',
    color: '#e2e8f0',
    fontSize: '14px',
    letterSpacing: '0.3px',
  },
};

export const Loading = () => {
  return (
    <div style={liquidStyles.root}>
      <div style={liquidStyles.blurLayer} aria-hidden="true" />

      <div style={liquidStyles.glassCard}>
        <ClockLoader
          color="#b3a3d0"
          loading={true}
          cssOverride={liquidStyles.loaderOverride}
          size={250}
          speedMultiplier={2}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};
