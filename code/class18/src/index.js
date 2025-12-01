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

// 创建3个球体
const sphereGeometry1 = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1)
sphere1.position.x = -3
scene.add(sphere1)

const sphereGeometry2 = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2)
sphere2.position.x = 0
scene.add(sphere2)

const sphereGeometry3 = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial3 = new THREE.MeshBasicMaterial({ color: 0xff00ff })
const sphere3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3)
sphere3.position.x = 3
scene.add(sphere3)

// 创建射线
// 0.180+的版本中,创建射线对象时,这4个参数可以都不传
// origin: 射线起点,类型为THREE.Vector3,默认值为(0,0,0)
// direction: 射线方向,类型为THREE.Vector3,默认值为(0,0,-1)
// near: 最近检测距离,比这个距离近的物体不会被检测到,默认值为0
// far: 最远检测距离,比这个距离远的物体不会被检测到,默认值为Infinity
const raycaster = new THREE.Raycaster(  new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1).normalize(),
    0,
    Infinity)
// 创建一个二维向量 该向量表示鼠标在屏幕上的位置
const mouse = new THREE.Vector2()

window.addEventListener('click', (event) => {
    // console.log(event.clientX, event.clientY)

    // (鼠标坐标 / 窗口宽高) * 2是因为X轴有正负2个范围,每个范围各一半
    // 也就是说NDC坐标系的X轴范围是-1到1,总共2个单位;而从NDC坐标的原点到最右边是1个单位,所以这里要乘以2
    // 换言之 (鼠标坐标 / 窗口宽高) * 2的值∈ [0, 2]
    // 再减去1之后这个值的范围就变成了[-1, 1],正好符合NDC坐标系的范围
    const ndcX = (event.clientX / window.innerWidth) * 2 - 1

    // 这里计算NDC坐标系的Y轴时要取反是因为浏览器的坐标系Y轴是向下为正,而NDC坐标系Y轴是向上为正
    const ndcY = -(event.clientY / window.innerHeight) * 2 + 1

    // 更新表示鼠标NDC坐标系的二维向量
    mouse.x = ndcX
    mouse.y = ndcY

    // 根据相机和鼠标的位置 更新射线
    // 第1个参数: 鼠标的NDC坐标系位置
    // 第2个参数: 相机
    raycaster.setFromCamera(mouse, camera)

    // 在给定的物体中检测哪些物体与射线相交
    // 这里要注意: 不能写 scene.children
    // 因为此时场景中除了有3个球体之外 还有一个辅助坐标系
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3])
    for (const intersect of intersects) {
        // 若物体已经被选中过 则恢复原来的颜色 并跳过本次循环
        if (intersect.object._isSelected) {
            console.log(intersect.object._originColor)
            intersect.object.material.color = intersect.object._originColor
            intersect.object._isSelected = false
            continue
        }

        // 先记录物体的选中状态和修改前的颜色
        // 注意: 这2个属性是自定义的
        intersect.object._isSelected = true
        // 注意这里要克隆原来的颜色 否则会因为intersect.object.material.color是引用类型
        // 导致后面修改颜色时_originColor也已经是修改后的颜色了
        intersect.object._originColor = intersect.object.material.color.clone()

        // 在修改被点击的物体的材质的颜色
        intersect.object.material.color.set(0xff0000)
    }
})

camera.position.x = 2
camera.position.y = 2
camera.position.z = 15
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
    controls.update()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()

// 创建GUI
const gui = new GUI()
