<!--typeColor命名难理解-->
<template>
  <div>
    <div class="boxBackground" :class="[inputBackground]" v-if="type === 'inputNumber'">
      <input type="number" v-model="valueInside">
    </div>
    <div class="boxBackground" :class="[inputBackground]" v-if="type === 'inputText'">
      <input type="text" v-model="valueInside">
    </div>
    <div class="boxTextara" v-if="type === 'multi'">
      <textarea rows="8" v-model="valueInside" wrap="hard"></textarea>
    </div>
  </div>
</template>
<script>
  /**
   * DwInput
   * @module components/planning/base/input/Input
   * @desc 输入基础组件
   * @param {[String, Number]} [value] - v-model
   * @param {String} [inputBackground=white] - 输入框颜色，可以接收white, gray, transparent; m默认white
   * @param {Boolean} [multi=false] - textarea框显示，当multi=true时type值inputBackground值都可以不用传(传了也没用)
   * @param {string} [type=text] - 原生type属性，仅接收text,number,默认text属性
   * @param {String} - 返回文本
   *
   * @example
   * <dw-input type-color="gray" v-model="testValue" type="multi"></dw-input>
   */
  export default {
    name: 'DwInput',
    data() {
      return {
        valueInside: '',
      };
    },
    props: {
      value: [String, Number],
      inputBackground: {
        type: String,
        default: 'white',
      },
      type: {
        type: String,
        default: 'inputText',
      },
    },
    watch: {
      value(val) {
        this.valueInside = val;
      },
      valueInside(val, old) {
        if (this.type === 'text') {
          this.$emit('input', val.trim());
          this.$emit('change', val.trim());
        } else {
          this.$emit('input', val);
          this.$emit('change', val);
        }
      },
    },
    created() {
      this.valueInside = this.value;
    },
  };
</script>
<style lang="less" scoped>
  @import "../../vars";
  .boxBackground{
    display: flex;
    border-radius: 5px;
  }
  .boxTextara{
    display: flex;
  }
  .white{
    background: @color_white;
  }
  .gray{
    background: @color_light_gray_light;
  }
  .transparent{
    background: rgba(0,0,0,0);
  }
  input{
    width: 100%;
    border: none;
    outline: none;
    padding: .6rem .5rem;
    font-size: 14px;
    border-radius: 5px;
    background: rgba(0,0,0,0);
    height: 20px;
  }
  textarea{
    outline: none;
    resize:none;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    border-color: #999999;
    color: #999999;
  }
</style>
