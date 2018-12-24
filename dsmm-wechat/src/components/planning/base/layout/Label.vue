<template>
  <span  class="leave" :class="['leave-'+type]">
    {{description}}{{content}}
  </span>
</template>
<script>
  /**
   * DwLabel
   * @module components/planning/base/layout/Label
   * @desc 标签组件
   * @param {string} [content] - 变量的文案，没有不写则只展示给出的固定文案
   * @param {string} [type] - 根据传入的type的不同展示不同的颜色，或者背景，之后有更新可以直接在里面进行写css类
   * @param {string} [description] - 标签使用时有除变量外的固定的文案，没有不写则只展示变量展示的文案
   *
   * @example
   * <dw-label description="应录入时间：" type="gray" :content="item.child.timelyTime" v-if="item.child.labels.length === 0 && !item.child.sendTime"></dw-label>
   */
  export default {
    data() {
      return {
        valueInside: '',
      };
    },
    props: ['content', 'type', 'description'],
    mounted() {
    },
  };
</script>
<style lang="less" scoped>
  @import '../../vars';
  .leave{
    font-size: 12px;
  }
  .leave-orange{
    color: @color_orange;
  }
  .leave-green{
    color: @color_green;
  }
  .leave-gray{
    padding: .2rem;
    color: #999999;
    border-radius: 2px
  }
  .leave-background{
    font-size: 12px;
    padding: .2rem;
    background: #E8E8E8;
    color: #999999;
    border-radius: 2px;
    vertical-align: center;
  }
</style>
