<template>
    <div class="content" :style="{transform: `translate3d(0, -${sceneIndex * 100}vh, 0)`}">
        <!-- 这里每个contentItem都是100vh的 所以鼠标滚动事件触发时 只需要修改父元素的transform属性,上/下移一个屏幕的高度即可 -->
        <div v-for="scene in scenes" :key="scene.text" class="contentItem">
            <h1>{{scene.text}}</h1>
        </div>
    </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import gsap from 'gsap'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'
import { Water } from 'three/examples/jsm/objects/Water2'
import {ref} from "vue";
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
// 设置控制器的旋转中心点
controls.target.set(-8, 2, 0)

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

let scenes = [
    {
        // 切换场景时显示的文字内容
        text: "文本内容1",
        // 切换场景时执行的回调函数 用于改变相机位置
        callback: () => {
            const cameraPosition = new THREE.Vector3(-3.23, 3, 4.06)
            const controlTarget = new THREE.Vector3(-8, 2, 0)
            moveCamera(cameraPosition, controlTarget)
        },
    },
    {
        text: "文本内容2",
        callback: () => {
            const cameraPosition = new THREE.Vector3(7, 0, 23)
            const controlTarget = new THREE.Vector3(0, 0, 0)
            moveCamera(cameraPosition, controlTarget)
        },
    },
    {
        text: "文本内容3",
        callback: () => {
            const cameraPosition = new THREE.Vector3(10, 3, 0)
            const controlTarget = new THREE.Vector3(5, 2, 0)
            moveCamera(cameraPosition, controlTarget)
        },
    },
    {
        text: "文本内容4",
        callback: () => {
            const cameraPosition = new THREE.Vector3(7, 0, 23)
            const controlTarget = new THREE.Vector3(0, 0, 0)
            moveCamera(cameraPosition, controlTarget)
            makeHeart()
        },
    },
    {
        text: "文本内容5",
        callback: () => {
            const cameraPosition = new THREE.Vector3(-20, 1.3, 6.6)
            const controlTarget = new THREE.Vector3(5, 2, 0)
            moveCamera(cameraPosition, controlTarget)
            restoreStars()
        },
    },
]

let sceneIndex = ref(0)

// wheel: 监听鼠标滚轮事件
window.addEventListener("wheel", wheelHandler)

// 正在播放动画的标记位
let isAnimating = false

function wheelHandler(event) {
    if (isAnimating) {
        return
    }

    isAnimating = true

    // event.deltaY: 鼠标滚轮向下滚时为正 向上滚时为负
    if (event.deltaY > 0) {
        sceneIndex.value++
    }

    if (sceneIndex.value > scenes.length - 1) {
        sceneIndex.value = 0
    }

    scenes[sceneIndex.value].callback()

    // 1秒后允许再次触发动画
    setTimeout(() => {
        isAnimating = false
    }, 1000)
}

// timeline: 用于组合多个补间动画
// 移动相机位置的补间动画时间线
const cameraPositionTimeline = gsap.timeline()
// 移动旋转中心位置的补间动画时间线
const controlTargetTimeline = gsap.timeline()

/**
 * 本函数用于移动相机到指定位置并修改旋转中心位置
 * @param {THREE.Vector3} position - 相机目标位置
 * @param {THREE.Vector3} target - 旋转中心位置
 * */
function moveCamera(position, target) {
    cameraPositionTimeline.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: "power2.inOut",
    })

    // 注意: 控制旋转中心是controls.target 而不是camera.lookAt
    // 所以要修改controls.target的点位
    controlTargetTimeline.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1,
        ease: "power2.inOut",
    })
}

// 创建多个星星网格对象
const starGeometry = new THREE.SphereGeometry(0.1, 32, 32)
const starMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10,
})
const starMeshes = new THREE.InstancedMesh(starGeometry, starMaterial, 100)

// 随机分布后的每个星星位置集合
const initStarPositionCollection = []

// 随机分布星星的初始位置
for (let i = 0; i < 100; i++) {
    const x = Math.random() * 100 - 50
    const y = Math.random() * 100 - 50
    const z = Math.random() * 100 - 50
    initStarPositionCollection.push(new THREE.Vector3(x, y, z))

    // 设置每个星星的初始位置
    const matrix = new THREE.Matrix4()
    matrix.setPosition(x, y, z)
    starMeshes.setMatrixAt(i, matrix)
}

scene.add(starMeshes)

// 创建心形路径
// Tips: 其实这个Shape类感觉和canvas的路径API很像
const heartShape = new THREE.Shape()
heartShape.moveTo(25, 25)
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0)
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35)
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95)
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35)
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0)
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25)

// 形成心形后每个星星位置集合
const afterTransformStarPositionCollection = []

// 爱心的中心点
const center = new THREE.Vector3(0, 1, 10)

// 根据路径计算每个点的位置
for (let i = 0; i < 100; i++) {
    const point = heartShape.getPoint(i / 100)

    const pointX = point.x * 0.1 + center.x
    const pointY = point.y * 0.1 + center.y
    // Shape类计算出来的点都是二维的 所以z轴保持不变即可
    const pointZ = center.z

    const pointPosition = new THREE.Vector3(pointX, pointY, pointZ)
    afterTransformStarPositionCollection.push(pointPosition)
}

/**
 * 本函数用于更新每个星星位置 使其排列成心形
 * 在星星运动的过程中 使用补间函数逐渐修改每个星星的位置矩阵
 * */
function makeHeart() {
    const params = {
        time: 0
    }

    gsap.to(params, {
        time: 1,
        // 动画时长为1s
        duration: 1,
        onUpdate: () => {
            for (let i = 0; i < 100; i++) {
                const startPosition = initStarPositionCollection[i]
                const endPosition = afterTransformStarPositionCollection[i]

                // 根据起始位置和终止位置 计算当前位置
                const currentX = startPosition.x + (endPosition.x - startPosition.x) * params.time
                const currentY = startPosition.y + (endPosition.y - startPosition.y) * params.time
                const currentZ = startPosition.z + (endPosition.z - startPosition.z) * params.time

                const matrix = new THREE.Matrix4()
                matrix.setPosition(currentX, currentY, currentZ)
                starMeshes.setMatrixAt(i, matrix)
                starMeshes.instanceMatrix.needsUpdate = true
            }
        }
    })
}

/**
 * 本函数用于使用补间动画复原每颗星星的位置
 * */
function restoreStars() {
    const params = {
        time: 0
    }

    gsap.to(params, {
        time: 1,
        duration: 1,
        onUpdate: () => {
            for (let i = 0; i < 100; i++) {
                const startPosition = afterTransformStarPositionCollection[i]
                const endPosition = initStarPositionCollection[i]

                const currentX = startPosition.x + (endPosition.x - startPosition.x) * params.time
                const currentY = startPosition.y + (endPosition.y - startPosition.y) * params.time
                const currentZ = startPosition.z + (endPosition.z - startPosition.z) * params.time

                const matrix = new THREE.Matrix4()
                matrix.setPosition(currentX, currentY, currentZ)
                starMeshes.setMatrixAt(i, matrix)
                starMeshes.instanceMatrix.needsUpdate = true
            }
        }
    })
}

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

.content {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    /*
    由于该盒子背后的canvas元素上有鼠标滚轮事件的监听 所以设置盒子的鼠标事件失效
     */
    pointer-events: none;
    transition: all 1s;
}

.contentItem {
    width: 100vw;
    height: 100vh;
}

.contentItem h1 {
    padding: 100px;
    font-size: 50px;
    color: white;
}
</style>
