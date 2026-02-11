import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function CharacterModel() {
  // Place your GLB/GLTF model in public/models/cartoon-character.glb
  const { scene } = useGLTF("/models/cartoon-character.glb");
  return <primitive object={scene} scale={1.5} />;
}

const CharacterScene = () => (
  <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 5, 5]} intensity={1} />
    <CharacterModel />
    <OrbitControls enableZoom={false} />
  </Canvas>
);

export default CharacterScene;
