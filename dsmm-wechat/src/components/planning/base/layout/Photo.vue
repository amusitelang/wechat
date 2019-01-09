<!--不用再分装子组件-->
<!--删除无用代码-->
<!--大小属性设置不要重复-->
<!--提示框交互是否需要图片，甚至是否可以不要提示-->
<template>
  <div class="l-box" :class="['l-box-'+size]">
    <img v-if="type === 'fillet' && isClick" class="image-layout layout-img-two" v-lazy="`${imageUrl}?x-oss-process=style/wechat-report`" :key="imageUrl" @click="wxPreview">
    <img v-if="type === 'fillet' && !isClick" class="image-layout layout-img-two" v-lazy="`${imageUrl}?x-oss-process=style/wechat-report`" :key="imageUrl">
    <img v-if="type === 'square' && isClick" class="image-layout layout-img-three"  v-lazy="`${imageUrl}?x-oss-process=style/wechat-report`" :key="imageUrl" @click="wxPreview">
    <img v-if="type === 'square' && !isClick" class="image-layout layout-img-three"  v-lazy="`${imageUrl}?x-oss-process=style/wechat-report`" :key="imageUrl">
    <img class="layout-img-four image-layout" v-lazy="image" :key="image" v-if="imageUrl && type === 'circle'">
    <img class="layout-img-four image-layout" src="../../../../assets/img/img/avatar/teacher_default_avator.png" v-else-if="!imageUrl && type === 'circle'">
    <!--是否删除-->
    <i class="iconfont icon-deletePhoto imgDelete" v-if="needDelete === true" @click="deleted(imageUrl)"></i>
    <!--图片模态框-->
    <dw-dialog v-if="needDelete === true" v-model="popupDeleteImage" v-on:confirmSubmitted="popupConfirm" widthPercent="70%">
      <div slot="popup-content" style="text-align: center">
        <div style="margin: 10px 0">是否删除这张图片?</div>
        <div  style="margin: 0 auto;">
          <img class="image-layout" :src="photoUrl" style="width: 100px;height: 100px;object-fit: cover">
        </div>
      </div>
    </dw-dialog>
  </div>
</template>
<script>
  import DwDialog from './Dialog';
  import { mapActions } from 'vuex';
  /**
   * DwPhotoLayout
   * @module components/planning/base/layout/photoInside/PhotoLayout
   * @desc 图片布局组件,将图片封装了不同类型（圆形，方形），内部统一处理url，懒加载等效果，封装好删除照片的样式和效果
   * @param {Array} [imageUrlList] - 图片url数组,
   * @param {String} [imageUrl] - 图片url,
   * @param {Boolean} [needDelete] - 是否删除,默认false
   * @param {String} [type=square] - 显示照片类型，接受 square(方形), fillet（具有圆角的方形）,circle(圆形)
   * @param {String} [size=] - 显示照片大小，接受 large(大), medium(中),  small(小) 默认为空
   *
   * @example
   * <dw-photo-layout v-for="(item, index) in 图片url数组" v-bind:image-url="item" :key="index" :image-list="图片url数组" :is-delete="是否删除" v-on:deleteImage="删除传出的事件"></dw-photo-layout>
   * <dw-photo-layout v-bind:image-url="图片url" :is-delete="是否删除" v-on:deleteImage="删除传出的事件" size="大小" type="图片样式"></dw-photo-layout>
   * 配合图片布局组件使用
   * <!--<div style="margin: 14px;">-->
   <!--<dw-photo-layout :number='3' :spacing="5">-->
   <!--<template v-for='(item,index) in testPhotoList'>-->
   <!--&lt;!&ndash;<DwSquare v-bind:image="item" :key="index" v-bind:image-url-list="testPhoto"></DwSquare>&ndash;&gt;-->
   <!--<dw-photo v-bind:image-url="item" :key="index" :image-list="testPhotoList"></dw-photo>-->
   <!--</template>-->
   <!--</dw-photo-layout>-->
   <!--</div>-->
   */
  export default {
    data() {
      return {
        popupDeleteImage: false,
        photoUrl: '',
      };
    },
    props: {
      imageUrl: String,
      imageList: Array,
      type: {
        type: String,
        default: 'square',
      },
      needDelete: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: '', // 大large中medium小small miniLarge miniMedium超小mini
      },
      isClick: {
        type: Boolean,
        default: true,
      },
    },
    components: {
      DwDialog,
    },
    methods: {
      ...mapActions({
        getWxConfig: 'getWxConfig',
      }),
      // 微信链接js-sdk中的查看缩略图
      wxPreview() {
        // console.log(this.imageUrl);
        const data = [];
        // 为了防止之前的图片有http的图片
        this.imageList.forEach((index) => {
          data.push(`https://${index.slice(index.match('dsmm').index)}`.replace(/(^\s*)|(\s*$)/g, ''));
        });
        this.getWxConfig({
          url: window.location.href,
        }).then((res) => {
          wx.config(res.obj);
          wx.ready(() => {
            wx.previewImage({
              current: `https://${this.imageUrl.slice(this.imageUrl.match('dsmm').index)}`.replace(/(^\s*)|(\s*$)/g, ''), // 当前显示的图片的HTTP链接
              urls: data, // 需要预览的图片http链接列表
              success() {
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
        });
      },
      // 删除图片
      deleted(index) {
        this.popupDeleteImage = true;
        this.photoUrl = index;
      },
      // 确认事件
      popupConfirm() {
        this.$emit('deleteImage', this.photoUrl);
        this.popupDeleteImage = false;
      },
    },
    mounted() {
    },
  };
</script>
<style lang="less" scoped>
  .l-box{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .l-box-large{
     width: 200px;
     height: 200px;
   }
  .l-box-medium{
    width: 100px;
    height: 100px;
  }
  .l-box-small{
    width: 80px;
    height: 50px;
  }
  .l-box-mini{
    width: 34px;
    height: 50px;
  }
  .l-box-miniLarge{
    width: 70px;
    height: 200px;
  }
  .l-box-miniMedium{
    width: 50px;
    height: 100px;
  }
  .imgDelete{
    font-size: 20px;
    position: absolute;
    color: rgba(0,0,0,0.5);
    right: -0.5rem;
    top: -10px;
    z-index: 123;
  }
  .layout-img-two{
    border-radius: 5px
  }
  .image-layout[lazy=loading]{
    width: 100%;
    height: 100%;
    margin: auto;
    background: url('../../../../assets/img/img/147592.gif') no-repeat center;
    background-size: cover;
  }
  .image-layout{
    width: 100%;
    height: 100%;
    object-fit: cover
  }
  .layout-img-four{
    border-radius: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
