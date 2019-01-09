<template>
  <div class="like">
    <div class="card border-b">
      <child-info style="padding: .5rem 0;" v-bind:name="teacherSelectedChildInfo.name" :img="teacherSelectedChildInfo.photo"></child-info>
    </div>
    <div class="card">
      <div>
        <temperature class="card-cell" title="体温" v-on:temperature="listenToMyBoy" v-bind:saveInfo="dayCheckInfoList.items.bodyTemperature" style="padding-top: 0;"></temperature>
        <dw-emotion-enum class="card-cell" style="padding-top: 0;" title="情绪状态" v-model="dayCheckInfoList.items.feeling"></dw-emotion-enum>
        <div>
          <dw-radio title="手口情况" :options="checkInfo.headAndMouth"  v-model="dayCheckInfoList.items.headAndMouth" style="margin: 1rem 0"></dw-radio>
          <dw-radio title="肢体情况" :options="checkInfo.limbInfo"  v-model="dayCheckInfoList.items.bodyCondition" style="margin-bottom: 1rem"></dw-radio>
          <dw-radio title="指甲情况" :options="checkInfo.nailInfo"  v-model="dayCheckInfoList.items.nail" style="margin-bottom: 1rem"></dw-radio>
        </div>
        <div class="memo detail_memo">
          <dw-input type-color="gray" v-model="dayCheckInfoList.memo" type="multi"></dw-input>
        </div>
      </div>
    </div>
    <div  class="button-block_primary" @click="sureSubmit">
      提交
    </div>
    <dw-dialog v-model="popupVisible"  widthPercent="80%" v-on:confirm="success" :type="true" @touchmove.prevent>
      <div slot="popup-header">
        入园检查报告
      </div>
      <div slot="popup-content">
        <dw-popup-prompt :popupInfoList="popupInfo"></dw-popup-prompt>
      </div>
    </dw-dialog>
  </div>
</template>
<script>
  import Temperature from '../../../components/report/InputTemperature';
  import ChildInfo from '../../../components/layout/ChildInfo';
  import moment from 'moment';
  import { mapActions, mapState } from 'vuex';
  // 全局定义的文案
  import constant from '../../../config/constant';
  // 重构组件
  import DwRadio from '../../../components/planning/base/input/Radio';
  import DwEmotionEnum from '../../../components/planning/base/input/EmotionEnum';
  import DwTemperature from '../../../components/planning/base/input/Temperature';
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwPopupPrompt from '../../../components/planning/base/layout/PopupPrompt';
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    data() {
      return {
        emotion: '情绪状态',
        popupVisible: false,
        dayTime: '',
        memo: '', // 备注信息
        // 手口情况和肢体情况
        data: {},
        flag: true,
        checkType: {
          headAndMouth: [],
          limbInfo: [],
          nailInfo: [],
        },
        checkInfo: {
          headAndMouth: ['正常', '有疱疹'],
          limbInfo: ['正常', '有擦伤'],
          nailInfo: ['正常', '略长'],
        },
        eventInfo: {
          moodType: '',
          moodIcon: '',
          moodIconColor: '',
        },
        popupInfo: [
          {
            title: '入园时间',
            content: '2018-01-02',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '入园体温',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '情绪状态',
            content: '',
            isIcon: true,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '手口情况',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '肢体擦伤',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '指甲情况',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '备注信息',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
          },
        ],
      };
    },
    mounted() {
      this.getTime();
    },
    watch: {
      testData(val) {
        console.log(val);
      },
    },
    computed: {
      ...mapState({
        teacherSelectedChildInfo: state => state.teacher.teacherSelectedChildInfo,
        dayCheckInfoList: state => state.teacher.dayCheckInfoList,
        loading: state => state.loading,
      }),
    },
    methods: {
      ...mapActions({
        postReport: 'teacher/postReport',
      }),
      error() {
        this.popupVisible = false;
      },
      success() {
        this.popupVisible = false;
        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.data = JSON.stringify({
          bodyTemperature: this.dayCheckInfoList.items.bodyTemperature,
          headAndMouth: this.dayCheckInfoList.items.headAndMouth,
          bodyCondition: this.dayCheckInfoList.items.bodyCondition,
          feeling: this.dayCheckInfoList.items.feeling,
          entranceTime: this.dayTime,
          nail: this.dayCheckInfoList.items.nail, // 指甲情况
          time: date, // 发送日期
        });
        localStorage.setItem('checkDetail', this.data);
        if (this.flag) {
          this.flag = false;
          this.postReport({
            type: 1,
            items: this.data,
            memo: this.dayCheckInfoList.memo.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\s/g, ' '),
          }).catch(() => {
            this.flag = true;
          });
        }
      },
//        利用$on $emit将温度读取到，将情绪状态获取到
      listenToMyBoy(someData) {
        this.dayCheckInfoList.items.bodyTemperature = someData;
      },
      // 情绪状态（新组件）
      selectMood(index) {
        this.dayCheckInfoList.items.feeling = index;
      },
      sureSubmit() {
        constant.LEAVEMOODSTATUS.forEach((item) => {
          if (this.dayCheckInfoList.items.feeling === item.label) {
            this.eventInfo.moodIcon = item.icon;
            this.eventInfo.moodIconColor = item.color;
            this.popupInfo[2].icon = item.icon;
            this.popupInfo[2].iconColor = item.color;
          }
        });
        if (this.dayCheckInfoList.items.bodyTemperature === '' || this.dayCheckInfoList.items.headAndMouth === '' || this.dayCheckInfoList.items.bodyCondition === '' || this.dayCheckInfoList.items.feeling === '' || this.dayCheckInfoList.items.nail === '') {
          this.$toast('请完善页面相关信息');
        } else {
          this.popupVisible = true;
          this.popupInfo[0].content = moment(new Date()).format('YYYY-MM-DD HH:mm');
          this.popupInfo[1].content = this.dayCheckInfoList.items.bodyTemperature;
          this.popupInfo[2].content = this.dayCheckInfoList.items.feeling;
          this.popupInfo[3].content = this.dayCheckInfoList.items.headAndMouth;
          this.popupInfo[4].content = this.dayCheckInfoList.items.bodyCondition;
          this.popupInfo[5].content = this.dayCheckInfoList.items.nail;
          this.popupInfo[6].content = this.dayCheckInfoList.memo.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\s/g, ' ');
        }
      },
      getTime() {
        this.dayTime = moment().format('HH:mm');
      },
      init() {
        if (localStorage.getItem('checkDetail')) {
          const checkData = JSON.parse(localStorage.getItem('checkDetail'));
          this.dayCheckInfoList.items.bodyTemperature = checkData.bodyTemperature;
          this.dayCheckInfoList.items.headAndMouth = checkData.headAndMouth;
          this.dayCheckInfoList.items.bodyCondition = checkData.bodyCondition;
          this.dayCheckInfoList.items.feeling = checkData.feeling;
          this.dayCheckInfoList.items.nail = checkData.nail;
        }
      },
    },
    created() {
      this.init();
      this.checkType.headAndMouth = constant.HEADANDANDMOUTH;
      this.checkType.limbInfo = constant.LIMBINFO;
      this.checkType.nailInfo = constant.NAILINFO;
    },
    components: {
      Temperature,
      ChildInfo,
      DwRadio,
      DwEmotionEnum,
      DwTemperature,
      DwDialog,
      DwPopupPrompt,
      DwInput,
    },
  };
</script>
<style lang="less" scoped>
</style>
