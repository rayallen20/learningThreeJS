import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import '../assets/index.css';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建父正方体
const parentGeometry = new THREE.BoxGeometry(1, 1, 1)
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const parentCube = new THREE.Mesh(parentGeometry, parentMaterial)

parentCube.position.set(-2, 0, 0)

// 父元素放大2倍 会影响到子元素一起放大 且会影响到子几何体的局部位移
parentCube.scale.set(2, 2, 2)

scene.add(parentCube)

// 创建子正方体
const sonGeometry = new THREE.BoxGeometry(1, 1, 1)
const sonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sonCube = new THREE.Mesh(sonGeometry, sonMaterial)

// 相对父元素向左移动4个单位
sonCube.position.set(4, 0, 0)
parentCube.add(sonCube)

// 打印结果为 Vector3 {x: 6, y: 0, z: 0} 而不是 Vector3 {x: 4, y: 0, z: 0}
// 这是因为子几何体的局部位置受父几何体的缩放作用影响
// 子几何体的世界坐标 = 父几何体的世界坐标 + (子几何体的局部坐标 * 父几何体的缩放比例)
console.log(sonCube.getWorldPosition(new THREE.Vector3()))

camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.01

function animate() {
    controls.update()

    if (parentCube.rotation.x === Math.PI * 2) {
        parentCube.rotation.x = 0
    }

    // 父元素的旋转也同样会影响到子元素
    parentCube.rotation.x += 0.01

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()