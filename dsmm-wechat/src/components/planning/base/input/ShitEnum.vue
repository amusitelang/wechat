<!--defecate命名问题-->
<!--SELECTSHIT 多余-->
<template>
  <div>
    <div style="padding: 10px 0 1rem;text-align: center">{{title}}</div>
    <div style="display: flex" class="card">
      <div style="flex: 1;text-align: center" @click="selected(0, shitInfo[0].label)">
        <i class="iconfont icon-success2 shit" :class="{yes: expression === 0}" style="font-size: 45px;line-height: normal;"></i>
        <div style="text-align: center;padding: .3rem 0;">{{shitInfo[0].label}}</div>
      </div>
      <div style="flex: 1;text-align: center" @click="selected(1,shitInfo[1].label)">
        <i class="iconfont icon-baby_astriction shit" style="font-size: 45px;line-height: normal;" :class="{constipation: expression === 1}"></i>
        <div style="text-align: center;padding: .3rem 0;">{{shitInfo[1].label}}</div>
      </div>
      <div style="flex: 1;text-align: center" @click="selected(2,shitInfo[2].label)">
        <i class="iconfont icon-baby_diarrhea shit" style="font-size: 45px;line-height: normal;" :class="{diarrhea: expression === 2}"></i>
        <div style="text-align: center;padding: .3rem 0;">{{shitInfo[2].label}}</div>
      </div>
      <div style="flex: 1;text-align: center" @click="selected(3,shitInfo[3].label)">
        <i class="iconfont icon-error shit" style="font-size: 45px;line-height: normal;" :class="{no: expression === 3}"></i>
        <div style="text-align: center;padding: .3rem 0;">{{shitInfo[3].label}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  /**
   * DwShitEnum
   * @module components/planning/base/input/ShitEnum
   * @desc 大便状态组件
   * @param {string} [value] - v-model，当传入选择的值以后发生改变并通过$emit('input',传出的值) 传出 返回事件：input, change
   * @param {string} [value] - 返回内容：选择的大便状态文案
   * @param {string} [title] - 标题文案
   *
   * @example
   * <dw-shit-enum class="card-cell" v-model="传入的参值" title="标题"></dw-shit-enum>
   */
  export default{
    name: 'Defecate',
    data() {
      return {
        expression: '',
        shitInfo: [
          {
            label: '是',
            type: 0,
          },
          {
            label: '便秘',
            type: 1,
          },
          {
            label: '拉肚子',
            type: 2,
          },
          {
            label: '否',
            type: 3,
          },
        ],
      };
    },
    props: {
      title: {
        type: String,
        default: '是否大便',
      },
      value: String,
    },
    methods: {
      selected(index, item) {
        this.expression = index;
        this.$emit('input', item);
      },
    },
    created() {
      if (this.value !== undefined) {
        this.shitInfo.forEach((item) => {
          if (item.label === this.value) {
            this.selected(item.type, item.label);
          }
        });
      }
    },
  };
</script>
<style lang="less" scoped>
  @import "../../vars";
  .shit{
    color: @font_color_icon;
  }
  .constipation{
    color: @color_blue;
  }
  .diarrhea{
    color: @color_green;
  }
  .yes{
    color: @color_green;
  }
  .no{
    color: @color_warning;
  }
</style>

