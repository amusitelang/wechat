<template>
  <div>
    <!--班级及老师信息-->
    <div class="card box-head">
      <el-row type="flex" align="middle">
        <el-col :span="16">
          <div style="margin-bottom: 1rem;">
            <dw-store-and-class-reveal v-bind:name="storeName" v-bind:type="0"></dw-store-and-class-reveal>
          </div>
          <el-col :span="16">
            <div>
              <dw-store-and-class-reveal v-bind:name="className" v-bind:type="1"></dw-store-and-class-reveal>
            </div>
          </el-col>
          <el-col :span="8" style="text-align: center">
            <span style="font-size: 12px; margin-right: 1rem" @click="classSelect">[切换班级]</span>
          </el-col>
        </el-col>
        <el-col :span="8" class="border-l" @touchstart.native="startPersonal" @touchmove.native="movePersonal" @touchend.native="personal">
          <dw-avatar-reveal v-bind:avatar-url="tokenTeacherInfo.photo" style="width: 50px;height: 50px;margin: 0 auto;"></dw-avatar-reveal>
          <div class="starName">{{tokenTeacherInfo.name}}</div>
          <div class="star">查看星级</div>
        </el-col>
      </el-row>
    </div>
    <div class="content-background">
      <div class="card-cell border-b">
        <div class="content-head">
          工作台
        </div>
      </div>
      <dw-sudoku :number='3' class="server-sudoku">
        <template v-for='(item,index) in workbench'>
          <sudoku-content v-bind:content="item" :key='index'>
            <dw-num-check slot="num-content" v-bind:content="item" :key='index'></dw-num-check>
          </sudoku-content>
        </template>
      </dw-sudoku>
    </div>
    <div class="content-background">
      <div class="card-cell border-b">
        <div class="content-head">
          查询
        </div>
      </div>
      <dw-sudoku :number='3' class="server-sudoku">
        <template v-for='(item,index) in inquire'>
          <sudoku-content v-bind:content="item" :key='index'></sudoku-content>
        </template>
      </dw-sudoku>
    </div>
    <div class="content-background content-background2">
      <div class="card-cell border-b">
        <div class="content-head">
          绩效工作台
        </div>
      </div>
      <dw-sudoku :number='3' class="server-sudoku">
        <template v-for='(item,index) in bonus'>
          <sudoku-content v-bind:content="item" :key='index'></sudoku-content>
        </template>
      </dw-sudoku>
    </div>
    <mt-popup
      :closeOnClickModal=false
      v-model="classSelectPopupVisible"
      position="bottom" style="width: 100%;">
      <Confirmation v-on:confirm="confirmSelect" v-on:cancel="cancelSelect"></Confirmation>
      <mt-picker value-key="name" ref="pickered" :slots="slots" ></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import Confirmation from '../../components/button/PopUpConfirmation';
  import moment from 'moment';
  // 九宫格组件
  import DwSudoku from '../../components/layout/sudoku';
  import SudokuContent from '../../components/layout/Content';
  import DwStoreAndClassReveal from '../../components/layout/base/StoreAndClass';
  import DwAvatarReveal from '../../components/layout/base/AvatarShow';

  export default {
    data() {
      return {
        classSelectPopupVisible: false,
        storeName: '',
        className: '',
        todayLesson: '',
        todayLunch: '',
        moveTouch: true,
        changeTouch: false,
        workbench: [
          {
            icon: 'icon-dayCheck',
            color: '#1db562',
            name: '入园检查',
            selectIcon: true,
            link: '/teacher/sendList?type=1',
            checkedCount: 0,
            studentCount: 0,
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-lunch',
            color: '#E7933C',
            name: '午餐通知',
            selectIcon: true,
            link: '/teacher/sendList?type=3',
            checkedCount: 0,
            studentCount: 0,
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-sleep',
            color: '#419DD1',
            name: '午睡消息',
            selectIcon: true,
            link: '/teacher/sendList?type=2',
            checkedCount: 0,
            studentCount: 0,
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-courseInfo',
            color: '#1db562',
            name: '每日课程',
            selectIcon: true,
            link: '/teacher/dayTeach/sendDetail',
            checkedCount: 0,
            studentCount: 0,
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-new-summary',
            color: '#419DD1',
            name: '日总结',
            selectIcon: true,
            link: '/teacher/sendList?type=5',
            checkedCount: 0,
            studentCount: 0,
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-new-history',
            color: '#EC6066',
            name: '自定义报告',
            link: '/teacher/customize/select',
            isJump: true,
            examined: true,
          },
        ],
        inquire: [
          {
            icon: 'icon-student-list',
            color: '#1db562',
            name: '学员名单',
            link: '/teacher/student/list',
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-history-info',
            color: '#20A7EE',
            name: '历史报告',
            link: '/teacher/history/list',
            isJump: true,
            examined: true,
          },
          {
            icon: '',
            color: '',
            name: '',
            link: '',
            isJump: true,
            examined: true,
          },
        ],
        bonus: [
          {
            icon: 'icon-new-renewals',
            color: '#f5a626',
            name: '续费跟进',
            link: '/teacher/renewalList',
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-good-scores',
            color: '#ec6066',
            name: '我的好评',
            link: '/teacher/praise',
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-my-score',
            color: '#1db562',
            name: '家长评分',
            link: '/teacher/scoreList',
            isJump: true,
            examined: true,
          },
          {
            icon: 'icon-interactive',
            color: '#EC6066',
            name: '袋鼠圈发布量',
            link: '/teacher/statistical/list',
            isJump: true,
            examined: true,
          },
          {
            icon: '',
            color: '',
            name: '',
            link: '',
            isJump: true,
            examined: true,
          },
          {
            icon: '',
            color: '',
            name: '',
            link: '',
            isJump: true,
            examined: true,
          },
        ],
      };
    },
    computed: {
      ...mapState({
        tokenTeacherInfo: state => state.teacher.tokenTeacherInfo,
        tokenClassInfoList: state => state.teacher.tokenClassInfoList,
        teacherSelectedClassId: state => state.teacher.teacherSelectedClassId,
      }),
      slots() {
        const arr = [];
        this.tokenClassInfoList.forEach((item) => {
          const obj = {};
          obj.name = `${item.store.name}-${item.name}`;
          obj.id = `${item.store.id}-${item.id}`;
          arr.push(obj);
        });
        return [{
          flex: 1,
          values: arr,
          className: 'slot1',
          textAlign: 'center',
        }];
      },
    },
    watch: {
      teacherSelectedClassId() {
        this.getSelectClassInfo();
      },
    },
    methods: {
      ...mapActions({
        getTokenTeacherInfo: 'teacher/getTokenTeacherInfo',
        getTokenClassInfoList: 'teacher/getTokenClassInfoList',
        getTodayReportCount: 'teacher/getTodayReportCount',
        getTodaySchedule: 'teacher/getTodaySchedule',
        refreshToken: 'refreshToken',
        getWeekLesson: 'getWeekLesson',
      }),
      startPersonal() {
        this.changeTouch = true;
        this.moveTouch = true;
      },
      movePersonal() {
        this.moveTouch = false;
      },
      personal() {
        this.changeTouch = false;
        if (this.moveTouch) {
          this.$router.push('/teacher/personal');
        }
      },
      classSelect() {
        this.classSelectPopupVisible = true;
      },
      // 点击确认触发
      confirmSelect() {
        const names = this.$refs.pickered.getSlotValue(0).name;
        this.storeName = names.match(/(\S*)-/)[1];
        this.className = names.match(/-(\S*)/)[1];
        const ids = this.$refs.pickered.getSlotValue(0).id;
        this.$store.commit('teacher/switchTeacherSelectedClassId', parseInt(ids.match(/-(\S*)/)[1], 10));
        this.classSelectPopupVisible = false;
      },
      // 点击取消触发
      cancelSelect() {
        this.classSelectPopupVisible = false;
      },
      getSelectClassInfo() {
        // 获取已发送报告人数
        this.getTodayReportCount().then((res) => {
          this.workbench[0].checkedCount = res.obj.morningCheck.checkedCount;
          this.workbench[0].studentCount = res.obj.morningCheck.studentCount;
          this.workbench[1].checkedCount = res.obj.lunch.checkedCount;
          this.workbench[1].studentCount = res.obj.lunch.studentCount;
          this.workbench[2].checkedCount = res.obj.nap.checkedCount;
          this.workbench[2].studentCount = res.obj.nap.studentCount;
          this.workbench[3].checkedCount = res.obj.dailyLesson.checkedCount;
          this.workbench[3].studentCount = res.obj.dailyLesson.studentCount;
          this.workbench[4].checkedCount = res.obj.leave.checkedCount;
          this.workbench[4].studentCount = res.obj.leave.studentCount;
          this.workbench[3].examined = this.workbench[3].checkedCount !== this.workbench[3].studentCount;
        });
        // 获取今日午餐和每日课程
        this.getTodaySchedule().then((res) => {
          this.todayLesson = res.obj.todayLesson;
          this.todayLunch = res.obj.todayLunch;
          if (!this.todayLesson) {
            this.workbench[3].isJump = false;
          }
          if (!this.todayLunch) {
            this.workbench[1].isJump = false;
          }
        });
      },
      init() {
        this.getTokenTeacherInfo().then((resTeacher) => {
          if (resTeacher.obj) {
            // 确定是职员才请求班级列表
            this.getTokenClassInfoList().then((res) => {
              if (res.obj.length !== 0) {
                // 显示当前选中的班级
                this.tokenClassInfoList.forEach((item) => {
                  if (this.teacherSelectedClassId === item.id) {
                    this.storeName = item.store.name;
                    this.className = item.name;
                  }
                });
                this.getWeekLesson({ date: moment().format('YYYY-MM-DD') });
                this.getSelectClassInfo();
              } else {
                this.$router.replace('/teacher/noClass');
              }
            });
          } else {
            this.$router.replace('/teacher/noStaff');
          }
        });
      },
    },
    components: {
      Confirmation,
      DwSudoku,
      SudokuContent,
      DwStoreAndClassReveal,
      DwAvatarReveal,
    },
    created() {
      this.init();
    },
  };
