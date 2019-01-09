<!--drinkInfoList 和 selectDrinkInfo 重叠-->
<!--selected 不需要传第二个参数，可直接对应-->
<template>
  <div class="card">
    <div class="layout-head">饮水情况</div>
    <dw-card class="dw-card">
      <div slot="card-content" style="display: flex">
        <div @click="selected(0)" style="flex: 1;text-align: center">
          <i class="iconfont icon-less icon-icon" :class="{changeColor: expression === 0}"></i>
          <span class="layout-drink-info">较少</span>
        </div>
        <div @click="selected(1)" style="flex: 1;text-align: center">
          <i class="iconfont icon-normal icon-icon" :class="{changeColor: expression === 1}"></i>
          <span class="layout-drink-info">正常</span>
        </div>
      </div>
    </dw-card>
  </div>
</template>
<script>
  import DwCard from '../layout/Card';
  /**
   * DwDrinkEnum
   * @module components/planning/base/input/DrinkEnum
   * @desc 饮水情况组件
   * @param {string} [value] - v-model，当传入选择的值以后发生改变并通过$emit('input',传出的值) 传出
   * @param {string} [value] - 返回内容：选择的喝水状态文案
   *
   * @example
   * <dw-drink-enum class="card-cell" v-model="传入的参值"></dw-drink-enum>
   */
  export default {
    data() {
      return {
        expression: '',
        selectDrinkInfo: [{
          type: 0,
          label: '较少',
        }, {
          type: 1,
          label: '正常',
        },
        ],
      };
    },
    components: {
      DwCard,
    },
    props: ['value'],
    watch: {
      value(val) {
        if (val !== undefined) {
          this.selectDrinkInfo.forEach((item) => {
            if (item.label === val) {
              this.selected(item.type, item.label);
            }
          });
        }
      },
    },
    methods: {
      selected(index) {
        this.expression = index;
        if (index === 0) {
          this.$emit('input', '较少');
          this.$emit('change', '较少');
        } else {
          this.$emit('input', '正常');
          this.$emit('change', '正常');
        }
      },
    },
    created() {
      if (this.value !== undefined) {
        this.selectDrinkInfo.forEach((item) => {
          if (item.label === this.value) {
            this.selected(item.type);
          }
        });
      }
    },
  };
</script>
<style lang="less" scoped>
  @import "../../vars";
  .dw-card{
    padding: 0 14px;
    margin: 0;
  }
  .layout-head {
    padding: 10px 0 1rem;
    text-align: center;
  }
  .layout-drink-info {
    padding: .3rem 0;
    text-align: center;
    width: 100%;
    display: block;
  }
  i{
    font-size: @font_size_large;
    line-height: normal;
  }
  .icon-icon{
    color: @font_color_icon;
  }
  .changeColor{
    color: @color_blue;
  }
</style>
