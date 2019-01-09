<template>
  <div>
    <div v-if="feeFollowList.length !== 0">
      <renewal-fee-child-info class="border-b leabel" v-for="(item, index) in feeFollowList" :key="index" v-bind:childInfo="item" v-bind:isJump="true"></renewal-fee-child-info>
    </div>
    <blank v-else-if="feeFollowList.length === 0" text="目前本班级没有在读学员哦~"></blank>
  </div>
</template>
<script>
  import moment from 'moment';
  import { mapState, mapActions } from 'vuex';
  import RenewalFeeChildInfo from '../../../components/layout/RenewalFeeChildInfo';
  import Blank from '../../../components/layout/Blank';

  export default {
    data() {
      return {
        feeFollowList: [],
      };
    },
    components: {
      RenewalFeeChildInfo,
      Blank,
    },
    computed: {
      ...mapState({
        teacherSelectedClassId: state => state.teacher.teacherSelectedClassId,
        renewalList: state => state.teacher.renewalList,
      }),
    },
    methods: {
      ...mapActions({
        getFollowList: 'teacher/getFollowList',
      }),
    },
    created() {
      this.getFollowList({
        classId: this.teacherSelectedClassId,
      }).then((res) => {
        this.feeFollowList = res.obj;
        this.feeFollowList.forEach((item) => {
          item.exceed = Math.abs(moment().diff(item.endDate, 'days')) <= 30; // 返回true或false
          if (moment().diff(item.endDate, 'days') > 0) {
            item.exceedDate = `-${moment().diff(item.endDate, 'days')}`; // 返回天数
          } else {
            item.exceedDate = Math.abs(moment().diff(item.endDate, 'days'));
          }
        });
      });
    },
  };
</script>
<style lang="less" scoped>
  .leabel:last-of-type{
    border: 0;
  }
</style>
