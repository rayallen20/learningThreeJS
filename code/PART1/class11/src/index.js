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

// radius: 半径
// height: 高度
// radialSegments: 圆周分段数
// heightSegments: 高度分段数
// openEnded: 是否开口
// thetaStart: 起始弧度
// thetaLength: 旋转弧度
let geometry = new THREE.ConeGeometry(1, 2, 32, 1, false, 0, Math.PI * 2)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true, side: THREE.DoubleSide })
const cone = new THREE.Mesh(geometry, material)
scene.add(cone)

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

gui.add(geometry.parameters, 'radialSegments').min(1).max(128).step(1).name('圆的多边形数量').onChange((value) => {
    let newGeometry = new THREE.ConeGeometry(1, 2, value, geometry.parameters.heightSegments, geometry.parameters.openEnded, 0, Math.PI * 2)

    // 释放旧的几何体并替换
    cone.geometry.dispose()
    cone.geometry = newGeometry
    geometry = newGeometry
})

gui.add(geometry.parameters, 'heightSegments').min(1).max(128).step(1).name('高的多边形数量').onChange((value) => {
    let newGeometry = new THREE.ConeGeometry(1, 2, geometry.parameters.radialSegments, value, geometry.parameters.openEnded, 0, Math.PI * 2)

    // 释放旧的几何体并替换
    cone.geometry.dispose()
    cone.geometry = newGeometry
    geometry = newGeometry
})

gui.add(geometry.parameters, 'openEnded').name('是否开口').onChange((value) => {
    let newGeometry = new THREE.ConeGeometry(1, 2, geometry.parameters.radialSegments, geometry.parameters.heightSegments, value, 0, Math.PI * 2)

    // 释放旧的几何体并替换
    cone.geometry.dispose()
    cone.geometry = newGeometry
    geometry = newGeometry
})