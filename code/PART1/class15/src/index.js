import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import '../assets/index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'

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

// 创建平面几何体
let planeGeometry = new THREE.PlaneGeometry(1, 1)

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('../assets/CityNewYork002_COL_VAR1_1K.png')
// 设置纹理的颜色空间为sRGB
texture.colorSpace = THREE.SRGBColorSpace
console.log(texture)

// 加载环境遮罩贴图(aoMap)
const aoMapTexture = textureLoader.load('../assets/CityNewYork002_AO_1K.jpg')

// 加载透明度贴图(alphaMap)
const alphaTexture = textureLoader.load('../assets/height.jpg')

// 加载光照贴图
const lightMapTexture = textureLoader.load('../assets/colors.png')

// 加载高光贴图
const specularMapTexture = textureLoader.load('../assets/CityNewYork002_GLOSS_1K.jpg')

// 创建材质
const materialParams = {
    color: new THREE.Color(0xffffff),
    // 指定纹理
    map: texture,
    // 允许透明
    transparent: true,
    // 设置环境遮罩贴图
    aoMap: aoMapTexture,
    // 设置光照贴图
    // lightMap: lightMapTexture,
    // 设置高光贴图
    specularMap: specularMapTexture,
}

// 使用基础材质
let planeMaterial = new THREE.MeshBasicMaterial(materialParams)
let plane = new THREE.Mesh(planeGeometry, planeMaterial)

// 创建hdr环境贴图加载器
const hdrLoader = new HDRLoader()

// 加载环境贴图
// 这里回调函数的形参就是加载好的环境贴图
hdrLoader.load('../assets/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 设置环境贴图的映射方式
    envMap.mapping = THREE.EquirectangularReflectionMapping

    // 为场景设置背景图
    scene.background = envMap

    // 为场景设置环境贴图
    scene.environment = envMap

    // 为平面设置环境贴图
    planeMaterial.envMap = envMap
})

scene.add(plane)

camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
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
// 环境遮罩强度越强,则环境光遮蔽效果越明显
gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).step(0.1).name('环境遮罩强度')

// 反射强度越强,则反射效果越明显
gui.add(planeMaterial, 'reflectivity').min(0).max(1).step(0.1).name('反射强度')

// 改变纹理的色彩空间
const colorSpaceParam = {
    sRGB: THREE.SRGBColorSpace,
    Linear: THREE.LinearSRGBColorSpace,
}
gui.add(texture, 'colorSpace', colorSpaceParam).name('改变纹理色彩空间').onChange(colorSpaceChange)

function colorSpaceChange() {
    // 需要将needsUpdate属性更新为true才能更新
    texture.needsUpdate = true
}
