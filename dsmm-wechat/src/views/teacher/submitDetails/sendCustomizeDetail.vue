<template>
  <div>
    <div v-if="type === '7'" class="card" style="padding-top: .7rem;padding-bottom: .7rem;margin-bottom: 10px;color: #d9d9d9;">{{time}}</div>
    <div class="card border-all" style="margin: 0" v-if="type !== '7'">
      <child-info style="padding: .5rem 0;" :name="teacherSelectedChildInfo.name" :img="teacherSelectedChildInfo.photo"></child-info>
    </div>
    <div class="card" style="margin-top: 10px">
      <div style="background: #ffffff">
        <textarea rows="8" placeholder="今天发生了什么有趣的事呢？老师记录一下吧~" style="-webkit-appearance: none;appearance: none;outline: none; resize: none;width: 100%;border: 0;padding-top: 1rem" v-model="memo" wrap="hard"></textarea>
        <div style="overflow:hidden;margin: .5rem 0;" v-if="videoSure">
          <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
        </div>
        <div style="margin: 0;display: flex;flex-wrap: wrap; padding: 0 0 1rem;">
          <Thumbnail v-for="(image, index) in imageUrlList" :key="index" v-bind:image="image" v-bind:imageUrlList="imageUrlList"  v-on:deleteImage="deleteImage"></Thumbnail>
          <UploadPhotos v-if="imageUrlList.length <= 8"  v-on:uploaded="uploaded" style="float:left;margin-right: 1rem"></UploadPhotos>
          <UploadVideo v-if="!videoUrl"  v-on:uploaded="uploadedVideo" ></UploadVideo>
        </div>
      </div>
    </div>
    <div class="card" style="background: rgba(0,0,0,0)">
      <div @click="submitSure" class="button-block_primary" style="margin: 20px 0 0;">提&nbsp;交</div>
    </div>
    <dw-dialog v-model="popVideo"  widthPercent="80%" v-on:confirm="success" :type="true" @touchmove.prevent>
      <div slot="popup-header">
        自定义信息
      </div>
      <div slot="popup-content">
        <dw-popup-prompt :popup-info-list="popupInfo"></dw-popup-prompt>
      </div>
    </dw-dialog>
  </div>
</template>
<script>
  import ChildInfo from '../../../components/layout/ChildInfo';
  import Thumbnail from '../../../components/layout/Thumbnail';
  import UploadPhotos from '../../../components/button/UploadPhotos';
  import UploadVideo from '../../../components/button/UploadVideo';
  import { mapState, mapActions } from 'vuex';
  import moment from 'moment';
  import { videoPlayer } from 'vue-video-player';
  // 新组件
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwPopupPrompt from '../../../components/planning/base/layout/PopupPrompt';
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    data() {
      return {
        childId: '',
        imageUrl: '',  // 图片url
        imageUrlList: [], // 多张图片url
        videoUrl: '',
        memo: '',
        deleteImageUrl: '',
        type: '',
        time: '',
        videoSure: false,
        popVideo: false,
        popupInfo: [
          {
            title: '每日时间',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '老师留言',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: true,
            imgUrl: [],
          },
        ],
      };
    },
    components: {
      UploadPhotos,
      ChildInfo,
      Thumbnail,
      UploadVideo,
      videoPlayer,
      DwDialog,
      DwPopupPrompt,
      DwInput,
    },
    created() {
      this.type = this.$route.query.type;
      this.time = moment().format('YYYY-MM-DD dddd');
    },
    computed: {
      ...mapState({
        teacherSelectedChildInfo: state => state.teacher.teacherSelectedChildInfo,
        loading: state => state.loading,
      }),
      playerOptions() {
        return JSON.parse(JSON.stringify(this.$store.state.playerOptions));
      },
    },
    methods: {
      ...mapActions({
        postReport: 'teacher/postReport',
      }),
      // 图片上传
      uploaded(index) {
        this.imageUrl = index;
        if (this.imageUrlList.length <= 8) {
          this.imageUrlList.push(index);
        } else {
          this.$toast('最多可以上传九张图片');
        }
      },
      // 视频上传
      uploadedVideo(index) {
        this.playerOptions.sources = [
          {
            type: '',
            src: index, // url地址
          },
        ];
        this.videoUrl = index;
        this.videoSure = true;
      },
      // 删除图片
      deleteImage(index) {
        let num = 0;
        this.imageUrlList.forEach((item, line) => {
          if (item === index) {
            num = line;
            return num;
          }
        });
        this.imageUrlList.splice(num, 1);
      },
      submitSure() {
        this.popVideo = true;
        this.popupInfo[0].content = this.time;
        this.popupInfo[1].content = this.memo;
        this.popupInfo[2].imgUrl = this.imageUrlList;
      },
      error() {
        this.popVideo = false;
      },
      success() {
        this.popVideo = false;
        this.postReport({
          type: parseInt(this.type, 10),
          photos: JSON.stringify(this.imageUrlList),
          memo: this.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'),
          videoUrl: this.videoUrl,
          time: this.time,
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  textarea::-webkit-input-placeholder{
    /* WebKit browsers */
    color: #d9d9d9;
  }
  textarea:-moz-placeholder{
    /* Mozilla Firefox 4 to 18 */
    color: #d9d9d9;
  }
  textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #d9d9d9;
  }
  textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #d9d9d9;
  }
</style>
