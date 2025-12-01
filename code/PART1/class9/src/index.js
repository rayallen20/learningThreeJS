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
// 注意这里只有4个顶点 不再是6个顶点了
const vertices = new Float32Array([
    -1.0, -1.0, 1.0,    // 点A
    1.0, -1.0, 1.0,     // 点B
    1.0, 1.0, 1.0,      // 点C
    -1.0, 1.0, 1.0,     // 点D
])

// 设置顶点的位置属性
// 这里的第1个参数表示设置的是位置属性 位置属性的类型是BufferAttribute
// 第2个参数中的3表示在vertices这个一维数组中 每3个数表示1个顶点的位置(x, y, z)
// 实际上这个3就是 BufferAttribute.itemSize 也就是 geometry.attributes.position.itemSize
geometry.setAttribute( 'position', new THREE.BufferAttribute(vertices, 3))

// 使用索引绘制
const indices = new Uint16Array([
    // 这里的 0 1 2 表示使用第0个顶点 第1个顶点 第2个顶点组成一个三角形
    0, 1, 2,
    // 这里的 2 3 0 表示使用第2个顶点 第3个顶点 第0个顶点组成一个三角形
    // 也就是说 2个三角形共用了 第2个顶点 和 第3个顶点
    2, 3, 0,
])
// 这里1这个参数的含义其实和设置position时的功能是一样的
// 只不过设置position时 每3个数表示1个顶点的位置
// 而设置索引时 每1个数表示1个顶点的索引
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 创建材质
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00})
material.wireframe = true

// 创建网格模型
const mesh = new THREE.Mesh(geometry, material)
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

