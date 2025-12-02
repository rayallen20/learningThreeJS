import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'

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

const gltfLoader = new GLTFLoader()
gltfLoader.load('../assets/Duck.glb', (gltf) => {
    console.log(gltf)
    // console.log(gltf.scene.children[0].children[0].name) // 网格模型对象
    // 将模型的场景添加到当前场景中
    scene.add(gltf.scene)

    const duckMesh = scene.getObjectByName('LOD3spShape')
    const duckGeometry = duckMesh.geometry

    // 计算包围盒
    duckGeometry.computeBoundingBox()

    // 设置几何体居中
    duckGeometry.center()

    // 更新世界矩阵
    duckMesh.updateWorldMatrix(true, true)
    // 将包围盒转换到世界坐标系中
    // matrixWorld属性表示Mesh对象的世界矩阵
    duckGeometry.boundingBox.applyMatrix4(duckMesh.matrixWorld)

    // 获取包围盒信息
    const duckBox = duckGeometry.boundingBox

    // 获取包围盒的中心点
    // getCenter()方法需要传入一个Vector3对象作为参数 表示计算出的中心点存放的位置
    const center = duckBox.getCenter(new THREE.Vector3())
    console.log(center)

    // 创建包围盒辅助器
    // 第1个参数: 包围盒对象
    // 第2个参数: 辅助器颜色
    const boxHelper = new THREE.Box3Helper(duckBox, 0xffff00)
    scene.add(boxHelper)

    // 计算包围球
    duckGeometry.computeBoundingSphere()

    // 获取包围球信息
    const duckSphere = duckGeometry.boundingSphere
    // 将包围球转换为世界坐标系
    duckSphere.applyMatrix4(duckMesh.matrixWorld)

    // 自行封装一个包围球辅助器
    const sphereHelper = new THREE.Mesh(
        new THREE.SphereGeometry(duckSphere.radius, 16, 16),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            // 不可被遮挡 因为一般包围球都是用来检测碰撞的 所以需要一直可见
            depthTest: false,
        })
    )

    // 将包围球辅助器放到包围球的中心
    sphereHelper.position.copy(duckSphere.center)
    scene.add(sphereHelper)
})

// 加载环境贴图
// 创建hdr环境贴图加载器
const hdrLoader = new HDRLoader()

// 这里回调函数的形参就是加载好的环境贴图
hdrLoader.load('../assets/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 设置环境贴图的映射方式
    envMap.mapping = THREE.EquirectangularReflectionMapping

    // 为场景设置背景图
    scene.background = envMap

    // 为场景设置环境贴图
    scene.environment = envMap
})

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
