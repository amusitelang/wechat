<template>
  <div style="overflow: hidden;background: #fff;height: 100%">
    <div class="success">
      <i class="iconfont icon-success1"></i>
    </div>
    <div class="success-font">提交已成功，谢谢您的建议和支持</div>
    <div  class="button-block_primary" @click="jump">
      查看宝宝动态
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      jump() {
        this.$router.replace('/parent/index');
      },
    },
  };
</script>
<style lang="less" scoped>
 .success{
   width: 96px;
   height: 96px;
   border-radius: 100%;
   margin: 4rem auto 2rem;
 }
  .success-font{
    text-align: center;
    margin: 1rem auto;
  }
  .button-block_primary{
    width: 8rem;
    margin: 3rem auto;
  }
  i.icon-success1{
    font-size: 100px;
    text-align: center;
    color: #F5A626;
    line-height: normal;
  }
</style>
