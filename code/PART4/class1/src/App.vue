<template>
    <div></div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
// import gsap from 'gsap'

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
    scene.add(model)
})

// 添加平行光 否则看不到模型
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 50, 0)
scene.add(directionalLight)

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
