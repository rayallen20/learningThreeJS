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
const planeGeometry = new THREE.PlaneGeometry(10, 10)
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
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// 设置光源位置
directionalLight.position.set(10, 10, 10)
// 开启光源投射阴影
directionalLight.castShadow = true
// 设置阴影模糊度
directionalLight.shadow.radius = 20
// 设置阴影贴图分辨率
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

// 调整平行光的投射阴影相机属性
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.left = -5
directionalLight.shadow.camera.right = 5
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.bottom = -5

scene.add(directionalLight)

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
gui.add(directionalLight.shadow.camera, 'near').min(0).max(30).step(0.1).onChange(() => {
    // 在相机的属性改变后 需要调用updateProjectionMatrix()方法才能使属性变更生效
    directionalLight.shadow.camera.updateProjectionMatrix()
})
