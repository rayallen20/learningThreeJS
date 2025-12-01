import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import '../assets/index.css';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

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

// 创建平面几何体
let planeGeometry = new THREE.PlaneGeometry(1, 1)

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('../assets/CityNewYork002_COL_VAR1_1K.png')

// 加载环境遮罩贴图(aoMap)
const aoMapTexture = textureLoader.load('../assets/CityNewYork002_AO_1K.jpg')

// 创建材质
const materialParams = {
    color: new THREE.Color(0xffffff),
    // 指定纹理
    map: texture,
    // 允许透明
    transparent: true,
    // 设置环境遮罩贴图
    aoMap: aoMapTexture,
}

// 使用基础材质
let planeMaterial = new THREE.MeshBasicMaterial(materialParams)
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

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
// 环境遮罩强度越强,则环境光遮蔽效果越明显
gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).step(0.1).name('环境遮罩强度')
