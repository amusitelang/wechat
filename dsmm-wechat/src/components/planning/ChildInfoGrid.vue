<template>
  <div>
    <div class="layout-avatar-one" v-if="type === 'row'">
      <slot name="avatar"></slot>
      <div>
        <div class="layout-avatar-font-one">{{name}}</div>
        <div class="layout-avatar-info-one" v-if="gender || birthday">
          <i class="iconfont icon-men" v-if="gender === 1" style="color: #A0DCFF;font-size: 12px"></i>
          <i class="iconfont icon-woman" v-if="gender === 2" style="color: #FFB5D5;font-size: 12px"></i>
          <span v-if="birthday" style="font-size: 12px;color: #999;">
            {{parseBirthday(birthday)}}
          </span>
        </div>
        <div style="margin-left: .7rem;margin-top: .4rem">
          <slot name="leave-content"></slot>
          <!-- <span style="font-size: 12px;padding: .2rem;background: #E8E8E8;color: #999999;border-radius: 2px" v-if="memo">
            {{memo}}
          </span>
          <span style="font-size: 12px;padding: .2rem;background: #F5A626;color: #fff;border-radius: 2px;vertical-align: center" v-if="reason">
            {{reason}}
          </span> -->
        </div>
      </div>
    </div>
    <div v-if="type === 'series'">
      <div  class="layout-avatar-two">
        <dw-photo class="layout-childInfoCenter" :image="photo"></dw-photo>
      </div>
      <div style="margin-top: 10px">
        <div style="text-align: center">宝宝: {{name}}</div>
        <div style="text-align: center" class="layout-avatar-info-one" v-if="gender || birthday">
          <i class="iconfont icon-men" v-if="gender === 1" style="color: #A0DCFF"></i>
          <i class="iconfont icon-woman" v-if="gender === 2" style="color: #FFB5D5"></i>
          <span v-if="birthday" style="font-size: 12px">
            {{parseBirthday(birthday)}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import DwPhoto from './base/layout/Avatar';
  import { mapState } from 'vuex';
  /**
   * DwChildInfoGrid
   * @module components/planning/ChildInfoGrid
   * @desc 学员信息组件
   * @param {string} [type=row] - 显示类型，接受 row(横向),series(纵向)
   * @param {string} [name] - 名称
   * @param {string} [birthday] - 生日
   * @param {number} [gender] - 性别，仅支持number类型
   * @param {string} [photo] - 图片
   *
   * @example
   * <dw-child-info-grid type="series" name="名称" birthday="生日" :gender="1 or 2" photo="头像url"></dw-child-info-grid>
   */
  export default {
    props: {
      type: {
        type: String,
        default: 'row',
      },
      name: String,
      birthday: String,
      gender: Number,
      photo: String,
      memo: String,
      reason: String,
    },
    components: {
      DwPhoto,
    },
    computed: {
      ...mapState({
        parseBirthday: state => state.parseBirthday,
      }),
    },
    created() {
    },
  };
</script>
<style lang="less" scoped>
  .layout-childInfoLeft{
    margin-right: 10px;
  }
  .layout-childInfoCenter{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .headInfoImg {
    width: 14px;
    vertical-align: middle;
    margin-right: 0.5rem;
  }
  .layout-avatar-one{
    background: #fff;
    display: flex;
  }
  .layout-avatar-two{
    width: 80px;
    height: 80px;
    background: rgba(255,255,255,0.5);
    position: relative;
    margin: 0 auto;
    border-radius: 100%
  }
  .layout-avatar-font-one{
    white-space: nowrap;
    margin-left: 0.7rem;
    line-height: normal;
  }
  .layout-avatar-info-one{
    white-space: nowrap;
    margin-left: 0.7rem;
    margin-top: .2rem;
    line-height: normal;
  }


</style>
