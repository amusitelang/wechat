<template>
  <div class="back-white">
    <div class="card" style="padding-top: 8rem;">
      <div style="text-align: center">
        <img src="../../../assets/img/icon/global/success_primary.png" class="success-img">
        <div>
          <div class="success-title">
            您已成功与宝宝绑定,
          </div>
          <div class="success-text" >
            快去看看宝宝今天的动态吧
          </div>
        </div>
      </div>
      <div class="button-block_white" style="margin: 4rem auto; width: 120px" @click="back">回到宝宝动态</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: '',
      };
    },
    methods: {
      back() {
        this.$router.replace('/parent/index');
      },
      init() {
        this.type = this.$route.query.type;
      },
    },
    created() {
      this.init();
    },
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/css/global";
  .success-img {
    width: 80px;
  }
  .success-title {
    text-align: center;
    font-size: 1.5rem;
    margin: 2rem;
  }
  .success-text {
    text-align: center;
    font-size: 1rem;
    line-height: 1.5rem;
    color: @color-info;
  }
</style>
