
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as THREE from 'three';

interface RingChartData {
  category: string;
  value: number;
  maxValue: number;
  color: string;
  description: string;
}

interface Ring3DChartProps {
  data: RingChartData[];
  title: string;
  centerValue?: number;
  centerLabel?: string;
}

// Interactive segment component
const RingSegment: React.FC<{
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: number;
  color: string;
  category: string;
  isHovered: boolean;
  onHover: (category: string | null) => void;
}> = ({ 
  startAngle, endAngle, innerRadius, outerRadius, 
  percentage, color, category, isHovered, onHover 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create ring geometry based on completion percentage
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const completionAngle = startAngle + (endAngle - startAngle) * percentage;
    
    // Create arc for completed portion
    if (percentage > 0) {
      const points: THREE.Vector2[] = [];
      
      // Outer arc
      for (let i = 0; i <= 32; i++) {
        const angle = startAngle + (completionAngle - startAngle) * (i / 32);
        points.push(new THREE.Vector2(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius));
      }
      
      // Inner arc (reverse)
      for (let i = 32; i >= 0; i--) {
        const angle = startAngle + (completionAngle - startAngle) * (i / 32);
        points.push(new THREE.Vector2(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius));
      }
      
      shape.setFromPoints(points);
    }
    
    return new THREE.ShapeGeometry(shape);
  }, [startAngle, endAngle, innerRadius, outerRadius, percentage]);

  // Background ring geometry (incomplete portion)
  const backgroundGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points: THREE.Vector2[] = [];
    
    // Outer arc
    for (let i = 0; i <= 32; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / 32);
      points.push(new THREE.Vector2(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius));
    }
    
    // Inner arc (reverse)
    for (let i = 32; i >= 0; i--) {
      const angle = startAngle + (endAngle - startAngle) * (i / 32);
      points.push(new THREE.Vector2(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius));
    }
    
    shape.setFromPoints(points);
    return new THREE.ShapeGeometry(shape);
  }, [startAngle, endAngle, innerRadius, outerRadius]);

  return (
    <group>
      {/* Background ring */}
      <mesh
        geometry={backgroundGeometry}
        onPointerEnter={() => onHover(category)}
        onPointerLeave={() => onHover(null)}
      >
        <meshStandardMaterial 
          color="#e5e7eb" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Progress ring */}
      {percentage > 0 && (
        <mesh
          ref={meshRef}
          geometry={geometry}
          onPointerEnter={() => onHover(category)}
          onPointerLeave={() => onHover(null)}
          scale={isHovered ? 1.05 : 1}
          position={[0, 0, 0.01]}
        >
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={isHovered ? 0.9 : 0.8}
          />
        </mesh>
      )}
    </group>
  );
};

// 3D Ring Chart Mesh component
const RingChartMesh: React.FC<{ 
  data: RingChartData[];
  centerValue?: number;
  centerLabel?: string;
}> = ({ data, centerValue, centerLabel }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.003; // Slow rotation
    }
  });

  const overallProgress = centerValue || Math.round(
    data.reduce((acc, item) => acc + (item.value / item.maxValue), 0) / data.length * 100
  );

  return (
    <group ref={groupRef}>
      {data.map((item, index) => {
        const percentage = item.value / item.maxValue;
        const startAngle = (index / data.length) * Math.PI * 2;
        const endAngle = ((index + 1) / data.length) * Math.PI * 2;
        const innerRadius = 1.2;
        const outerRadius = 2.0;
        
        return (
          <RingSegment
            key={item.category}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            percentage={percentage}
            color={item.color}
            category={item.category}
            isHovered={hoveredSegment === item.category}
            onHover={setHoveredSegment}
          />
        );
      })}
      
      {/* Center text showing overall completion */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.3}
        color="#374151"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {`${overallProgress}%`}
      </Text>
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.15}
        color="#6B7280"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-regular.woff"
      >
        {centerLabel || 'Complete'}
      </Text>
    </group>
  );
};

// Chart Legend component
const ChartLegend: React.FC<{ data: RingChartData[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs mt-4 px-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate">
            {item.category}: {Math.round((item.value / item.maxValue) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
};

// Main 3D Ring Chart component
export const Ring3DChart: React.FC<Ring3DChartProps> = ({ 
  data, 
  title, 
  centerValue, 
  centerLabel 
}) => {
  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-center text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <div className="ring-chart-container h-full w-full">
          <Canvas 
            camera={{ position: [0, 0, 4], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 5, 5]} intensity={0.4} />
            <RingChartMesh 
              data={data} 
              centerValue={centerValue}
              centerLabel={centerLabel}
            />
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              autoRotate={false}
              dampingFactor={0.1}
              enableDamping={true}
            />
          </Canvas>
        </div>
        <ChartLegend data={data} />
      </CardContent>
    </Card>
  );
};
