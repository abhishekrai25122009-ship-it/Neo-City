import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CityScene } from './CityScene';
import { useCityStore } from '../../store/useCityStore';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const CityCanvas: React.FC = () => {
  const shadowQuality = useCityStore((state) => state.graphics.shadowQuality);
  const renderScale = useCityStore((state) => state.graphics.renderScale);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto bg-[#040812]">
      <ErrorBoundary isCanvasBoundary>
        <Canvas
          shadows={shadowQuality !== 'off'}
          camera={{ position: [64, 52, 70], fov: 48, near: 0.5, far: 800 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            toneMapping: 4, // THREE.ACESFilmicToneMapping
            toneMappingExposure: 1.35,
          }}
          dpr={renderScale}
        >
          <Suspense fallback={null}>
            <CityScene />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};
