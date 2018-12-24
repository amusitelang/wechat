<!--confirmSubmitted 命名问题-->
<template>
<div>
  <mt-popup
    v-model="popupVisible"
    :closeOnClickModal=false
    popup-transition="popup-fade" class="popup-box" @touchmove.prevent :lock-scroll="true" :style="{width: widthPercent}">
    <div class="header" v-if="type">
      <slot name="popup-header"></slot>
    </div>
    <div class="layout-popup-slot">
      <slot name="popup-content"></slot>
    </div>
    <div style="display: flex">
      <Button style="font-size: 14px" class="layout-button-box" type="default" @click="cancel" size="large">取消</Button>
      <Button style="font-size: 14px" class="layout-button-box" type="primary" @click="confirm" size="large">确认</Button>
    </div>
  </mt-popup>
</div>
</template>

<script>
  import Button from './Button';
  /**
   * DwDialog
   * @module components/planning/base/layout/Dialog
   * @desc 弹出框/模态框 封装好蒙层等基础样式，内部挂载slot
   * @param {string} [widthPercent=70%] - 显示模态框大小，widthPercent(百分比),接收字符串类型,!!!百分比!!!
   * @param {boolean} [value] - 打开模态框，布尔类型，接收true和false
   * @param {boolean} [input] - 实时传出是否打开模态框的信息
   * @param {function} [confirmSubmitted] - 传出确认事件,可以在里面进行操作
   * @param {slot} [slot挂载] 展示弹出框内部信息
   *
   * @example
   * <dw-dialog v-model="控制弹框打开关闭" v-on:confirm="接收确认事件" widthPercent="页面百分比">
   *    <div slot="popup-content" style="text-align: center">
   *    </div>
   * </dw-dialog>
   */
  export default {
    data() {
      return {
        popupVisible: false,
      };
    },
    components: {
      Button,
    },
    props: {
      value: Boolean,
      widthPercent: String,
      type: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      value(val) {
        this.popupVisible = val;
      },
    },
    methods: {
      confirm() {
        this.$emit('input', false);
        this.$emit('confirm');
      },
      cancel() {
        this.$emit('input', false);
      },
    },
    created() {
    },
  };
</script>

<style lang="less" scoped>
  @import "../../vars";
  .popup-box{
    border-radius: .25rem;
    background: #fff;
  }
  .header{
    width: 100%;
    background: #f9f9f9;
    color: #797979;
    padding: 15px;
    font-size: 16px;
    box-sizing: border-box;
    text-align: left;
    border-radius: .25rem;
  }
  .layout-button-box{
    margin: 0 1rem 1rem;
    font-size: 14px;
  }
  .layout-popup-slot{
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
  }
</style>
