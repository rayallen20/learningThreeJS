import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
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

// 创建hdr环境贴图加载器
const hdrLoader = new HDRLoader()

// 加载环境贴图
hdrLoader.load('../assets/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 设置环境贴图的映射方式
    envMap.mapping = THREE.EquirectangularReflectionMapping

    // 为场景设置背景图
    scene.background = envMap

    // 为场景设置环境贴图
    scene.environment = envMap
})

// 实例化GLTF加载器
const gltfLoader = new GLTFLoader()
// 实例化DRACO解码器
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../assets/draco/')
// 将DRACO解码器传递给GLTF加载器
gltfLoader.setDRACOLoader(dracoLoader)

// 加载GLTF模型
gltfLoader.load('../assets/futuristic_building.glb', (gltf) => {
    const root = gltf.scene

    root.traverse((child) => {
        if (child.isMesh) {
            // 创建线框几何体
            const wireGeometry = new THREE.WireframeGeometry(child.geometry)

            // 创建线框线材质
            const wireMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
            })

            // 创建线框线网格
            const wiresLine = new THREE.LineSegments(
                wireGeometry,
                wireMaterial
            )

            // 获取子网格的世界变换矩阵
            child.updateWorldMatrix(true, false)
            const worldMatrix = child.matrixWorld

            // 将线框线网格应用子网格的世界变换矩阵
            wiresLine.applyMatrix4(worldMatrix)

            // 解构位置 旋转和缩放
            // quaternion: 用于表示旋转的四元数
            wiresLine.matrix.decompose(wiresLine.position, wiresLine.quaternion, wiresLine.scale)

            // 将边缘线网格添加到场景中
            scene.add(wiresLine)
        }
    })

    // scene.add(root)
})

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
