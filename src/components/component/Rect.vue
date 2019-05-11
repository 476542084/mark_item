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
      @mouseup="moveRectEnd(index)"
      :fill="svgColor" :stroke="svgColor"
      style="stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9;cursor:move"/>
      <v-editpoint v-if="showEdit" :fixedPoints="fixPoints" :activeRectIndex="activeRectIndex" @funcStart="changeRectPointStart" @funcEnd="changeRectPointEnd" :scaleRect="scaleRect"/>
    </svg>
  </div>
</template>

<script>
import line from './utils/Line.vue';
import EditPoint from './utils/EditPoint.vue';
import vm from '@/utils/vm';
import ParamidaPay from '../../paramidaPay.js';
export default {
  props: ['img'],
  data() {
    return {
      mark_id_index:{},
      userId:sessionStorage.getItem('userId') || -1,
      imageMarkInitData:[],
      showEdit: true,
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
    this.rects = [];
    // 获取其他组件传来的信息
    vm.$off('deleteRect');
    vm.$on('deleteRect', () => {
      this.deleteRect();
    });
    vm.$off('changeColor');
    vm.$on('changeColor', (color) => {
      this.svgColor = color;
    });

  },
  mounted() {
    console.log('imageData',this.img)
    vm.$off('saveMark');
    vm.$on('saveMark', () => {
      this.saveMark();
      this.initContent();
    });
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
        x: 0, y: 0, w: 0, h: 0,
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
        const { initX } = this.initPoints;
        const { initY } = this.initPoints;
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
    this.showEdit = false;
    this.$nextTick(() => {
      this.showEdit = true;
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
    },
    changeRectPointStart(position) {
      const { activeRectIndex } = this;
      this.activeFixPosition = position;
      this.fixDown = true;
      this.isDown = false;
      this.fixData = this.rects[activeRectIndex];

    },
    // 拖拽点更改矩形坐标
    changeRectPoint(xx, yy) {
      const { activeFixPosition } = this;
      const { activeRectIndex } = this;
      const { fixData } = this;
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
        mark_id:this.mark_id_index[initData.index],
      };
      this.rects.splice(initData.index, 1, newObj);
      this.fixPointsHandle(initData.index);
      

    },
    moveRectEnd(index) {
      this.isDown = false;
      this.isMove = false;
      this.fixDown = false;
      console.log('moveInitPoints', this.moveInitPoints);
      let test =this.moveInitPoints['index'];
      console.log('标注真实ID',this.mark_id_index[test])
      this.getDetailChat(this.mark_id_index[test])
     
    },
    // 删除矩形
    deleteRect() {
      const index = this.activeRectIndex;
      console.log('index', index);
      this.isDown = false;
      if (index === -1) {
        alert('请先选择框再进行操作');
      } else if (confirm('确认删除?')) {
        this.activeRectIndex = -1;
        this.rects.splice(index, 1);
      }
    },
    initContent() {
      // const test = {
      //   x: 532, y: 448, w: 725, h: 308,
      // };
      // const test1 = {
      //   x: 200, y: 300, w: 720, h: 500,
      // };
      // const flag = [];
      // flag.push(test);
      // flag.push(test1);
      // this.rects = flag;

      ParamidaPay.ApiCaller.post('index/showAllMark', { img_id: this.img.id},
        (response) => {
          if (response.errcode == 0) {
            const flag = [];
            let data = response.data
            for(let index in data){
              let test = JSON.parse(data[index].mapdata)
              test['mark_id'] = data[index].id
              this.imageMarkInitData.push(test)
              flag.push(test)
              this.mark_id_index[index] = data[index].id
            }
            console.log('mark_id_index',this.mark_id_index)
            this.rects = flag
          } else {
            this.$message({
              message: response.errcode,
              type: 'error',
            });
            this.data = {};
          }
        },
        (response) => {
          this.$message({
            message: response.errcode,
            type: 'error',
          });
        },
      );

    },
    saveMark() {
      //保存接口
      console.log('rects', this.rects);
      console.log('initData', this.imageMarkInitData);
      let newData =[],editData = [],delData=[],tmpData=[]
      for(let index in this.rects){
        if(this.rects[index].mark_id == undefined){
          newData.push(this.rects[index])
        }else{
          tmpData.push(this.rects[index])
        }
      }
      for(let index_t in tmpData){
          for(let index_p in this.imageMarkInitData){
            if(tmpData[index_t].mark_id == this.imageMarkInitData[index_p].mark_id){
              if(this.imageMarkInitData[index_p].h == tmpData[index_t].h && this.imageMarkInitData[index_p].w == tmpData[index_t].w && this.imageMarkInitData[index_p].x == tmpData[index_t].x  && this.imageMarkInitData[index_p].y == tmpData[index_t].y){
                //do nothing
              }else{
                editData.push(tmpData[index_t])
              }
            }
          }
      }
      delData = this.deepCopy(this.imageMarkInitData)
      for(let index_s in tmpData){
          for(let index_q in this.imageMarkInitData){
              if(tmpData[index_s].mark_id == this.imageMarkInitData[index_q].mark_id){
                for(let index_w in delData){
                  if(delData[index_w].mark_id == tmpData[index_s].mark_id){
                    delData.splice(index_w,1)
                    continue
                  }
                }
              }
          }
      }
      if(Array.isArray(editData) && editData.length !== 0){
        this.editOneMark(editData)
      }
      if(Array.isArray(newData) && newData.length !== 0){
        this.addOneMark(newData)
      }
      if(Array.isArray(delData) && delData.length !== 0){
        this.delOneMark(delData)
      }
    },
    addOneMark(postData){
      ParamidaPay.ApiCaller.post('index/addOneMark', { img_id: this.img.id,data:JSON.stringify(postData),userId:this.userId},
        (response) => {
          if (response.errcode == 0) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
          } else {
            this.$message({
              message: response.errcode,
              type: 'error',
            });
            this.data = {};
          }
        },
        (response) => {
          this.$message({
            message: response.errcode,
            type: 'error',
          });
        },
      );
    },
    editOneMark(postData){
      ParamidaPay.ApiCaller.post('index/editOneMark', { img_id: this.img.id,data:JSON.stringify(postData),userId:this.userId},
        (response) => {
          if (response.errcode == 0) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
          } else {
            this.$message({
              message: response.errcode,
              type: 'error',
            });
            this.data = {};
          }
        },
        (response) => {
          this.$message({
            message: response.errcode,
            type: 'error',
          });
        },
      );
    },
    delOneMark(postData){
      ParamidaPay.ApiCaller.post('index/delOneMark', { img_id: this.img.id,data:JSON.stringify(postData),userId:this.userId},
        (response) => {
          if (response.errcode == 0) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
          } else {
            this.$message({
              message: response.errcode,
              type: 'error',
            });
            this.data = {};
          }
        },
        (response) => {
          this.$message({
            message: response.errcode,
            type: 'error',
          });
        },
      );
    },
    getDetailChat(markId){
      
      ParamidaPay.ApiCaller.post('index/showAllMessageByMark', { markId: markId},
        (response) => {
          if (response.errcode == 0) {
            response['mark_id'] = markId;
            vm.$emit('showChat', response);
          } else {
            this.$message({
              message: response.errcode,
              type: 'error',
            });
            this.data = {};
          }
        },
        (response) => {
          this.$message({
            message: response.errcode,
            type: 'error',
          });
        },
      );
    },
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key]);   //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
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
    this.rects = [];


    if (svgElem) {
      svgElem.removeEventListener('mousedown', e => e.stopPropagation(), false);
      svgElem.removeEventListener('mousemove', e => e.stopPropagation(), false);
      svgElem.removeEventListener('mouseup', e => e.stopPropagation(), false);
      svgElem.removeEventListener('mouseleave', e => e.stopPropagation(), false);

    }
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
