<template>
    <section class="rect-mark-container">
      <header class="header-operate">
        <v-operate v-if="showRect" />
      </header>
      <section class="main-mark">
        <section class="main-rect">
          <v-rect  :img="imageData"/>
        </section>
      </section>
    </section>
</template>

<script>
import operate from '../component/Operate.vue';
import rect from '../component/Rect.vue';
import vm from '@/utils/vm';

export default {
  props: ['imageData'],
  data() {
    return {
      rects: [], // 矩形框数据
      dots: [], // 点位数据
      showRect: true,
    };
  },
  components: {
    'v-operate': operate,
    'v-rect': rect,
  },
  created() {
    vm.$on('getRectData', (data) => {
      this.rects = data;
    });
    vm.$on('getDotData', (data) => {
      this.dots = data;
    });
  },
  mounted() {
    this.rects = [];
    this.img = this.imageData;
    this.showRect = false;
    this.$nextTick(() => {
      this.showRect = true;
    });

  },
};
</script>

<style lang="less" scoped>
  .rect-mark-container {
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    .header-operate {
      height: 50px;
      padding: 10px;
    }
    .main-mark {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .main-polygon, .main-rect, .main-dot  {
        flex: 1;
        height: 90vh;
        border: 10px solid skublue;
        overflow: scroll;
      }
    }
  }
</style>
