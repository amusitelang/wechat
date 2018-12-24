<template>
  <div>
    <div class="card layout-changeBackground" style="overflow:hidden;">
      <div class="list-left">
        <div style="line-height: normal">{{statisticalInfo.year}}年{{statisticalInfo.month}}月</div>
        <div style="line-height: normal">班级已发布量</div>
      </div>
      <div class="list-right">
        <span class="layout-fraction">{{statisticalInfo.count}}</span>
        <span style="font-size: 12px">条</span>
      </div>
    </div>
    <div class="layout-quality">
      <div class="border-r layout-small">
        <div>应发布量</div>
        <div>
          <span>{{statisticalInfo.targetCount}}</span>
          <span>条</span>
        </div>
      </div>
      <div class="border-r layout-small">
        <div>及时量/率</div>
        <div>
          <span>{{statisticalInfo.timelyCount}}</span>
          <span>条</span>
          <span class="percentage">{{(statisticalInfo.timelyPercent * 100).toFixed(2)}}%</span>
        </div>
      </div>
      <div class="layout-small">
        <div>互动量/率</div>
        <div>
          <span>{{statisticalInfo.interactCount}}</span>
          <span>条</span>
          <span class="percentage">{{(statisticalInfo.interactPercent * 100).toFixed(2)}}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    data() {
      return {
        statisticalInfo: {},
      };
    },
    computed: {
      ...mapState({
        teacherSelectedClassId: state => state.teacher.teacherSelectedClassId,
      }),
    },
    methods: {
      ...mapActions({
        getStatisticalDetail: 'teacher/getStatisticalDetail',
      }),
      getData() {
        this.getStatisticalDetail({
          classId: this.teacherSelectedClassId,
          year: this.$route.query.year,
          month: this.$route.query.month,
        }).then((res) => {
          this.statisticalInfo = res.obj;
        });
      },
    },
    created() {
      this.getData();
    },
  };
</script>
<style lang="less" scoped>
  .list-left{
    padding: .7rem 0;
    float: left;
    div:first-child {
      color: #1a1a1a;
      font-weight: bold;
    }
    div:nth-child(2) {
      color: #999999;
      font-size: 12px;
    }
  }
  .list-right{
    float: right;
    color: #f5a623;
    padding: 1.2rem 0;
    .layout-fraction{
      font-weight: bold;
      font-size: 18px;
    }
  }
  .card{
    margin: 0 0 .5rem;
  }
  .layout-quality{
    display: flex;
    background-color: #fff;
    padding: 10px 0;
    margin-bottom: 5px;
    div{
      flex: 1;
      text-align: center;
      padding-top: .5rem;
      div:first-child {
        color: #1a1a1a;
      }
      div:last-child {
        color: #f5a623;
        span:first-child {
          font-weight: bold;
          font-size: 18px;
        }
        span.percentage {
          color: #999999;
          font-size: 12px;
        }
        span:nth-child(2) {
          font-size: 12px;
        }
      }
    }
  }
  .layout-small{
    padding: 6px 0;
  }
  .card-cell {
    color: #797979;
  }
</style>
