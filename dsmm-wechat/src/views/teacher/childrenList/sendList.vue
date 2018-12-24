<template>
  <div>
    <div class="card" v-if="classReadingChildList.length !== 0">
      <div class="card-cell color-info">
        <div v-if="type === '1'">
          入园检查信息列表
        </div>
        <div v-else-if="type === '2'">
          午睡信息列表
        </div>
        <div v-else-if="type === '3'">
          午餐信息列表
        </div>
        <div v-else-if="type === '4'">
          课程信息列表
        </div>
        <div v-else-if="type === '5'">
          日总结信息列表
        </div>
        <div v-else-if="type === '6'">
          添加自定义信息
        </div>
      </div>
      <div class="card-cell" v-for="(item,index) in classReadingChildList" :key="index">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="12">
            <DwChildInfo  v-if="checkedStudentIds.indexOf(item.child.id) < 0 || type === '6'" :name="item.child.name" :gender="item.child.gender" :birthday="item.child.birthday">
              <div slot="avatar" style="width: 34px;height: 34px;">
                <img :src="item.child.photo" alt="" v-if="item.child.photo" style="width: 100%;height: 100%">
                <img src="../../../assets/img/img/avatar/defaultAvatar.png" alt="" v-if="!item.child.photo" style="width: 100%;height: 100%">
              </div>
              <div slot="leave-content">
                <dw-label v-if="type !== '6'" class="leave-info-list" type="background" :content="leaveInfo" v-for="(leaveInfo, line) in item.child.leaveInfoList" :key="line"></dw-label>
              </div>
            </DwChildInfo>
            <DwChildInfo  v-else :name="item.child.name" :gender="item.child.gender" :birthday="item.child.birthday">
              <div slot="avatar" style="width: 34px;height: 34px;">
                <img :src="item.child.photo" alt="" v-if="item.child.photo" style="width: 100%;height: 100%">
                <img src="../../../assets/img/img/avatar/defaultAvatar.png" alt="" v-if="!item.child.photo" style="width: 100%;height: 100%">
              </div>
              <div slot="leave-content">
                <dw-label v-if="type !== '6'" class="leave-info-list" type="background" :content="leaveInfo" v-for="(leaveInfo, line) in item.child.leaveInfoList" :key="line"></dw-label>
              </div>
            </DwChildInfo>
          </el-col>
          <el-col style="text-align: right" :span="12">
            <div class="button-list"  @click="amend(item, type)" v-if="type === '1' || type === '5'">
              <span v-if="type === '1'">
                请假
              </span>
              <span v-else-if="type === '5'">
                晚接送
              </span>
            </div>
            <div class="button-list-background" v-if="checkedStudentIds.indexOf(item.child.id) < 0 || type === '6'" @click="sendDetail(item)">
              <i class="iconfont icon-add" style="line-height: normal;font-size: 12px;"></i>
              <span v-if="type === '1'">
                检查
              </span>
              <span v-else-if="type === '2'">
                午睡
              </span>
              <span v-else-if="type === '3'">
                午餐
              </span>
              <span v-else-if="type === '4'">
                课程
              </span>
              <span v-else-if="type === '5'">
                日总结
              </span>
              <span v-else-if="type === '6'">
                自定义信息
              </span>
            </div>
            <div v-else-if="checkedStudentIds.indexOf(item.child.id) >= 0 && type !== '6' && type !== '2'" class="button-inline-list-background">
              已录入
            </div>
            <div style="flex: 1" v-else-if="checkedStudentIds.indexOf(item.child.id) >= 0 && type !== '6' && type === '2'" class="button-list" @click="sendDetail(item)">
              修改午睡
            </div>
            <div style="width:100%;margin-top: 10px">
              <dw-label description="录入时间：" :content="item.child.sendTime" type="green" v-if="item.child.sendTime && type !== '6'"></dw-label>
              <dw-label description="不做考核" type="orange" v-if="item.child.labels.length !== 0 && !item.child.sendTime && item.child.decide && type !== '6'"></dw-label>
              <dw-label description="应录入时间：" type="gray" :content="item.child.timelyTimeTwo" v-if="item.child.labels.length === 0 && !item.child.sendTime && type !== '5' && type !== '6'"></dw-label>
              <dw-label description="应录入时间：" type="gray" :content="item.child.timelyTimeTwo" v-if="!item.child.decide && !item.child.sendTime && type === '5' && type !== '6'"></dw-label>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <blank v-if="classReadingChildList.length === 0" text="目前本班级没有在读学员哦~">
    </blank>
    <dw-dialog v-model="openSummaryPopup" v-on:confirm="confirm" widthPercent="70%" v-bind:type="true">
      <div slot="popup-header">
        <span>晚接送记录</span>
      </div>
      <div slot="popup-content">
        <textarea rows="5" placeholder="请填写晚接送原因" v-model="modifySummary.memo"></textarea>
      </div>
    </dw-dialog>
    <dw-dialog v-model="openCheckPopup" v-on:confirm="confirmCheck" widthPercent="70%" v-bind:type="true">
      <div slot="popup-header">
        <span>请假记录</span>
      </div>
      <div slot="popup-content">
        <dw-radio v-model="modifyCheck.selected" :options="modifyCheck.selectArray" style="margin-bottom: 10px"></dw-radio>
        <textarea rows="5" placeholder="请填写请假原因" v-model="modifyCheck.memo"></textarea>
      </div>
    </dw-dialog>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex';
  import ChildInfo from '../../../components/layout/ChildInfo';
  import Blank from '../../../components/layout/Blank';
  import DwChildInfo from '../../../components/planning/ChildInfoGrid';
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwRadio from '../../../components/planning/base/input/Radio';
  import rule from '../../../config/validate';
  import onValidate from '../../../utils/validate';
  // 文案
  import { LEAVEINFOLIST } from '../../../config/constant';
  // 标签组件
  import DwLabel from '../../../components/planning/base/layout/Label';

  const { memo } = rule;
  const ruleObj = {
    memo,
  };

  export default {
    name: 'DayCheckList',
    data() {
      return {
        let: '123',
        type: '',
        checkedStudentIds: [],
        openSummaryPopup: false,
        openCheckPopup: false,
        modifySummary: {
          childId: '',
          memo: '',
        },
        modifyCheck: {
          childId: '',
          memo: '',
          value: '',
          selected: '',
          type: 0,
          selectArray: [{ label: '今日请假', type: 1 }, { label: '晚到', type: 2 }],
        },
        classReadingChildList: [],
      };
    },
    components: {
      ChildInfo,
      Blank,
      DwChildInfo,
      DwDialog,
      DwRadio,
      DwLabel,
    },
    computed: {
      ...mapState({
        teacherSelectedClassId: state => state.teacher.teacherSelectedClassId,
        // classReadingChildList: state => state.teacher.classReadingChildList,
      }),
    },
    methods: {
      ...mapActions({
        getTodayReportedChildList: 'teacher/getTodayReportedChildList',
        getTeacherSelectedChildInfo: 'teacher/getTeacherSelectedChildInfo',
        getClassReadingChildList: 'teacher/getClassReadingChildList',
        postLeave: 'teacher/postLeave',
      }),
      amend(item, index) {
        if (index === '5') {
          this.openSummaryPopup = true;
          this.modifySummary.childId = item.child.id;
        } else if (index === '1') {
          this.openCheckPopup = true;
          this.modifyCheck.childId = item.child.id;
        }
      },
      confirm() {
        console.log('日总结时临时早晚接提交事件');
        const list = Object.keys(ruleObj).map(item => onValidate(this.modifySummary[item], ruleObj[item]))
          .filter(item => !item.valid);
        if (list.length > 0) {
          this.$toast(list[0].errorMessage);
          return;
        }
        this.postLeave({
          childId: this.modifySummary.childId,
          memo: this.modifySummary.memo,
          type: 4,
        }).then((res) => {
          this.modifySummary.memo = '';
          this.classChildList();
        });
      },
      confirmCheck() {
        this.modifyCheck.selectArray.forEach((item) => {
          if (this.modifyCheck.selected === item.label) {
            this.modifyCheck.type = item.type;
          }
        });
        const list = Object.keys(ruleObj).map(item => onValidate(this.modifyCheck[item], ruleObj[item]))
          .filter(item => !item.valid);
        if (list.length > 0) {
          this.$toast(list[0].errorMessage);
          return;
        }
        console.log('晨检请假提交事件');
        this.postLeave({
          childId: this.modifyCheck.childId,
          memo: this.modifyCheck.memo,
          type: this.modifyCheck.type,
        }).then((res) => {
          this.classChildList();
        });
      },
      sendDetail(item) {
        // 请求孩子详情并存入store，供后面页面直接使用
        this.getTeacherSelectedChildInfo({
          childId: item.child.id,
        });
        if (this.type === '1') {
          this.$router.push({
            path: '/teacher/dayCheck/sendDetail',
          });
        } else if (this.type === '2') {
          this.$router.push({
            path: '/teacher/daySleep/sendDetail',
          });
        } else if (this.type === '3') {
          this.$router.push({
            path: '/teacher/dayLunch/sendDetail',
          });
        } else if (this.type === '4') {
          this.$router.push({
            path: '/teacher/dayCheck/sendDetail',
          });
        } else if (this.type === '5') {
          this.$router.push({
            path: '/teacher/daySummary/sendDetail',
          });
        } else if (this.type === '6') {
          this.$router.push({
            path: '/teacher/customize/sendDetail?type=6',
          });
        }
      },
      // 获取已发送报告的学生信息(进入列表页)
      getStudentCheckList() {
        const payload = {
          classId: this.teacherSelectedClassId,
          type: this.type,
        };
        this.getTodayReportedChildList(payload).then((res) => {
          const list = [];
          res.obj.childList.forEach((item) => {
            const obj = {};
            obj.id = item.id;
            obj.name = item.name;
            list.push(obj);
          });
          list.forEach((item) => {
            this.checkedStudentIds.push(item.id);
          });
        });
      },
      // 获取学员列表
      classChildList() {
        this.getClassReadingChildList({
          classId: this.teacherSelectedClassId,
          type: this.type,
        }).then((res) => {
          res.obj.forEach((item) => {
            if (item.child) {
              const r1 = [];
              LEAVEINFOLIST.forEach((leave) => {
                item.child.labels.forEach((label) => {
                  if (label === leave.type) {
                    r1.push(leave.label);
                    item.child.leaveInfoList = r1;
                  }
                });
              });
              item.child.labels.forEach((index) => {
                item.child.decide = !(index === 2 && this.type.toString() === '5');
                return item.child.decide;
              });
              if (item.child.timelyTime) {
                item.child.timelyTimeTwo = `${item.child.timelyTime}前`;
              }
            }
          });
          this.classReadingChildList = res.obj;
        });
      },
      init() {
        this.type = this.$route.query.type;
        this.classChildList();
        this.getStudentCheckList();
      },
    },
    created() {
      this.init();
    },
  };
