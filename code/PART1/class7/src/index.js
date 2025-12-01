import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import '../assets/index.css';

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

const btn = document.createElement('button')
btn.innerHTML = '点击全屏'
btn.style.position = 'absolute'
btn.style.top = '20px'
btn.style.left = '20px'

function btnClickHandle() {
    document.body.requestFullscreen().
    then().
    catch()
}

btn.onclick = btnClickHandle
document.body.appendChild(btn)

// 退出全屏按钮
const exitBtn = document.createElement('button')
exitBtn.innerHTML = '退出全屏'
exitBtn.style.position = 'absolute'
exitBtn.style.top = '60px'
exitBtn.style.left = '20px'

function exitBtnClickHandle() {
    document.exitFullscreen().then().catch()
}

exitBtn.onclick = exitBtnClickHandle
document.body.appendChild(exitBtn)