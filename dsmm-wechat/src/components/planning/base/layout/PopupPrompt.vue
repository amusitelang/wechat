<template>
  <div>
    <div class="border-b card-prompt">
      <div class="card-row-style number" v-for="(item, index) in popupInfoList" :key="index">
        <div v-if="!item.isImg">
          <span>{{item.title}}:</span>
          <i class="iconfont icon" :class="item.icon" :style="{color: `${item.iconColor}`}" v-if="item.isIcon"></i>
          <span class="color-warning">{{item.content}}</span>
        </div>
        <div v-if="item.isImg">
          <div style="display: flex;flex-wrap: wrap">
            <img :src="`${photo}?x-oss-process=style/wechat-report`" alt="" style="width: 5.55rem;height:5.55rem;margin:.35rem;object-fit: cover" v-for="(photo, photos) in item.imgUrl" :key="photos">
          </div>
        </div>
      </div>
    </div>
    <div class="card-row-prompt">
      确认后并发送宝宝圈信息
    </div>
  </div>
</template>

<script>
  /**
   * DwPopupPrompt
   * @module components/planning/base/layout/photoInside/PopupPrompt
   * @desc 二次确认弹出框样式封装，根据外部传入的配置信息进行展示模态框中的信息
   * @param {Array} [popupInfoList] - 确认模态框中的信息
   *
   * @example
   * <dw-popup-prompt :popupInfoList="模态框中的信息"></dw-popup-prompt>
   */

  export default {
    data() {
      return {
      };
    },
    props: ['popupInfoList'],
  };
</script>

<style lang="less" scoped>
  .number:first-of-type{
    padding: 0 0 5px;
  }
  .number{
    overflow: hidden;
    line-height: 20px
  }
  i.icon{
    font-size: 14px;
  }
</style>
