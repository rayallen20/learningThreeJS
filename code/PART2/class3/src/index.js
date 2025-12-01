import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper'

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

const loader = new THREE.TextureLoader()
const uvTexture = loader.load('../assets/uv_grid_opengl.jpg')

// 创建1个平面几何体
const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({
    map: uvTexture,
})

const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = -10
scene.add(plane)

// 使用顶点创建平面
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
    -1.0, -1.0, 1.0,    // 点A
    1.0, -1.0, 1.0,     // 点B
    1.0, 1.0, 1.0,      // 点C
    -1.0, 1.0, 1.0,     // 点D
])
geometry.setAttribute( 'position', new THREE.BufferAttribute(vertices, 3))

// 使用索引绘制
const indices = new Uint16Array([
    0, 1, 2,
    2, 3, 0,
])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置UV坐标
// UV的坐标是2维的,每个顶点对应一个UV坐标
const uv = new Float32Array([
    0, 0,  // 点A的UV
    1, 0,  // 点B的UV
    1, 1,  // 点C的UV
    0, 1,  // 点D的UV
])
// uv是每2个元素为一组数据
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

// 设置法向量
geometry.computeVertexNormals()

// 平移几何体的顶点
geometry.translate(4, 0, 0)

// 旋转几何体
geometry.rotateX(Math.PI / 2)

// 缩放几何体
geometry.scale(3, 3, 3)

// 创建材质
const material = new THREE.MeshBasicMaterial( {
    map: uvTexture,
    side: THREE.DoubleSide,
})

// 创建网格模型
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

console.log(mesh)

// 加载环境贴图
// 创建hdr环境贴图加载器
const hdrLoader = new HDRLoader()

// 这里回调函数的形参就是加载好的环境贴图
hdrLoader.load('../assets/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 设置环境贴图的映射方式
    envMap.mapping = THREE.EquirectangularReflectionMapping

    // 为场景设置背景图
    scene.background = envMap

    // 为场景设置环境贴图
    scene.environment = envMap

    // 为平面设置环境贴图
    planeMaterial.envMap = envMap

    // 为自制平面的材质设置环境贴图
    material.envMap = envMap
})

// mesh: 要可视化法线的物体
// size: 法线的长度
// color: 法线的颜色
const helper = new VertexNormalsHelper(mesh, 2.5, 0x00ff00)
scene.add(helper)

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
