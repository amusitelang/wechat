<!--需视觉先确认-->
<template>
  <div class="radio_box">
    <div v-if="title" class="radio_font" style="flex: 1;">{{title}}</div>
    <div style="display: flex;flex: 1;">
      <div v-if="typeof item === 'string'"  class="radio_content" @click="change(item)" v-for="(item, index) in options" :key="index">
        <div class="radio_select" :class="{radioSelect: selected === index}">
          <div v-if="selected === index" class="radio_selected"></div>
        </div>
        <div class="radio_font">{{item}}</div>
      </div>
      <div v-if="typeof item === 'object'" class="radio_content" @click="change(item)" v-for="(item, index) in options" :key="index">
        <div class="radio_select" :class="{radioSelect: selected === index}">
          <div v-if="selected === index" class="radio_selected"></div>
        </div>
        <div class="radio_font">{{item.label}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * DwRadio
   * @module components/planning/base/input/Radio
   * @desc 单选框
   * @param {string} [title=] - 标题，接受 string
   * @param {array} [options] - 参值[数组类型] 状态对应数组（{ 状态码：文案 }）当传递对象时传递形式为[{label: '', type: ''},{label: '', type: ''}]
   * @param {value} [v-model] -
   *
   * @example
   * <dw-radio title="手口情况" v-bind:options="[]" v-model="传出文案"></dw-radio>
   */
  export default {
    data() {
      return {
        selected: -1,
        valueIndex: '',
      };
    },
    props: {
      options: Array,
      title: String,
      value: String,
    },
    watch: {
      value(val) {
        this.valueIndex = val;
      },
    },
    methods: {
      change(item) {
        if (typeof item === 'string') {
          this.options.forEach((option, index) => {
            if (item === option) {
              this.selected = index;
            }
          });
          this.valueIndex = item;
          this.$emit('input', item);
          this.$emit('change', item);
        } else if (typeof item === 'object') {
          this.options.forEach((option, index) => {
            if (item.label === option.label) {
              this.selected = index;
            }
          });
          this.valueIndex = item.label;
          this.$emit('input', item.label);
          this.$emit('change', item.label);
        }
      },
    },
    created() {
      if (this.value) {
        this.valueIndex = this.value;
        this.change(this.valueIndex);
      }
    },
  };
</script>

<style lang="less" scoped>
  @import "../../vars";
  .radio_box{
    display: flex;
    flex-wrap: nowrap;
    .radio_content {
      display: flex;
      margin-right: 2rem
    }
    .radio_content:last-of-type{
      margin-right: 0;
    }
    .radio_select{
      border: 1px #cccccc solid;
      border-radius: 100%;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      position: relative;
    }
    .radio_selected{
      width: 8px;
      height: 8px;
      background: @color_primary;
      border-radius: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%)
    }
    .radio_font{
      height: 20px;
      line-height: 20px;
      padding-left: 6px;
    }
    .radioSelect{
      border: 1px @color_primary solid;
      border-radius: 100%;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
    }
  }
</style>
