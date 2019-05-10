<template>
  <div class="img-container" ref="svgContainer">
    <svg ref="svg" class="rect-container"
      :width="img.width*scaleRect" :height="img.height*scaleRect"
      :style="`background-image:url(${img.url})`">
      <v-line :lineObj="line"/>
      <rect v-for="( item, index ) in rects"
      :key="index"
      :x="item.x*scaleRect" :y="item.y*scaleRect"
      :width="item.w*scaleRect" :height="item.h*scaleRect"
      @click.stop.prevent="fixPointsHandle(index)"
      @mousedown.stop.prevent="moveRectStart(index, $event)"
      @mouseup="moveRectEnd"
      :fill="svgColor" :stroke="svgColor"
      style="stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9;cursor:move"/>
      <v-editpoint :fixedPoints="fixPoints" :activeRectIndex="activeRectIndex" @funcStart="changeRectPointStart" @funcEnd="changeRectPointEnd" :scaleRect="scaleRect"/>
    </svg>
  </div>
</template>

<script>
import line from './utils/Line';
import EditPoint from './utils/EditPoint';
import vm from '@/utils/vm';

export default {
  props: ['img'],
  data() {
    return {
      isDown: false, // 绘制矩形的开关
      fixDown: false, // 修改矩形的开关
      isMove: false, // 移动矩形的开关
      activeFixPosition: 0, // 激活的修改区域
      initPoints: { // 鼠标按下时获取初始坐标
        initX: 0,
        initY: 0,
      },
      rects: [], // 矩形框数据
      fixData: {}, // 被修改的矩形的原始数据
      line: { // 辅助线坐标
        lineX: 0,
        lineY: 0,
      },
      activeRectIndex: 0, // 当前激活的矩形框
      fixPoints: [], // 矩形框对应的修改点位
      moveInitPoints: { // 矩形框移动的初始数据
        initX: 0,
        initY: 0,
        index: 0,
      },
      scaleRect: 1, // 矩形缩放比例
      svgPosition: { // 缩放图片时鼠标相对容器的位置
        positionX: 0,
        positionY: 0,
      },
      svgTop: 0,
      svgLeft: 0,
      svgColor: '#000000', // 边框颜色
    };
  },
  components: {
    'v-line': line,
    'v-editpoint': EditPoint,
  },
  created() {
    // 获取其他组件传来的信息
    vm.$on('deleteRect', () => {
      this.deleteRect();
    });
    vm.$on('changeColor', (color) => {
      this.svgColor = color;
    });
    vm.$on('saveMark', () => {
      this.saveMark();
    });
  },
  mounted() {
    const svgElem = this.$refs.svg;
    const svgContainerElem = this.$refs.svgContainer;
    svgContainerElem.addEventListener('mousemove', (event) => {
      const X = event.offsetX;
      const Y = event.offsetY;
      this.svgPosition.positionX = X;
      this.svgPosition.positionY = Y;
    });
    svgElem.addEventListener('mousedown', (event) => {
      this.isDown = true;
      const initX = event.offsetX;
      const initY = event.offsetY;
      this.initPoints.initX = initX;
      this.initPoints.initY = initY;
      const rectObj = { 
x: 0, y: 0, w: 0, h: 0
 };
      this.rects.push(rectObj);
      this.activeRectIndex = -1; // 按下取消激活框
    });
    svgElem.addEventListener('mousemove', (event) => {
      const scale = this.scaleRect;
      // 辅助线数据
      const lineX = event.offsetX;
      const lineY = event.offsetY;
      this.line.lineX = lineX;
      this.line.lineY = lineY;

      const moveX = event.offsetX;
      const moveY = event.offsetY;
      if (this.isDown) {
        const {initX} = this.initPoints;
        const {initY} = this.initPoints;
        const index = this.rects.length - 1;
        // 计算矩形的x,y,w,h
        if (moveX > initX) {
          this.rects[index].x = initX / scale;
          this.rects[index].w = (moveX - initX) / scale;
        } else {
          this.rects[index].x = moveX / scale;
          this.rects[index].w = (initX - moveX) / scale;
        }
        if (moveY > initY) {
          this.rects[index].y = initY / scale;
          this.rects[index].h = (moveY - initY) / scale;
        } else {
          this.rects[index].y = moveY / scale;
          this.rects[index].h = (initY - moveY) / scale;
        }
      }
      // 监听矩形在svg图层上的修改
      if (this.fixDown) {
        this.changeRectPoint(moveX, moveY);
      }
      // 监听矩形在svg上的移动
      if (this.isMove) {
        this.moveRect(moveX, moveY);
      }
    });
    svgElem.addEventListener('mouseup', (event) => {
      const index = this.rects.length - 1;
      if (this.rects[index].w < 50 && this.rects[index].h < 50) {
        this.rects.pop();
      } else {
        this.fixPointsHandle(index);
      }
      this.isDown = false;
      this.fixDown = false;
    });
    svgElem.addEventListener('mousewheel', (event) => {
      event.stopPropagation();
      event.preventDefault();
      // event.wheelDeltaY的正负表示放大还是缩小
      if (event.wheelDeltaY > 0) {
        this.scaleRect += 0.1;
        // this.svgChangeHandle()
      } else if (event.wheelDeltaY < 0 && this.img.width * this.scaleRect > 320) {
        this.scaleRect -= 0.1;
        // this.svgChangeHandle()
      }
    });
    // 鼠标离开svg图层后退出编辑状态
    svgElem.addEventListener('mouseleave', (event) => {
      this.isDown = false;
      this.fixDown = false;
    });

    this.initContent();
  },
  methods: {
    // 缩放图片位置定位
    svgChangeHandle() {
      this.svgTop = this.svgPosition.positionY * (1 - this.scaleRect);
      this.svgLeft = this.svgPosition.positionX * (1 - this.scaleRect);
    },
    // 为矩形增加八个拖拽点
    fixPointsHandle(index) {
      this.activeRectIndex = index;
      const pointData = this.rects[index];
      const leftTop = { fixedX: pointData.x, fixedY: pointData.y };
      const centerTop = { fixedX: pointData.x + (pointData.w) / 2, fixedY: pointData.y };
      const rightTop = { fixedX: pointData.x + pointData.w, fixedY: pointData.y };
      const centerLeft = { fixedX: pointData.x, fixedY: pointData.y + (pointData.h) / 2 };
      const centerRight = { fixedX: pointData.x + pointData.w, fixedY: pointData.y + (pointData.h) / 2 };
      const leftBottom = { fixedX: pointData.x, fixedY: pointData.y + pointData.h };
      const centerBottom = { fixedX: pointData.x + (pointData.w) / 2, fixedY: pointData.y + pointData.h };
      const rightBottom = { fixedX: pointData.x + pointData.w, fixedY: pointData.y + pointData.h };
      const fixPointArr = [leftTop, centerTop, rightTop, centerLeft, centerRight, leftBottom, centerBottom, rightBottom];
      this.fixPoints = fixPointArr;
      console.log('fixPoints', this.fixPoints);
    },
    changeRectPointStart(position) {
      const {activeRectIndex} = this;
      this.activeFixPosition = position;
      this.fixDown = true;
      this.isDown = false;
      this.fixData = this.rects[activeRectIndex];
      console.log('fixData', this.fixData);
    },
    // 拖拽点更改矩形坐标
    changeRectPoint(xx, yy) {
      const {activeFixPosition} = this;
      const {activeRectIndex} = this;
      const {fixData} = this;
      const scale = this.scaleRect;
      const x = xx / scale;
      const y = yy / scale;
      let fixedObj = {};
      if (activeFixPosition === 1) { // centerTop
        fixedObj = {
          x: fixData.x,
          y: y < fixData.y + fixData.h ? y : (fixData.y + fixData.h),
          w: fixData.w,
          h: y <= (fixData.y + fixData.h) ? fixData.h - (y - fixData.y) : (y - fixData.y - fixData.h),
        };
      } else if (activeFixPosition === 6) { // centerBottom
        fixedObj = {
          x: fixData.x,
          y: y > fixData.y ? fixData.y : y,
          w: fixData.w,
          h: y > fixData.y ? y - fixData.y : (fixData.y - y),
        };
      } else if (activeFixPosition === 3) { // leftCenter
        fixedObj = {
          x: x < (fixData.x + fixData.w) ? x : (fixData.x + fixData.w),
          y: fixData.y,
          w: x < (fixData.x + fixData.w) ? fixData.x + fixData.w - x : x - (fixData.x + fixData.w),
          h: fixData.h,
        };
      } else if (activeFixPosition === 4) { // rightCenter
        fixedObj = {
          x: x > fixData.x ? fixData.x : x,
          y: fixData.y,
          w: x > fixData.x ? x - fixData.x : fixData.x - x,
          h: fixData.h,
        };
      } else if (activeFixPosition === 0) { // leftTop
        fixedObj = {
          x: x < (fixData.x + fixData.w) ? x : (fixData.x + fixData.w),
          y: y < (fixData.y + fixData.h) ? y : (fixData.y + fixData.h),
          w: x < (fixData.x + fixData.w) ? fixData.x + fixData.w - x : x - (fixData.x + fixData.w),
          h: y < (fixData.y + fixData.h) ? fixData.y + fixData.h - y : y - (fixData.y + fixData.h),
        };
      } else if (activeFixPosition === 2) { // rightTop
        fixedObj = {
          x: x > fixData.x ? fixData.x : x,
          y: y > fixData.y + fixData.h ? fixData.y + fixData.h : y,
          w: x > fixData.x ? x - fixData.x : fixData.x - x,
          h: y > fixData.y + fixData.h ? y - fixData.h - fixData.y : fixData.h + fixData.y - y,
        };
      } else if (activeFixPosition === 5) { // leftBottom
        fixedObj = {
          x: x < (fixData.x + fixData.w) ? x : (fixData.x + fixData.w),
          y: y > fixData.y ? fixData.y : y,
          w: x < (fixData.x + fixData.w) ? fixData.x + fixData.w - x : x - (fixData.x + fixData.w),
          h: y > fixData.y ? y - fixData.y : fixData.y - y,
        };
      } else if (activeFixPosition === 7) { // rightBottom
        fixedObj = {
          x: x > fixData.x ? fixData.x : x,
          y: y > fixData.y ? fixData.y : y,
          w: x > fixData.x ? x - fixData.x : fixData.x - x,
          h: y > fixData.y ? y - fixData.y : fixData.y - y,
        };
      }
      this.rects.splice(activeRectIndex, 1, fixedObj);
      this.fixPointsHandle(activeRectIndex);
      console.log('fixedObj', fixedObj);
    },
    changeRectPointEnd() {
      this.fixDown = false;
    },
    // 开始移动矩形框
    moveRectStart(index, event) {
      this.moveInitPoints = {
        index,
        gapX: event.offsetX, // 计算鼠标位置和矩形框左上角的差值
        gapY: event.offsetY,
        x: this.rects[index].x,
        y: this.rects[index].y,
      };
      this.isMove = true;
      this.isDown = false;
      this.fixDown = false;
      console.log('moveInitPoints', this.moveInitPoints);
    },
    moveRect(moveX, moveY) {
      const scale = this.scaleRect;
      const initData = this.moveInitPoints;
      let x = (moveX - initData.gapX) / scale + initData.x;
      let y = (moveY - initData.gapY) / scale + initData.y;
      if (x < 0) {
        x = 0;
      } else if (x > (this.img.width - this.rects[initData.index].w)) {
        x = this.img.width - this.rects[initData.index].w;
      }
      if (y < 0) {
        y = 0;
      } else if (y > (this.img.height - this.rects[initData.index].h)) {
        y = this.img.height - this.rects[initData.index].h;
      }
      const newObj = {
        x,
        y,
        w: this.rects[initData.index].w,
        h: this.rects[initData.index].h,
      };
      this.rects.splice(initData.index, 1, newObj);
      this.fixPointsHandle(initData.index);
    },
    moveRectEnd() {
      this.isDown = false;
      this.isMove = false;
      this.fixDown = false;
    },
    // 删除矩形
    deleteRect() {
      const index = this.activeRectIndex;
      this.isDown = false;
      if (index === -1) {
        alert('请先选择框再进行操作');
      } else if (confirm('确认删除?')) {
          this.activeRectIndex = -1
          this.rects.splice(index, 1)
        }
    },
    initContent() {
      let test = {
 x: 532, y: 448, w: 725, h: 308
 };
      let test1 = {
 x: 200, y: 300, w: 720, h: 500 
};
      this.rects.push(test);
      this.rects.push(test1);
    },
    saveMark() {
      console.log('rects', this.rects);
    },
  },
  watch: {
    // rects发生变化的话将新数据传递给父组件
    rects: (newRects) => {
      vm.$emit('getRectData', newRects);
    },
  },
  destroyed() { // 组件销毁时移除所有事件
    const svgElem = this.$refs.svg;
    svgElem.removeEventListener('mousedown', e => e.stopPropagation(), false);
    svgElem.removeEventListener('mousemove', e => e.stopPropagation(), false);
    svgElem.removeEventListener('mouseup', e => e.stopPropagation(), false);
    svgElem.removeEventListener('mouseleave', e => e.stopPropagation(), false);
  },
};
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.1);
}
.rect-container{
  position: relative;
  user-select:none;
  cursor:crosshair;
  background-size: 100% 100%;
}
</style>
