<template>
  <div>
    <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }"  ref="wrapper">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  :bottomDropText='bottomDropTextVal' :bottomLoadingText='bottomLoadingTextVal' @bottom-status-change="handleBottomChange"  :autoFill="false" style="background: #f0eff5"  ref="loadmore">
        <div class="card">
          <el-row style="text-align: center;">
            <el-col :span="12" class="border-r" @click.native="jumpRouting('/service/center')">
              <div style="padding: .9rem 0 .3rem;margin-top: 2px;line-height: normal">
                <i class="iconfont icon-daishufuwu"></i>
              </div>
              <div class="loginFont" style="padding: 0 0 .5rem;">袋鼠服务</div>
            </el-col>
            <el-col :span="12" @click.native="jumpRouting(`/reserve/inputInfo?childId=${selectedChildId}`)">
              <div style="padding: .9rem 0 .3rem;margin-top: 2px;line-height: normal">
                <i class="iconfont icon-reservation"></i>
              </div>
              <div class="loginFont" style="padding: 0 0 .5rem;">预约活动</div>
            </el-col>
          </el-row>
          <el-row style="text-align: center;" class="border-t">
            <el-col :span="12" class="border-r" @click.native="jumpRouting(`/service/feedback?childId=${selectedChildId}&className=${encodeURIComponent(selectedClassName)}`)">
              <div style="padding: 1.2rem 0 .5rem;margin-top: 2px;line-height: normal">
                <i class="iconfont icon-option-feedback"></i>
              </div>
              <div class="loginFont" style="padding: 0 0 .5rem;">意见反馈</div>
            </el-col>
            <el-col :span="12" @click.native="jumpRouting(`/service/personal?childId=${selectedChildId}`)" style="position: relative;">
              <div style="position: absolute;top: .6rem;right: 1rem;width: 4rem">
                <i class="iconfont icon-invite" style="font-size: 20px;color: #1db562;"></i>
              </div>
              <div style="padding: 1.5rem 0 .5rem">
                <i class="iconfont icon-parent-personal"></i>
              </div>
              <div class="loginFont" style="padding: 0 0 .5rem;">个人中心</div>
            </el-col>
          </el-row>
        </div>
        <div style="width: 100%;height: 1rem;background: #F2F2F2;"></div>
        <div style="box-shadow: 0 5px 8px #cccccc;z-index: 12;">
          <div class="border-b" style="width: 100%;height: 46px;line-height: 46px;background: #ffffff;">
            <div style="float: left;padding-left: 1rem;font-weight: bolder;color: #f5a627;overflow:hidden;">
              <div style="width: 20px;height: 46px;float:left;">
                <img src="../../assets/img/icon/parentIndex/parent_head_dynamics.png" alt="" style="width: 17px;height: 17px;vertical-align:middle;">
              </div>
              <div style="height: 46px;line-height: 50px;float:left;">
                宝宝动态
              </div>
            </div>
            <div style="float: right;padding-right: 20px;font-size: 12px" @click="switchChildren">
              <div style="float:left;margin: 8px 0;border-radius: 50%; overflow: hidden; width: 30px; height: 30px; position: relative">
                <img v-if="this.selectedChildPhoto" :src="selectedChildPhoto" alt="" style="width: 100%; vertical-align: middle; top: 50%; position: absolute; transform: translateY(-50%)">
                <img v-else-if="!this.selectedChildPhoto" src="../../assets/img/img/avatar/defaultAvatar.png" alt="" style="width: 100%; vertical-align: middle; top: 50%; position: absolute; transform: translateY(-50%)">
              </div>
              <div style="margin-left: 10px;float:left;"><div style="color: #f5b553;float:left;">{{modeValue}}&nbsp;&nbsp;</div><div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 4rem;float: left">{{selectedClassName}}</div>
                <div style="float: left;margin-top: .2rem">
                <img src="../../assets/img/icon/global/arrow-right.png" alt="" style="width: .5rem;height: 1rem;">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--:top-method 顶部下拉刷新的方法-->
        <!--:bottom-method="loadBottom" 底部上拉加载的方法-->
        <div>
          <ShowReportDetail  v-if="searchCondition.total !== 0"  v-for="(item, index) in reportList" :key="index" :report="item" :childName="modeValue" :singleStudent="selectedChildId" style="margin-bottom: 10px"></ShowReportDetail>
          <ParentInitial  v-if="searchCondition.total === 0" v-bind:childName="modeValue"></ParentInitial>
        </div>
        <div style="padding: 15px;">
          <div style="width: 120px;overflow:hidden;margin: 0 auto">
            <i class="iconfont icon-uparrow"></i>
            <span style="color: #d6d6d6;">上拉加载更多</span>
          </div>
        </div>
      </mt-loadmore>
    </div>
    <mt-popup
      v-model="popupVisible"
      :closeOnClickModal="false"
      position="bottom" style="width: 100%">
      <Confirmation v-on:confirm="selectSuccess" v-on:cancel="selectCancel"></Confirmation>
      <mt-picker ref="pickered" :slots="slots" value-key="name"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import ShowReportDetail from '../../components/report/ShowReportDetail';
  import Confirmation from '../../components/button/PopUpConfirmation';
  import ParentInitial from '../../components/report/ParentInitial';

  export default {
    data() {
      return {
        likeList: [],
        // 上拉加载，下拉刷新
        searchCondition: {
          pageVal: 1,
          pageSize: 10,
          page: 0,
          total: 0,
        },
        total: 0,
        allLoaded: false, // 是否可以上拉属性，false为可以上拉，true为禁止上拉
        bottomDropTextVal: '释放更新',
        bottomLoadingTextVal: '加载中...',
        bottomStatus: '',
        // 结束
        content: '', // 评论内容
        modeValue: '',  // 学生姓名
        popupVisible: false,
        wrapperHeight: 0,
        reportList: [],
      };
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      if (document.getElementsByClassName('page-loadmore-wrapper')) {
        setTimeout(() => {
          this.$nextTick(() => {
            document.getElementsByClassName('page-loadmore-wrapper')[0].addEventListener('scroll', () => {
              this.$store.commit('savePositionScroll', document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop);
            });
          });
        }, 1000);
      }
    },
    activated() {  // activated 为keep-alive加载时调用
      this.refreshToken().then(() => {
        this.getParentChildList().then((res) => {
          // // 获取宝宝动态信息
          const data = [];
          res.obj.forEach((item) => {
            if (item.classList.length !== 0) {
              data.push(item);
            }
          });
          if (data.length !== 0) {
            this.getList();
          }
        });
        if (this.saveScroll > 0) {
          document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop = this.saveScroll;
        }
      });
    },
    // beforeRouteEnter(to, from, next) {
    //   if (from.name === '绑定成功') {
    //     console.log(from.name);
    //     console.log('此处应该刷新');
    //     location.reload();
    //     next();
    //   } else {
    //     next();
    //   }
    // },
    // beforeRouteLeave(to, from, next) {
    //   this.$store.commit('savePositionScroll', document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop);
    //   next();
    // },// 路由离开这个页面时的操作的钩子函数
    beforeUpdate() {
      this.$nextTick(() => {
        document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop = this.saveScroll;
      });
    },
    components: {
      ShowReportDetail,
      Confirmation,
      ParentInitial,
    },
    computed: {
      ...mapState({
        childList: state => state.parent.childList,
        selectedChildId: state => state.parent.selectedChildId,
        selectedChildName: state => state.parent.selectedChildName,
        selectedClassId: state => state.parent.selectedClassId,
        selectedClassName: state => state.parent.selectedClassName,
        selectedChildPhoto: state => state.parent.selectedChildPhoto,
        saveScroll: state => state.saveScroll,
      }),
      slots() {
        const data = [];
        const result = [{
          flex: 1,
          values: data,
          className: 'slot1',
          textAlign: 'center',
        }];
        this.$store.state.parent.childList.forEach((item) => {
          item.classList.forEach((object) => {
            const obj = {};
            obj.classId = object.id;
            obj.name = `${object.name}-${item.name}`;
            obj.childId = item.id;
            obj.classList = item.classList;
            obj.parent = item.parent;
            obj.photo = item.photo;
            data.push(obj);
          });
        });
        this.modeValue = this.selectedChildName;
        return result;
      },
    },
    watch: {
      selectedChildId: [
        function getChildBeforeList(val, oldVal) {
          // // 获取宝宝动态信息
          this.getChildBeforeList();
        },
      ],
      selectedClassId: [
        function getChildInfoList(val, oldVal) {
          // // 获取宝宝动态信息
          this.getChildBeforeList();
        },
      ],
    },
    methods: {
      ...mapActions({
        getParentChildList: 'parent/getParentChildList',
        getReportList: 'parent/getReportList',
        postReportLike: 'postReportLike',
        postReportComment: 'postReportComment',
        getChildInfo: 'getChildInfo',
        refreshToken: 'refreshToken',
      }),
      // getScrollingElement() {
      //   const d = document;
      //   return d.documentElement.scrollHeight > d.body.scrollHeight && d.compatMode.indexOf('CSS1') === 0
      //     ? d.documentElement
      //     : d.body;
      // },
      // 路由跳转
      jumpRouting(index) {
        this.$router.push(index);
      },
      // 上拉加载
      loadBottom() {
        this.searchCondition.pageVal += 1;
        this.getList();
        this.$refs.loadmore.onBottomLoaded();
      },
      // 获取报告列表
      getList() {
        if (this.searchCondition.pageVal === 0) {
          this.getChildBeforeList();
        } else if (this.searchCondition.pageVal !== 0) {
          if (this.searchCondition.page <= this.searchCondition.total) {
            this.getReportList({
              classId: this.selectedClassId,
              childId: this.selectedChildId,
              pageNumber: this.searchCondition.pageVal,
            }).then((res) => {
              this.searchCondition.page = this.searchCondition.page + res.obj.list.length;
              this.total = res.obj.total;
              if (this.searchCondition.page <= this.searchCondition.total) {
                res.obj.list.forEach((item) => {
                  this.reportList.push(item);
                });
              }
              return this.reportList;
            });
          } else if (this.searchCondition.page > this.searchCondition.total) {
            this.allLoaded = true;
          }
        }
      },
      getChildBeforeList() {
        // 获取宝宝动态信息
        this.getReportList({
          classId: this.selectedClassId,
          childId: this.selectedChildId,
        }).then((res) => {
          this.reportList = res.obj.list;
          this.searchCondition.page = res.obj.list.length;
          this.searchCondition.total = res.obj.total;
        });
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      // 切换学生班级信息
      switchChildren() {
        this.popupVisible = true;
      },
      // 改变state中parentSelectedChildId和storeChildName以及parentSelectedClassId的值
      selectSuccess() {
        this.$store.commit('parent/switchSelectedChildId', this.$refs.pickered.getSlotValue(0).childId);
        this.$store.commit('parent/switchSelectedClassId', this.$refs.pickered.getSlotValue(0).classId);
        this.modeValue = this.selectedChildName;
        this.popupVisible = false;
      },
      selectCancel() {
        this.popupVisible = false;
      },
    },
    created() {
      this.refreshToken().then(() => {
        this.getParentChildList().then((res) => {
          // // 获取宝宝动态信息
          const data = [];
          res.obj.forEach((item) => {
            if (item.classList.length !== 0) {
              data.push(item);
            }
          });
          if (data.length !== 0) {
            this.getChildBeforeList();
          }
        });
      });
    },
  };
</script>
<style lang="less" scoped>
  .logined {
    width: 49.69%;
    height: 60px;
    border-right: 1px #D7D7D7 solid;
    border-bottom: 1px #D7D7D7 solid;
    display: block;
    float: left;
  }
  .logined .loginFont {
    text-align: center;
    line-height: 23px;
    color: black;
    font-size: 12px;
    font-weight: 500;
  }

  .logined:nth-child(2n) {
    border-right: none;
  }

  .logined:nth-child(3) {
    border-bottom: none;
  }

  .logined:nth-child(4) {
    border-bottom: none;
  }
  .page-loadmore-wrapper{
    overflow:auto;
    -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
  }
  i.icon-daishufuwu{
    font-size: 38px;
    color: #f5a626;
  }
  i.icon-reservation{
     font-size: 38px;
     color: #ec6066;
  }
  i.icon-option-feedback{
    font-size: 30px;
    color: #488dc9;
  }
  i.icon-parent-personal{
    font-size: 40px;
    color: #1db562;
  }
  i.icon-uparrow{
    color: #d6d6d6;
  }
</style>
