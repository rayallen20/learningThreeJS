<template>
    <div></div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
// import gsap from 'gsap'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { Water } from 'three/examples/jsm/objects/Water2'

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
})
renderer.setSize(window.innerWidth, window.innerHeight)
// 设置输出颜色空间为sRGB
renderer.outputColorSpace = THREE.SRGBColorSpace
// 设置渲染器色调映射
// THREE.ACESFilmicToneMapping: 更加接近电影的色调映射效果
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 设置色调映射曝光度 默认值为1 值越小则越暗
renderer.toneMappingExposure = 0.5
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