</script>
<style scoped lang="less">
  @import '../../../assets/css/global';
  @import '../../../components/planning/vars';
  .button-list{
    display: inline-block;
    border-radius: 0.25rem;
    text-align: center;
    line-height: normal;
    padding: .5rem .8rem;
    font-weight: lighter;
    border: 1px solid @color-primary;
    color: @color-primary;
    font-size: 12px;
  }
  .button-list-background{
    display: inline-block;
    border-radius: 0.25rem;
    text-align: center;
    line-height: normal;
    padding: .5rem .8rem;
    font-weight: lighter;
    background: @color-primary;
    border: 1px solid @color-primary;
    color: @color-white;
    font-size: 12px;
  }
  .button-inline-list{
    display: inline-block;
    border-radius: 0.25rem;
    text-align: center;
    padding: .5rem .8rem;
    line-height: normal;
    font-weight: lighter;
    border: 1px solid @color-text-grey;
    color: @color-text-grey;
    font-size: 12px;
  }
  .button-inline-list-background{
    display: inline-block;
    border-radius: 0.25rem;
    line-height: normal;
    text-align: center;
    padding: .5rem .8rem;
    font-weight: lighter;
    background: #E8E8E8;
    border: 1px solid #E8E8E8;
    color: @font_color;
    font-size: 12px;
  }
  textarea{
    outline: none;
    resize:none;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    border-color: #cccccc;
    box-sizing: border-box;
  }
  .leave-info-list{
    margin-right: 6px;
  }
  .leave-info-list:last-of-type{
    margin-right: 0;
  }
</style>

