import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'

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

// 实例化GLTF加载器
const gltfLoader = new GLTFLoader()

// 加载GLTF模型
// glb: 二进制格式的模型文件
// gltf: JSON格式的模型文件
// 第1个参数: 模型文件的路径
// 第2个参数: 模型加载完成后的回调函数
gltfLoader.load('../assets/city.glb', (gltf) => {
    console.log(gltf)

    scene.background = new THREE.Color(0x999999)
    // 将模型的场景添加到当前场景中
    scene.add(gltf.scene)
})

// 实例化DRACO加载器
const dracoLoader = new DRACOLoader()
// 设置解码器路径
// 这里的路径就是复制`node_modules/three/examples/js/libs/draco/`文件夹到`public/assets/`目录下后的路径
dracoLoader.setDecoderPath('../assets/draco/')
// 将DRACO加载器传递给GLTF加载器
gltfLoader.setDRACOLoader(dracoLoader)

// 加载环境贴图
const hdrLoader = new HDRLoader()
hdrLoader.load('../assets/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 设置环境贴图的映射方式
    envMap.mapping = THREE.EquirectangularReflectionMapping

    // 为场景设置环境贴图
    scene.environment = envMap
})

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
