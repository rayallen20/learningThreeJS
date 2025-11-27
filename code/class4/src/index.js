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

const geometry = new THREE.BoxGeometry(1, 1, 1) // 创建一个立方体几何体对象

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // 创建一个基本材质对象

const cube = new THREE.Mesh(geometry, material) // 网格模型对象Mesh 由几何体geometry和材质material组成

scene.add(cube)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0, 0, 0)

// 添加世界坐标辅助器
// 这里的参数5表示坐标轴的长度
const axesHelper = new THREE.AxesHelper(50)
// 将坐标辅助器添加到场景中
scene.add(axesHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 启用阻尼(惯性)
controls.dampingFactor = 0.01 // 阻尼系数 系数越小,惯性的效果越明显
controls.autoRotate = true  // 启用自动旋转
controls.autoRotateSpeed = 2.0 // 自动旋转速度

function animate() {
    // 更新控制器
    controls.update()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()