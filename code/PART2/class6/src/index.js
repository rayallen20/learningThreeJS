import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'

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

// 创建3个球体
const sphereGeometry1 = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1)
sphere1.position.x = -3
scene.add(sphere1)

const sphereGeometry2 = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2)
sphere2.position.x = 0
scene.add(sphere2)

const sphereGeometry3 = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial3 = new THREE.MeshBasicMaterial({ color: 0xff00ff })
const sphere3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3)
sphere3.position.x = 3
scene.add(sphere3)

const box1 = new THREE.Box3()
box1.setFromObject(sphere1)

const box2 = new THREE.Box3()
box2.setFromObject(sphere2)

const box3 = new THREE.Box3()
box3.setFromObject(sphere3)

// 计算包含所有球体的包围盒
const multiBoundingBox = box1.union(box2).union(box3)

const boxHelper = new THREE.Box3Helper(multiBoundingBox, 0xffff00)
scene.add(boxHelper)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 15
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function animate(time) {
    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)
}

animate(performance.now())

// 创建GUI
const gui = new GUI()
