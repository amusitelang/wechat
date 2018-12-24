<template>
<div>
  <div class="card layout-background" style="overflow:hidden;">
    <div class="avatar">
      <dw-avatar-show v-bind:avatar-url="teacherInfo.photo" class="photoStyle"></dw-avatar-show>
    </div>
    <div class="teacherName">{{teacherInfo.name}}</div>
    <div class="teacher_star">
      <div v-for="(item, index) in gradeStar" :key="index">
        <div :class="{starOption: item === 1}"></div>
      </div>
    </div>
  </div>
  <dw-around-card>
    <dw-setting-show @click.native="changeValue(0)" slot="housing-content" class="border-b">
      <div slot="left" class="layout-row-left">姓名</div>
      <div slot="right" class="layout-row-right">{{teacherInfo.name}}<i class="iconfont icon-angle-right"></i></div>
    </dw-setting-show>
    <dw-setting-show @click.native="changeValue(1)" slot="housing-content" class="border-b">
      <div slot="left" class="layout-row-left">手机号码</div>
      <div slot="right" class="layout-row-right">修改<i class="iconfont icon-angle-right" slot="housing-content"></i></div>
    </dw-setting-show>
    <dw-setting-show @click.native="changeValue(2)" slot="housing-content">
      <div slot="left" class="layout-row-left">生日</div>
      <div slot="right" class="layout-row-right">{{pickerBirthday}}<i class="iconfont icon-angle-right"></i></div>
    </dw-setting-show>
  </dw-around-card>
  <dw-around-card>
    <dw-setting-show @click.native="changeValue(3)" slot="housing-content">
      <div slot="left" class="layout-row-left">退出登录</div>
    </dw-setting-show>
  </dw-around-card>
  <mt-popup
    v-model="popupName"
    popup-transition="popup-fade" style="border-radius: 5px;">
    <div class="changeName">
      <div>修改姓名</div>
      <dw-input v-model="changedTeacherName" inputBackground="gray" type="inputText" style="margin-bottom: 20px"></dw-input>
      <dw-select-button v-on:cancel="cancel" v-on:success="define"></dw-select-button>
    </div>
  </mt-popup>
  <mt-datetime-picker
    ref="picker"
    type="date"
    :startDate="startDate"
    :endDate="endDate"
     @confirm="birthday">
  </mt-datetime-picker>
