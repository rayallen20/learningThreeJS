import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

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

// 创建一个比较长的长方体 以便观察雾的效果
const geometry = new THREE.BoxGeometry(1, 1, 100)
const materialParam = {
    color: 0x00ff00,
}
const material = new THREE.MeshBasicMaterial(materialParam)
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 创建场景雾
const fog = new THREE.FogExp2(0xcccccc, 0.1)
scene.fog = fog
// 注意: 设置场景的背景颜色和雾的颜色相同 看起来才像有雾的效果
scene.background = new THREE.Color(0xcccccc)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
    controls.update()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()

// 创建GUI
const gui = new GUI()
gui.add(fog, 'density').min(0.1).max(1).step(0.01).name('雾浓度')
