<template>
  <div class="operate-container">
    <input type="button" value="删除矩形" @click="deleteRect">
    <input type="color" name="color" v-model="color" @change="changeColor">
    <input type="button" value="辅助线" @click="toggleLine">
    <input type="button" value="保存所有标注" @click="saveMark">
  </div>
</template>

<script>
import vm from '@/utils/vm'
;

export default {
  data() {
    return {
      color: '#000000',
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
};
</script>

<style lang="less" scoped>
  .operate-container {
    display: flex;
    flex-direction: row;
  }
</style>
