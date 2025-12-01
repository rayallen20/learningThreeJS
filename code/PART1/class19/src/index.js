import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Tween, Group, Easing } from '@tweenjs/tween.js'

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

// 创建1个球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.x = -3
scene.add(sphere)

// 创建补间动画组 (用于更新所有补间动画)
const tweenGroup = new Group()

// 创建补间动画对象
// 第1个参数为需要改变的属性 本例中就是球体的位置
// 第2个参数为补间动画所属的补间动画组
const forward = new Tween(sphere.position, tweenGroup)

// 设置补间动画的目标位置和持续时间
// 持续时间的单位为ms
forward.to({x: 4}, 2000)

// 设置补间动画的延迟时间
forward.delay(1000)

// 设置缓动函数
forward.easing(Easing.Quadratic.In)

const backward = new Tween(sphere.position, tweenGroup)
backward.to({x: -3}, 2000)
backward.delay(1000)
backward.easing(Easing.Quadratic.Out)

// 设置2个补间动画的循环往复
// chain()方法: 用于设置一个补间动画完成后,连接另一个补间动画
forward.chain(backward)
backward.chain(forward)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 15
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)

let started = false

function animate(time) {
    requestAnimationFrame(animate)

    if (!started) {
        forward.start(time)
        started = true
    }

    controls.update()

    tweenGroup.update(time)

    renderer.render(scene, camera)
}

animate(performance.now())

// 创建GUI
const gui = new GUI()