</div>
</template>
<script>
  import moment from 'moment';
  import { mapActions } from 'vuex';
  import DwInputTeacherName from '../../../components/layout/base/InputGray';
  import DwSelectButton from '../../../components/layout/base/SelectButtonLayout';
  import DwAvatarShow from '../../../components/layout/base/AvatarShow';
  import DwSettingShow from '../../../components/layout/base/Row';
  import DwAroundCard from '../../../components/layout/base/Card';
  // 新组件
  // 组件重构
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    data() {
      return {
        popupName: false,
        pickerBirthday: '',
        startDate: new Date('1970-01-01'),
        endDate: new Date('2018-01-01'),
        teacherInfo: {},
        gradeStar: [],
        change: '',
        moveTouch: true,
        changedTeacherName: '',
      };
    },
    created() {
      this.init();
    },
    components: {
      DwInputTeacherName,
      DwSelectButton,
      DwAvatarShow,
      DwSettingShow,
      DwAroundCard,
      DwInput,
    },
    methods: {
      ...mapActions({
        getTokenTeacherInfo: 'teacher/getTokenTeacherInfo',
        postTeacherName: 'teacher/postTeacherName',
        getTeacherBirthday: 'teacher/getTeacherBirthday',
      }),
      init() {
        this.getTokenTeacherInfo().then((res) => {
          this.teacherInfo = res.obj;
          this.changedTeacherName = this.teacherInfo.name;
          // 通过grade方法判断赢展示几星
          this.grade(this.teacherInfo.level, 5);
          if (this.teacherInfo.birthday) {
            this.pickerBirthday = moment(this.teacherInfo.birthday).format('YYYY-MM-DD');
          } else {
            this.pickerBirthday = '';
          }
        });
      },
      grade(index, max) {
        const a = max - index;
        const b = max - a;
        for (let i = 0; i < a; i += 1) {
          this.gradeStar.push(0);
        }
        for (let i = 0; i < b; i += 1) {
          this.gradeStar.unshift(1);
        }
      },
      changeColor(index) {
        this.change = index;
        this.moveTouch = true;
      },
      moveValue() {
        this.moveTouch = false;
      },
      changeValue(index) {
        this.change = '';
        if (this.moveTouch) {
          if (index === 0) {
            this.popupName = true;
          } else if (index === 1) {
            this.$router.push('/teacher/personal/phone');
          } else if (index === 2) {
            this.$refs.picker.open();
            // this.open = true;
          } else if (index === 3) {
            this.$store.commit('logout');
          }
        }
      },
      cancel() {
        this.popupName = false;
      },
      define() {
        if (!this.changedTeacherName) {
          this.changedTeacherName = this.teacherInfo.name;
        }
        this.popupName = false;
        if (this.changedTeacherName !== this.teacherInfo.name) {
          this.postTeacherName({
            staffName: this.changedTeacherName,
          }).then(() => {
            this.teacherInfo.name = this.changedTeacherName;
            this.gradeStar = [];
            this.$toast('修改成功');
            this.init();
          });
        } else {
          this.$toast('名称未修改');
        }
      },
      birthday(data) {
        this.pickerBirthday = moment(data).format('YYYY-MM-DD');
        const time = moment(this.teacherInfo.birthday).format('YYYY-MM-DD');
        if (this.pickerBirthday !== time) {
          this.getTeacherBirthday({
            birthday: this.pickerBirthday,
          }).then(() => {
            this.gradeStar = [];
            this.$toast('修改成功');
            this.init();
          });
        } else {
          this.$toast('生日未修改');
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .layout-background{
    background: url(../../../assets/img/img/avatar/teacher_default_background.png);
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    padding:0 0 1rem;
  }
  .problem{
    overflow: hidden;
    padding-top: .5rem;
    div{
      width: 25px;
      height: 25px;
      border-radius: 100%;
      border: 1px #cccccc solid;
      float: right;
    }
  }
  .font{
    text-align: center;
    border:0;
    padding-top: 1.5rem;
  }
  .avatar{
    width: 5rem;
    height: 5rem;
    border-radius: 100%;
    background-color: rgba(255,255,255,0.3);
    margin: 2rem auto .5rem;
    position: relative;
  }
  .photoStyle{
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .teacherName{
    text-align: center;
    color: #FFFFFF;
  }
  .teacher_star{
    width: 150px;
    margin: 0 auto;
    display: flex;
    div{
      width: 30px;
      height: 30px;
      div{
        width: 20px;
        height: 20px;
        margin: 5px auto;
        background-image: url(../../../assets/img/icon/teacherPersonal/noStar.png);
        background-size: cover;
        background-repeat: no-repeat;
      }
      .starOption{
        background-image: url(../../../assets/img/icon/teacherPersonal/star.png);
      }
    }
  }
  .include_option{
    background-color: #ffffff;
    margin-top: 5px;
    .option{
      display: flex;
      padding-left: 1rem;
      padding-right: 1rem;
      .optionName{
        flex: 1;
        text-align: left;
      }
      .optionValue{
        flex: 1;
        text-align: right;
        overflow: hidden;
        div{
          float: right;
          margin-left: .5rem;
          color: #cccccc;
        }
      }
    }
  }
  .changeName{
    padding: 16px 20px 20px;
    width: 17rem;
    border-radius: 5px;
    div:first-of-type{
      margin-bottom: 16px;
      color: #797979;
      font-size: 18px;
    }
    .confirm{
      display: flex;
      div{
        flex: 1;
        padding: 1rem;
        text-align: center;
      }
      .sure{
        color: #F5A626;
      }
    }
  }
  .icon-right{
    background-image: url(../../../assets/img/icon/global/arrow-right.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 6px;
    height: 10px;
    margin-top: 3px;
  }
  .changeBackground{
    background: rgba(0,0,0,0.1);
  }
</style>
