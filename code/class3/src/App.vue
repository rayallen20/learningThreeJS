<template>
    <div class="app"></div>
</template>

<script setup>
import * as THREE from 'three'

// eslint-disable-next-line
defineOptions({
    name: 'app',
})

// 创建场景
// 以下注释以 https://threejs.org/editor/ 为参考
const scene = new THREE.Scene()

// 创建相机
// 透视相机: 近大远小的相机 和一般人眼睛看到的效果一样
const camera = new THREE.PerspectiveCamera(
    45, // 视角: 在同样的距离下,视角越大,看到的东西越多;视角越小,看到的东西越少
    window.innerWidth / window.innerHeight, // 宽高比: 通常按窗口大小设置即可
    0.1, // 近点: 相机能看到的最近距离,小于该距离的物体将看不到
    1000 // 远点: 相机能看到的最远距离,大于该距离的物体将看不到
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染区域尺寸
document.body.appendChild(renderer.domElement) // 将webgl渲染的canvas内容添加到body中 这里的renderer.domElement就是canvas元素

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1) // 创建一个立方体几何体对象

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // 创建一个基本材质对象

// 根据几何体和材质创建物体(网格模型)
const cube = new THREE.Mesh(geometry, material) // 网格模型对象Mesh 由几何体geometry和材质material组成

// 将网格模型添加到场景中
scene.add(cube)

// 设置相机位置
// 蓝色轴是Z轴,红色轴是X轴,绿色轴是Y轴
// Z轴: 射向人眼的方向
// X轴: 水平向右
// Y轴: 垂直向上
camera.position.z = 5 // 设置相机位置Z轴离场景中心5个单位
camera.lookAt(0, 0, 0) // 设置相机方向看向场景中心

// 渲染
// renderer.render(scene, camera)

// 渲染函数
function animate() {
    requestAnimationFrame(animate) // 请求再次执行渲染函数animate 形成渲染循环

    cube.rotation.x += 0.01 // 每次渲染时立方体绕X轴旋转0.01弧度
    cube.rotation.y += 0.01 // 每次渲染时立方体绕Y轴旋转0.01弧度

    renderer.render(scene, camera) // 执行渲染操作
}

animate()
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

canvas {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>
