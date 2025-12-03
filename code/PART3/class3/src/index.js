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
// 开启阴影贴图
renderer.shadowMap.enabled = true

// 开启物理上的正确光照模式
renderer.physicallyCorrectLights = true

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建一个球体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
// 注意这里使用的是标准材质而不是之前用过的基础材质
const sphereMaterial = new THREE.MeshStandardMaterial({})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

// 开启投射阴影
sphere.castShadow = true

scene.add(sphere)

// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(50, 50)
const planeMaterial = new THREE.MeshStandardMaterial({})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2

// 开启接收阴影
plane.receiveShadow = true

scene.add(plane)

// 添加环境光
// 第1个参数是光的颜色
// 第二个参数是光的强度
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// 添加聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 20)
spotLight.position.set(5, 5, 5)
spotLight.castShadow = true

// // 设置阴影贴图模糊度
// spotLight.shadow.radius = 20
// // 设置阴影贴图分辨率
// spotLight.shadow.mapSize.width = 2048
// spotLight.shadow.mapSize.height = 2048

// 设置聚光灯照向的物体
spotLight.target = sphere

// 设置聚光灯的角度
spotLight.angle = Math.PI / 6

// 设置聚光灯的距离
spotLight.distance = 0

// 设置聚光灯的边缘柔和度
spotLight.penumbra = 0.1

// 沿光照距离的衰减量
spotLight.decay = 2

scene.add(spotLight)

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
gui.add(sphere.position, 'x').min(-5).max(5).step(0.1).name('球体X轴位置')
gui.add(spotLight, 'angle').min(0).max(Math.PI / 2).step(0.01).name('聚光灯角度')
gui.add(spotLight, 'distance').min(0).max(20).step(0.1).name('聚光灯距离')
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.01).name('聚光灯边缘柔和度')
gui.add(spotLight, 'decay').min(0).max(5).step(0.1).name('聚光灯衰减量')
