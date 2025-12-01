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

// 创建四边形平面
const geometry = new THREE.BufferGeometry()

// 设置顶点数据
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

// 设置顶点组
// start: 从第几个索引开始 这里的第几个 是指索引数组中的元素索引 也就是indices数组中的索引
// count: 一共使用多少个索引 start = 0 count = 3 表示 从indices数组的第0个索引开始 使用3个索引 也就是使用 indices[0], indices[1], indices[2]
// materialIndex: 使用第几个材质 在创建THREE.Mesh时 可以传入一个材质数组 mesh = new THREE.Mesh(geometry, [material0, material1]) 这里的编号就是指使用这个数组中的第几个材质
geometry.addGroup(0, 3, 0)
geometry.addGroup(3, 3, 1)

// 创建材质
// 材质0 绿色线框材质
const material0 = new THREE.MeshBasicMaterial( {color: 0x00ff00})
material0.wireframe = true

// 材质1 红色实心材质
const material1 = new THREE.MeshBasicMaterial( {color: 0xff0000})
material1.wireframe = false

// 创建网格模型
const mesh = new THREE.Mesh(geometry, [material0, material1])
scene.add(mesh)
console.log(geometry)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

// Tips: 如果想要实现全屏 轨道控制器必须绑定到renderer.domElement上
// 不能绑定在 document.body上 否则全屏控制将失效
const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
    controls.update()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()

// 监听窗口变化
function resizeHandle() {
    // 重置渲染器宽高比
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 重置相机宽高比(就是创建相机对象时的第2个参数)
    camera.aspect = window.innerWidth / window.innerHeight

    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
}

window.addEventListener('resize', resizeHandle)

function fullScreenHandle() {
    document.body.requestFullscreen().then().catch(console.error)
}

function exitFullScreenHandle() {
    document.exitFullscreen().then().catch(console.error)
}

let eventObj = {
    fullScreen: fullScreenHandle,
    exitFullScreen: exitFullScreenHandle,
}

// 创建GUI
const gui = new GUI()

// 创建分组
const folder = gui.addFolder('立方体位置控制')
// 默认打开分组
folder.open()