</script>
<style lang="less">
  .box-head{
    padding-top: 1rem;
    padding-bottom: 1rem
  }
  .changeBackground{
    background: rgba(0,0,0,0.1);
  }
  .server-sudoku{
    background: #fff;
  }
  i.icon-classIcon{
    font-size: 24px;
    margin-right: 0.5rem;
    vertical-align: middle;
    color: #EC6066;
  }
  i.icon-class{
    font-size: 20px;
    margin-right: 0.5rem;
    vertical-align: middle;
    color: #7DCCC4;
  }
  .g-avatar{
    width: 50px;
    height: 50px;
    display: block;
    border-radius: 50%;
    margin: auto;
    overflow: hidden;
    position: relative;
  }
  .g-defaultAvatar{
    background: url(../../assets/img/img/avatar/teacher_default_avator.png) no-repeat center;
    background-size: cover;
  }
  .photoAvatar{
    width: 50px;
    height: 50px;
    display: block;
    border-radius: 50%;
    margin: auto;
    overflow: hidden;
    position: relative;
    background-repeat: no-repeat;
    background-size: cover
  }
  .star{
    text-align: center;
    background-color: #F5A626;
    color: #fff;
    margin: .5rem auto 0;
    width: 5rem;
    border-radius: 1rem;
    font-size: 12px
  }
  .starName{
    text-align: center;
    margin-top:.8rem
  }
  .content-head{
    padding:0 1rem;
    height: 100%;
    line-height: 100%;
    color: #666666;
  }
  .content-background{
    margin: 10px 0;
    background: #fff
  }
  .content-background2{
    margin-bottom: 0;
  }

  .square{
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%; /* padding百分比是相对父元素宽度计算的 */
  }
  .square-inner{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; /* 铺满父元素容器，这时候宽高就始终相等了 */
  }
  .square-inner>li{
    width: calc(98% / 3);  /* calc里面的运算符两边要空格 */
    height: calc(98% / 3);
    margin-right: 1%;
    margin-bottom: 1%;
    overflow: hidden;
  }
  .flex{
    display: flex;
    flex-wrap: wrap;
  }
  .flex>li:nth-of-type(3n){ /* 选择个数是3的倍数的元素 */
    margin-right: 0;
  }
  .flex>li:nth-of-type(n+7){  /* 选择倒数的三个元素，n可以取0 */
    margin-bottom: 0;
  }
</style>
