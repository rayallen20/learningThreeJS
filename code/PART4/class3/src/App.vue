<template>
    <div></div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import gsap from 'gsap'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { Water } from 'three/examples/jsm/objects/Water2'
// import GUI from "three/examples/jsm/libs/lil-gui.module.min"

// eslint-disable-next-line
defineOptions({
    name: 'App'
})

// 初始化场景
const scene = new THREE.Scene()

// 初始化相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// Tips: 这里的位置是他找好的
camera.position.set(-3.23, 2.98, 4.06)
// 更新投影矩阵
camera.updateProjectionMatrix()

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    // 设置开启抗锯齿
    antialias: true,
    // 设置按物理光照模式渲染
    physicallyCorrectLights: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
// 设置输出颜色空间为sRGB
renderer.outputColorSpace = THREE.SRGBColorSpace
// 设置渲染器色调映射
// THREE.ACESFilmicToneMapping: 更加接近电影的色调映射效果
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 设置色调映射曝光度 默认值为1 值越小则越暗
renderer.toneMappingExposure = 0.5
// 允许渲染器进行阴影计算
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 开启阻尼效果
controls.enableDamping = true

// 加载模型
// 实例化draco解码器
const dracoLoader = new DRACOLoader()
// 设置draco解码器路径
dracoLoader.setDecoderPath('/draco/')
// 实例化gltf加载器
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/scene.glb', (gltf) => {
    const model = gltf.scene

    // 隐藏地面
    model.traverse((child) => {
        if (child.name === 'Plane') {
            child.visible = false
        }

        if (child.isMesh) {
            // 允许模型中的每个网格模型都投射阴影
            child.castShadow = true
            // 允许模型中的每个网格模型都接收阴影
            child.receiveShadow = true
        }
    })

    scene.add(model)
})

// 添加平行光 否则看不到模型
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 50, 0)
scene.add(directionalLight)

// 添加环境贴图
const hdrLoader = new HDRLoader()
hdrLoader.load('/textures/sky.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = envMap
    scene.background = envMap
})

// 添加水面网格模型
// 创建水面几何体
const waterGeometry = new THREE.CircleGeometry(300, 32)
// 创建水面网格模型 这里的网格模型是Three.js自带的 可以通过一些选项设置材质
const water = new Water(waterGeometry, {
    // 设置材质分辨率
    textureWidth: 1024,
    textureHeight: 1024,
    // 设置材质颜色
    color: 0xeeeeff,
    // 设置水流方向
    flowDirection: new THREE.Vector2(1, 1),
    // 设置水面缩放比例
    // 缩放比例越小则水面波纹越密集 看起来越靠近水面
    // 缩放比例越大则水面波纹越稀疏 看起来越远离水面
    scale: 100,
})

water.rotation.x = -Math.PI / 2
water.position.y = -0.4

scene.add(water)

// 添加房间内的点光源
const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(0.1, 2.4, 0)
// 允许投射阴影
pointLight.castShadow = true
scene.add(pointLight)

// 添加幽灵运动的点光源
// 由于有3个点光源 所以创建一个组来管理它们
const ghostSphereGroup = new THREE.Group()

const ghostSphereCollection = []

// 由于3个幽灵运动的点光源都是绕着一个圆柱体运动的
// 所以设置一个半径来统一管理它们的运动轨迹
const radius = 3

for (let i = 0; i < 3; i++) {
    const ghostLight = new THREE.PointLight(0xffffff, 50)
    // ghostLight.castShadow = true

    const ghostSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const ghostSphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        // 设置自发光颜色
        emissive: 0xffffff,
        // 设置自发光强度
        emissiveIntensity: 10,
    })
    const ghostSphere = new THREE.Mesh(ghostSphereGeometry, ghostSphereMaterial)
    ghostSphere.position.set(
        // 实际上就是画了一个圆 每个点分别在这个圆的1/3处 也就是0度 120度 240度的位置上
        radius * Math.cos(i * Math.PI * 2 / 3),
        Math.cos(i * Math.PI * 2 / 3),
        radius * Math.sin(i * Math.PI * 2 / 3),
    )
    ghostSphere.add(ghostLight)

    ghostSphereGroup.add(ghostSphere)
    ghostSphereCollection.push(ghostSphere)
}

ghostSphereGroup.position.set(-8, 2.5, -1.5)

scene.add(ghostSphereGroup)

// 使用补间函数 设置点光源从0到2π的角度循环运动
let options = {
    angle: 0,
}

gsap.to(options, {
    // 要修改的属性
    angle: Math.PI * 2,
    // 补间动画的播放时长 单位: s
    duration: 10,
    // 补间动画重复次数 -1表示无限循环
    repeat: -1,
    // 补间动画的缓动函数
    ease: "linear",
    // 补间动画更新回调
    onUpdate: () => {
        // 根据当前的角度计算每个幽灵点光源的位置
        ghostSphereGroup.rotation.y = options.angle

        ghostSphereCollection.forEach((ghostSphere, index) => {
            ghostSphere.position.set(
                radius * Math.cos((index * 2 * Math.PI) / 3),
                Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
                radius * Math.sin((index * 2 * Math.PI) / 3)
            )
        })
    }
})

function animate() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

canvas {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
}
</style>
