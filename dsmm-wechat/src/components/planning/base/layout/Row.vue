<template>
  <div class="row" :class="{RowBorderBottom: borderBottom === true}">
    <div class="layout-row-content">
      <div style="flex: 1;">
        <slot name="rowContent"></slot>
      </div>
      <i class="iconfont icon-angle-right" v-if="arrow === true"></i>
    </div>
  </div>
</template>
<script>
  /**
   * DwRow
   * @module components/planning/base/layout/Row
   * @desc 卡片里的基础行组件,可独立出来,封装好基本的间距，下划线，或者右箭头效果等，内部挂载slot
   * @param {Boolean} [borderBottom=true] - 显示下划线，接受 true或false 默认false
   * @param {Boolean} [arrow=false] - 显示右箭头，接受 true或false 默认false
   *
   * @example
   * <dw-row :borderBottom="true" :arrow="true">
   *    <div slot="rowContent">张三的歌</div>
   * </dw-row>
   */
  export default {
    data() {
      return {};
    },
    props: {
      borderBottom: {
        type: Boolean,
        default: false,
      },
      arrow: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
<style lang="less" scoped>
  .row{
    padding: 12px 0;
    display: flex;
    margin: 0;
    line-height: 100%;
  }
  .row:active{
    background: rgba(0,0,0,0.05);
  }
  .RowBorderBottom{
    border-bottom: 1px #ECECEC solid;
  }
  i{
    padding-left: 5px;
  }
  .layout-row-content{
    padding: 0 10px;display: flex;width: 100%
  }
</style>
