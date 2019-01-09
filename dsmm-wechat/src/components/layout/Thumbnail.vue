<template>
  <div>
    <div style="float:left;width: 8.1rem;height: 8.1rem;position: relative;">
      <img src="../../assets/img/icon/global/delete_photo.png" alt="" class="imgDelete" style="width: 26px;height: 26px;  position: absolute; right: .3rem; top: -10px;z-index: 123;" @click="deletePhoto">
      <div style="width: 100px;height: 100px;">
        <div :style="{background: `url(${image}?x-oss-process=style/wechat-report) no-repeat center`, width: '100px', height: '100px', backgroundSize: 'cover'}" @click="preview"></div>
      </div>
    </div>
    <!--是否删除图片模态框-->
    <mt-popup
      :closeOnClickModal=false
      v-model="popupDeleteImage"
      position="center" style="width: 20rem;height: 15rem; border-radius:.25rem">
      <div class="card" style="border-radius: .25rem">
        <div class="card-cell" style="text-align: center;">是否删除这张图片?</div>
        <div style="margin: 1rem auto;height: 7rem;overflow:hidden;width: 7rem">
          <div :style="{background: `url(${image}?x-oss-process=style/wechat-report) no-repeat center`, width: '100px', height: '100px', backgroundSize: 'cover'}"></div>
        </div>
        <div class="button-group">
          <div class="button-return_submit" @click="deleteCancel">返回</div>
          <div class="button-sure_submit" @click="deleteConfirm">确认</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        popupDeleteImage: false,
      };
    },
    props: ['image', 'imageUrlList'],
    methods: {
      ...mapActions({
        getWxConfig: 'getWxConfig',
      }),
      // 微信链接js-sdk中的查看缩略图
      wxPreview() {
        wx.ready(() => {
          wx.previewImage({
            current: this.image, // 当前显示的图片的HTTP链接
            urls: this.imageUrlList, // 需要预览的图片http链接列表
            success(res) {
              console.log('查看成功');
            },
            cancel(err) {
              console.log(err);
            },
          });
        });
        wx.error((err) => {
          console.log(err);
        });
      },
      // 预览图片
      preview() {
        this.wxPreview();
      },
      // 删除图片
      deletePhoto() {
        this.popupDeleteImage = true;
      },
      deleteCancel() {
        this.popupDeleteImage = false;
      },
      deleteConfirm() {
        this.popupDeleteImage = false;
        this.$emit('deleteImage', this.image);
      },
    },
  };
</script>
<style lang="less" scoped>

</style>
