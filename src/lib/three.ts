// Re-export commonly used Three.js primitives so individual components
// import from a single location and benefit from tree-shaking later.
export {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  BufferGeometry,
  SphereGeometry,
  CylinderGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  Clock,
  Color,
  TextureLoader,
} from "three";
