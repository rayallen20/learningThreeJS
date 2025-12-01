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

// 创建父正方体
const parentGeometry = new THREE.BoxGeometry(1, 1, 1)
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
// 启用线框模式
parentMaterial.wireframe = true
const parentCube = new THREE.Mesh(parentGeometry, parentMaterial)

parentCube.position.set(-2, 0, 0)

parentCube.scale.set(2, 2, 2)

scene.add(parentCube)

// 创建子正方体
const sonGeometry = new THREE.BoxGeometry(1, 1, 1)
const sonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sonCube = new THREE.Mesh(sonGeometry, sonMaterial)

sonCube.position.set(4, 0, 0)
parentCube.add(sonCube)

console.log(sonCube.getWorldPosition(new THREE.Vector3()))

camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

// Tips: 如果想要实现全屏 轨道控制器必须绑定到renderer.domElement上
// 不能绑定在 document.body上 否则全屏控制将失效
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.01

function animate() {
    controls.update()

    if (parentCube.rotation.x === Math.PI * 2) {
        parentCube.rotation.x = 0
    }

    // 父元素的旋转也同样会影响到子元素
    parentCube.rotation.x += 0.01

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
// 第1个参数是对象 第2个参数是对象中的属性名称 如果属性是一个方法 那么这个控件就是一个按钮
// name方法是给控件添加一个名字 这个名字就是按钮的文本内容
// gui.add(eventObj, 'fullScreen').name('全屏')
// gui.add(eventObj, 'exitFullScreen').name('退出全屏')

// 创建分组
const folder = gui.addFolder('立方体位置控制')
// 默认打开分组
folder.open()

// 控制立方体在3个轴上的位置
// 数值类的属性 则在GUI上的表现是一个滑动条
folder.add(sonCube.position, 'x').min(-10).max(10).step(0.1).name('子立方体X位置').onChange(changeValueHandle)
folder.add(sonCube.position, 'y').min(-8).max(8).step(0.2).name('子立方体Y位置').onFinishChange(changeValueFinishHandle)
folder.add(sonCube.position, 'z').min(-6).max(6).step(0.3).name('子立方体Z位置').onChange(changeValueHandle)

function changeValueHandle(value) {
    console.log("拖动了滑动条")
    console.log(value)
}

function changeValueFinishHandle(value) {
    console.log("停止拖动了")
    console.log(value)
}

// 布尔值类型的属性 在GUI上表现为一个单选框
gui.add(parentMaterial, 'wireframe').name('父立方体材质是否启用线框模式')

const sonCubeColor = {
    color: 0x00ff00,
}

// 颜色类型的属性 在GUI上表现为一个颜色选择器
gui.addColor(sonCubeColor, 'color').name('子立方体颜色').onChange((value) => {
    sonMaterial.color.set(value)
})
