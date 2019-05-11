<template>
  <div class="operate-container">
      <el-button @click="saveMark" type="success">保存所有标注</el-button>
      <el-button v-if="showDel"  @click="deleteRect" type="danger">删除矩形</el-button>

      <!-- <el-button type="info">信息按钮</el-button> -->
      <el-button @click="toggleLine" type="warning">辅助线</el-button>
      <input style="border-radius: 13px;
      margin-left: 8px;
      width: 80px;
      height: 40px;" type="color" name="color" v-model="color" id="color" @change="changeColor">
      <div class="message1" style="line-height: 48px;
      position: absolute;
      top: 2rem;
      left: 43rem;
      text-align: center;">点击那里可以选择颜色哦</div>
  </div>
</template>

<script>
import vm from '@/utils/vm'
;

export default {
  data() {
    return {
      color: '#000000',
      showDel:true,
    };
  },
  methods: {
    deleteRect() {
      vm.$emit('deleteRect');
    },
    delectPolygon() {
      vm.$emit('delectPolygon');
    },
    toggleLine() {
      vm.$emit('toggleLine');
    },
    changeColor() {
      vm.$emit('changeColor', this.color);
    },
    completePolygon() {
      vm.$emit('completePolygon');
    },
    deleteDot() {
      vm.$emit('deleteDot');
    },
    saveMark() {
      vm.$emit('saveMark');
    },
  },
  mounted() {
    const { href } = window.location;
    const navLink = href.substr(href.indexOf('#') + 1, href.length);
    if (navLink == '/shareManage') {
      this.showDel = false;
    }

  },
};
</script>

<style lang="less" scoped>
  .operate-container {
    display: flex;
    flex-direction: row;
  }
  .header-operate{
    height: 60px 0px !important;
    padding: 5px 0px !important;
  }
  #color{
border: 0;
}
::-webkit-color-swatch-wrapper{
background-color:#ffffff;
}
::-webkit-color-swatch{
position: relative;
}
.message1::before {
  content: '';
  width: 20px; 
  height: 20px;
  background-color: inherit;
  left: -7px; /*向左侧外部延伸箭头box的一半宽度*/
  position: absolute;
  transform: rotate(45deg); /*旋转45度*/
  top:50%; /*箭头在数值方向上居中*/
  margin-top: -5px;
}
.message1,.message2 {
  width: 174px;
  height: 54px;
  margin: 100px auto;
  background-color: #67C23A;
  border-bottom-color:#67C23A;/*为了给after伪元素自动继承*/
  color: #fff;
  font-size: 12px;
  font-family: Arial;
  line-height: 18px;
  padding: 5px 12px 5px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
}


</style>
