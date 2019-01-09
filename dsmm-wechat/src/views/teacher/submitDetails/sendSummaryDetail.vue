<template>
  <div class="summary">
    <div class="card border-b">
      <child-info style="padding: .5rem 0;" :name="teacherSelectedChildInfo.name"
                :img="teacherSelectedChildInfo.photo"></child-info>
    </div>
    <dw-row :borderBottom="true" :arrow="true" style="background: #fff;margin:.8rem 0 0;">
      <div slot="rowContent">
        <div  style="overflow:hidden;" @click="relation">
          <div style="float: left">接宝宝的家长</div>
          <div style="float: right;color: #a8a8a8;"><span v-if="daySummaryInfoList.items.relationPn">{{daySummaryInfoList.items.relationPn}}</span><span v-else>妈妈</span>
          </div>
        </div>
      </div>
    </dw-row>
    <div class="card" style="margin-top: 0">
      <Temperature class="card-cell" style="padding-top: 0" title="离园体温" v-on:temperature="listenToMyBoy"
                   v-bind:saveInfo="daySummaryInfoList.items.bodyTemperature"></Temperature>
      <dw-shit-enum class="card-cell" style="padding-top: 0" v-model="daySummaryInfoList.items.shit"></dw-shit-enum>
      <dw-emotion-enum class="card-cell" style="padding-top: 0" title="离园情绪" v-model="daySummaryInfoList.items.feeling"></dw-emotion-enum>
      <dw-drink-enum class="card-cell" style="padding-top: 0" v-model="daySummaryInfoList.items.drinkWater"></dw-drink-enum>
      <div class="detail_memo">
        <div style="padding: 10px 0 1rem;text-align: center">
          每日寄语
        </div>
        <dw-input type-color="gray" v-model="daySummaryInfoList.memo" type="multi"></dw-input>
      </div>
      <!--每日寄语结束-->
    </div>
    <div class="button-block_primary" @click="sureSubmit">
      提交
    </div>

    <!--弹出提交模态框-->
    <dw-dialog v-model="popupSubmit"  widthPercent="80%" v-on:confirm="success" :type="true" @touchmove.prevent>
      <div slot="popup-header">
        日总结报告
      </div>
      <div slot="popup-content">
        <dw-popup-prompt :popup-info-list="popupInfo"></dw-popup-prompt>
      </div>
    </dw-dialog>
    <!--宝宝关系模态框-->
    <mt-popup
      v-model="parentRelation"
      position="bottom"
      style="width: 100%" @touchmove.prevent>
      <confirmation v-on:confirm="confirmSelect" v-on:cancel="cancelSelect" @touchmove.prevent></confirmation>
      <mt-picker ref="picker" :slots="slots" value-key="name"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
  import Temperature from '../../../components/report/InputTemperature';
  import ChildInfo from '../../../components/layout/ChildInfo';
  import Confirmation from '../../../components/button/PopUpConfirmation';
  import { mapActions, mapState } from 'vuex';
  import moment from 'moment';
  // 新组件
  import SelectShit from '../../../components/report/newReportDetailComponents/SelectShit';
  import SelectEmotion from '../../../components/report/newReportDetailComponents/SelectEmotion';
  // 全局方法
  import constant from '../../../config/constant';
  // 重构组件
  import DwDrinkEnum from '../../../components/planning/base/input/DrinkEnum';
  import DwEmotionEnum from '../../../components/planning/base/input/EmotionEnum';
  import DwShitEnum from '../../../components/planning/base/input/ShitEnum';
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwPopupPrompt from '../../../components/planning/base/layout/PopupPrompt';
  import DwRow from '../../../components/planning/base/layout/Row';
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    name: 'SummaryDetail',
    data() {
      return {
        flag: true,
        popupSubmit: false,
        parentRelation: false,
        relationPn: '',
        relationValue: '',
        moveTime: '',
        slots: [
          {
            flex: 1,
            values: [
              { name: '爸爸', value: 'father' },
              { name: '妈妈', value: 'mother' },
              { name: '爷爷', value: 'grandpa' },
              { name: '奶奶', value: 'grandma' },
              { name: '外公', value: 'grandfather' },
              { name: '外婆', value: 'grandmother' },
              { name: '其他', value: 'other' },
            ],
            className: 'slot4',
            textAlign: 'center',
            value: '1',
          },
        ],
        selectType: {
          SelectShitType: '',
          moodType: '',
          moodIcon: '',
          moodIconColor: '',
        },
        popupInfo: [
          {
            title: '离园时间',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '离园体温',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '是否大便',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '情绪状况',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '饮水情况',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '老师寄语',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
        ],
      };
    },
    components: {
      Temperature,
      ChildInfo,
      Confirmation,
      SelectShit,
      SelectEmotion,
      DwDrinkEnum,
      DwEmotionEnum,
      DwShitEnum,
      DwDialog,
      DwPopupPrompt,
      DwRow,
      DwInput,
    },
    computed: {
      ...mapState({
        teacherSelectedChildInfo: state => state.teacher.teacherSelectedChildInfo,
        daySummaryInfoList: state => state.teacher.daySummaryInfoList,
        loading: state => state.loading,
      }),
    },
    // watch: {
    //   drinkEnum(val) {
    //     console.log(val);
    //   },
    // },
    methods: {
      ...mapActions({
        postReport: 'teacher/postReport',
      }),
      //        利用$on $emit将温度读取到，将情绪状态获取到
      // 温度
      listenToMyBoy(someData) {
        this.daySummaryInfoList.items.bodyTemperature = someData;
      },
      // 是否大便(新组件)
      shitType(index) {
        this.selectType.SelectShitType = index;
      },
      // 离园情绪（新组件）
      selectMood(index) {
        this.daySummaryInfoList.items.feeling = index;
      },
      //      提交
      sureSubmit() {
        constant.SELECTSHIT.forEach((item) => {
          if (this.selectType.SelectShitType === item.type) {
            this.daySummaryInfoList.items.shit = item.label;
          }
        });
        constant.LEAVEMOODSTATUS.forEach((item) => {
          if (this.daySummaryInfoList.items.feeling === item.label) {
            this.daySummaryInfoList.items.feeling = item.label;
            this.selectType.moodIcon = item.icon;
            this.selectType.moodIconColor = item.color;
            this.popupInfo[3].icon = item.icon;
            this.popupInfo[3].iconColor = item.color;
          }
        });
        if (this.daySummaryInfoList.items.bodyTemperature !== '' && this.daySummaryInfoList.items.feeling !== '' && this.moveTime !== ''
          && this.daySummaryInfoList.items.drinkWater !== '' && this.daySummaryInfoList.items.shit !== '') {
          this.popupSubmit = true;
          this.popupInfo[0].content = this.moveTime;
          this.popupInfo[1].content = this.daySummaryInfoList.items.bodyTemperature;
          this.popupInfo[2].content = this.daySummaryInfoList.items.shit;
          this.popupInfo[3].content = this.daySummaryInfoList.items.feeling;
          this.popupInfo[4].content = this.daySummaryInfoList.items.drinkWater;
          this.popupInfo[5].content = this.daySummaryInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n');
        } else {
          this.$toast('请完善页面相应信息');
        }
      },
      success() {
        this.popupSubmit = false;
        const data = JSON.stringify({
          bodyTemperature: this.daySummaryInfoList.items.bodyTemperature,  // 体温
          feeling: this.daySummaryInfoList.items.feeling,   // 情绪
          leaveTime: this.moveTime, // 离开时间
          drinkWater: this.daySummaryInfoList.items.drinkWater,  // 饮水情况
          relationPn: this.daySummaryInfoList.items.relationPn ? this.daySummaryInfoList.items.relationPn : '妈妈',  // 接走宝宝的人的关系
          relation: this.daySummaryInfoList.items.relationValue ? this.daySummaryInfoList.items.relationValue : 'mother',
          shit: this.daySummaryInfoList.items.shit,   // 大便情况
        });
        if (this.flag) {
          this.flag = false;
          this.postReport({
            type: 5,
            items: data,
            memo: this.daySummaryInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'), // 每日寄语
          }).catch(() => {
            this.flag = true;
          });
        }
        localStorage.setItem('summaryDetail', data);
      },
      error() {
        this.popupSubmit = false;
      },
      confirmSelect() {
        this.daySummaryInfoList.items.relationPn = this.$refs.picker.getSlotValue(0).name;
        this.daySummaryInfoList.items.relationValue = this.$refs.picker.getSlotValue(0).value;
        this.parentRelation = false;
      },
      cancelSelect() {
        this.parentRelation = false;
      },
      relation() {
        this.parentRelation = true;
      },
      init() {
        if (localStorage.getItem('summaryDetail')) {
          const summaryData = JSON.parse(localStorage.getItem('summaryDetail'));
          this.daySummaryInfoList.items.bodyTemperature = summaryData.bodyTemperature;
          this.daySummaryInfoList.items.feeling = summaryData.feeling;
          this.daySummaryInfoList.items.drinkWater = summaryData.drinkWater;
          this.daySummaryInfoList.items.relationPn = summaryData.relationPn;
          this.daySummaryInfoList.items.relationValue = summaryData.relation;
          this.daySummaryInfoList.items.shit = summaryData.shit;
        }
      },
    },
    //    通过路由将值传了进来并进行渲染
    created() {
      this.init();
      const d = new Date();
      this.moveTime = moment(d).format('a h:mm');
    },
  };
</script>
<style lang="less" scoped>
  @import '../../../assets/css/global';

  .selectRight {
    background: #b2e799;
    color: #ffffff;
  }

  .old-card-cell {
    padding: 0 0 1rem 0;
    overflow: hidden;
    position: relative;
    a {
      text-decoration: none;
    }
    .card-row-container {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
</style>
