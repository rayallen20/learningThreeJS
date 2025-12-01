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
    0, 0,  // 点D的UV
])
// uv是每2个元素为一组数据
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))


// 创建材质
const material = new THREE.MeshBasicMaterial( {
    map: uvTexture,
})

// 创建网格模型
const mesh = new THREE.Mesh(geometry, material)
mesh.position.x = 10
scene.add(mesh)

console.log(planeGeometry)

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
