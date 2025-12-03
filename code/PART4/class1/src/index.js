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

// 添加点光源
const pointLight = new THREE.PointLight(0xff0000, 20)
// pointLight.position.set(2, 2, 2)
pointLight.castShadow = true

// 阴影模糊度
pointLight.shadow.radius = 20
// 阴影分辨率
pointLight.shadow.mapSize.width = 2048
pointLight.shadow.mapSize.height = 2048

// 距离衰减
pointLight.distance = 0

// 衰减速度
pointLight.decay = 0

// scene.add(pointLight)

// 创建一个用于表示点光源球体
const lightSphereGeometry = new THREE.SphereGeometry(0.1, 20, 20)
const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial)
lightSphere.position.set(2, 2, 2)

// 将点光源添加到球体上 这样点光源的位置就和球体位置一样了
lightSphere.add(pointLight)
scene.add(lightSphere)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 15
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()

function animate(time) {
    requestAnimationFrame(animate)

    const elapsedTime = clock.getElapsedTime()

    // 更新球体位置
    lightSphere.position.x = Math.cos(elapsedTime) * 3
    lightSphere.position.y = Math.cos(elapsedTime) * 3
    lightSphere.position.z = Math.sin(elapsedTime) * 3

    controls.update()

    renderer.render(scene, camera)
}

animate(performance.now())

// 创建GUI
const gui = new GUI()
gui.add(sphere.position, 'x').min(-5).max(5).step(0.1).name('球体X轴位置')
gui.add(pointLight, 'distance').min(0).max(10).step(0.1).name('点光源距离衰减')
gui.add(pointLight, 'decay').min(0).max(5).step(0.1).name('点光源衰减速度')

gui.add(pointLight.position, 'x').min(-5).max(5).step(0.1).name('点光源X轴位置')
gui.add(pointLight.position, 'y').min(-5).max(5).step(0.1).name('点光源Y轴位置')
gui.add(pointLight.position, 'z').min(-5).max(5).step(0.1).name('点光源Z轴位置')

gui.add(lightSphere.position, 'x').min(-5).max(5).step(0.1).name('发光球体X轴位置')
gui.add(lightSphere.position, 'y').min(-5).max(5).step(0.1).name('发光球体Y轴位置')
gui.add(lightSphere.position, 'z').min(-5).max(5).step(0.1).name('发光球体Z轴位置')
