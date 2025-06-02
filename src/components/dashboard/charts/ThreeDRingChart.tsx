
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, RingGeometry, MeshBasicMaterial } from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface RingData {
  label: string;
  value: number;
  total: number;
  color: string;
}

interface ThreeDRingChartProps {
  data: RingData[];
  title: string;
  centerValue?: number;
  centerLabel?: string;
}

const AnimatedRing: React.FC<{
  progress: number;
  color: string;
  radius: number;
  thickness: number;
}> = ({ progress, color, radius, thickness }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  const geometry = new RingGeometry(
    radius - thickness / 2,
    radius + thickness / 2,
    16,
    32,
    0,
    (progress / 100) * Math.PI * 2
  );

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};

const ThreeDScene: React.FC<{ data: RingData[]; centerValue?: number }> = ({ 
  data, 
  centerValue 
}) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {data.map((item, index) => {
        const progress = (item.value / item.total) * 100;
        const radius = 2 - index * 0.3;
        
        return (
          <AnimatedRing
            key={item.label}
            progress={progress}
            color={item.color}
            radius={radius}
            thickness={0.2}
          />
        );
      })}
      
      {centerValue && (
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#f8fafc" transparent opacity={0.9} />
        </mesh>
      )}
    </Canvas>
  );
};

export const ThreeDRingChart: React.FC<ThreeDRingChartProps> = ({
  data,
  title,
  centerValue,
  centerLabel
}) => {
  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative h-64">
        <ThreeDScene data={data} centerValue={centerValue} />
        
        {centerValue && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {centerValue}%
              </div>
              {centerLabel && (
                <div className="text-sm text-gray-600">{centerLabel}</div>
              )}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.map((item) => (
              <div key={item.label} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}: {Math.round((item.value / item.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
