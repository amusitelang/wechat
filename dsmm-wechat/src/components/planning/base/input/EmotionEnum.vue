<!--LEAVEMOODSTATUS 多余 -->
<template>
  <div>
    <div class="layout-head">{{title}}</div>
    <div class="card layout-emition">
      <div  @click="selected(item, index)" style="flex: 1;margin: 0 .5rem" v-for="(item, index) in moodList" :key="index">
        <i v-if="expression === index" :class="item.icon" class="iconfont" :style="{color: `${item.color}`}"></i>
        <i v-if="expression !== index" :class="item.icon" class="iconfont"></i>
      </div>
    </div>
  </div>
</template>
<script>
  /**
   * DwEmotionEnum
   * @module components/planning/base/input/EmotionEnum
   * @desc 情绪状态组件
   * @param {string} [value] - v-model，当传入选择的值以后发生改变并通过$emit('input',传出的值) 传出 返回事件：input, change-
   * @param {string} [value] - 返回内容：选择的情绪状态文案
   *
   * @example
   * <dw-emotion-enum class="card-cell" v-model="传入的参值"></dw-drink-enum>
   */
  export default{
    name: 'Emotion',
    data() {
      return {
        expression: '',
        type: '',
        moodList: [
          {
            label: '超开心',
            type: 0,
            icon: 'icon-super-happy',
            color: '#FE5454',
          },
          {
            label: '很正常',
            type: 1,
            icon: 'icon-happy',
            color: '#FFA128',
          },
          {
            label: '略低落',
            type: 2,
            icon: 'icon-unhappy',
            color: '#488dc9',
          },
        ],
      };
    },
    props: ['title', 'value'],
    methods: {
      selected(item, index) {
        this.expression = index;
        this.type = index;
        this.$emit('input', item.label);
        this.$emit('change', item.label);
      },
    },
    created() {
      if (this.value !== undefined) {
        this.moodList.forEach((item) => {
          if (this.value === item.label) {
            this.selected(item, item.type);
          }
        });
      }
    },
  };
</script>
<style lang="less" scoped>
  @import "../../vars";
  .layout-head{
    text-align: center;
    padding: 10px 0 1rem;
    font-size: 14px;
  }
  .layout-emition{
    display: flex;
    padding: 0 2rem;
    line-height: normal;
    text-align: center;
  }
  i.icon-super-happy{
    font-size: 55px;
    color: @font_color_icon;
  }
  i.icon-happy{
    font-size: 55px;
    color: @font_color_icon;
  }
  i.icon-unhappy{
    font-size: 55px;
    color: @font_color_icon;
  }
</style>
