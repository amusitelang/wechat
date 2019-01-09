<template>
  <div>
    <!--新版本-->
    <div class="card" style="padding-top: .7rem;padding-bottom: .7rem;margin-bottom: 1rem;color: #d9d9d9;">{{todayTime}}</div>
    <div class="card" style="margin-bottom: 0">
      <div class="layout-teach">
        <img src="../../../assets/img/icon/sendDetailComponents/teacher_teach_logo.png" alt="">
        <div>课程</div>
      </div>
    </div>
    <dw-row :borderBottom="true" :arrow="true" style="background: #fff;">
      <div slot="rowContent">
        <!--class="layout-teachTime"-->
        <div @click="openTeach">
          <div style="float:left;">{{teachTime}}</div>
          <div style="float:right;overflow:hidden;">
            <div style="color: #949494;"><span>{{teachName}}</span></div>
          </div>
        </div>
      </div>
    </dw-row>
    <dw-row :borderBottom="true" :arrow="false" style="background: #fff;">
      <div slot="rowContent">
        <div style="float:left;color: #333333;">课程内容:</div>
        <div style="float: left;color:#a6a6a6;">《{{teachContent}}》</div>
      </div>
    </dw-row>
    <!--课程介绍-->
    <dw-row :borderBottom="true" :arrow="false" style="background: #fff;">
      <div slot="rowContent">
        <span style="color:#a6a6a6;">{{teachPresent}}</span>
      </div>
    </dw-row>
    <div class="card" style="margin: 0;overflow: hidden">
      <div style="margin: 1rem 0;display: flex;flex-wrap: wrap">
        <Thumbnail v-for="(image, index) in imageUrlList" :key="index" v-bind:image="image" v-bind:imageUrlList="imageUrlList"  v-on:deleteImage="deleteImage"></Thumbnail>
        <UploadPhotos v-if="imageUrlList.length <= 8"  v-on:uploaded="uploaded" style="float:left;"></UploadPhotos>
      </div>
      <div class="detail_memo">
        <dw-input type-color="gray" v-model="memo" type="multi"></dw-input>
      </div>
    </div>
    <div class="button-block_primary" @click="sureSubmit">
      提交
    </div>
    <!--新版课程模态框-->
    <mt-popup
      v-model="popupTeachVisible"
      position="bottom"
      style="width: 100%"  @touchmove.prevent>
      <confirmation v-on:confirm="confirmSelectTeach" v-on:cancel="cancelSelectTeach" @touchmove.prevent></confirmation>
      <mt-picker v-if="lessonList" ref="teachPicker" :slots="slotsTeach" value-key="teachTypeName"></mt-picker>
    </mt-popup>
    <!--提交模态框-->
    <dw-dialog v-model="popupSleep"  widthPercent="80%" v-on:confirm="success" :type="true" @touchmove.prevent>
      <div slot="popup-header">
        每日课程报告
      </div>
      <div slot="popup-content">
        <dw-popup-prompt :popup-info-list="popupInfo"></dw-popup-prompt>
      </div>
    </dw-dialog>
  </div>
</template>
<script>
  import Confirmation from '../../../components/button/PopUpConfirmation';
  import UploadPhotos from '../../../components/button/UploadPhotos';
  import Thumbnail from '../../../components/layout/Thumbnail';
  import { mapState, mapActions } from 'vuex';
  import moment from 'moment';
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwPopupPrompt from '../../../components/planning/base/layout/PopupPrompt';
  import DwRow from '../../../components/planning/base/layout/Row';
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    data() {
      return {
        memo: '宝宝今天学到了好多新知识，成长又进了一步',
        todayTime: '',
        popupSleep: false, // 提交
        popupTeachVisible: false,
        teachName: '',
        teachTime: '',
        teachPresent: '',
        teachContent: '',
        teachList: [],
        imageUrl: '',  // 图片url
        imageUrlList: [], // 多张图片url
        deleteImageUrl: '',
        time: '',
        flag: true,
        popupInfo: [
          {
            title: '上课时间',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '课程主题',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '课程内容',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '课程介绍',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '备注信息',
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
      Confirmation,
      UploadPhotos,
      Thumbnail,
      DwDialog,
      DwPopupPrompt,
      DwRow,
      DwInput,
    },
    computed: {
      ...mapState({
        todaySchedule: state => state.teacher.todaySchedule,
        lessonList: state => state.lessonList,
        loading: state => state.loading,
      }),
      slotsTeach() {
        return [{
          flex: 1,
          values: this.lessonList,
          className: 'slot3',
          textAlign: 'center',
        }];
      },
    },
    methods: {
      ...mapActions({
        getTodaySchedule: 'teacher/getTodaySchedule',
        postReport: 'teacher/postReport',
      }),
      cancelSelect() {
        this.popupVisible = false;
      },
      // 打开课程选择
      // 新班课程
      openTeach() {
        this.popupTeachVisible = true;
      },
      confirmSelectTeach() {
        this.teachName = this.$refs.teachPicker.getSlotValue(0).teachTypeName;
        this.teachTime = this.$refs.teachPicker.getSlotValue(0).time;
        this.teachPresent = this.$refs.teachPicker.getSlotValue(0).description;
        this.teachContent = this.$refs.teachPicker.getSlotValue(0).className;
        this.popupTeachVisible = false;
      },
      cancelSelectTeach() {
        this.popupTeachVisible = false;
      },
      // 提交
      sureSubmit() {
        this.popupSleep = true;
        this.popupInfo[0].content = this.teachTime;
        this.popupInfo[1].content = this.teachName;
        this.popupInfo[2].content = this.teachContent;
        this.popupInfo[3].content = this.teachPresent;
        this.popupInfo[4].content = this.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n');
        this.popupInfo[5].imgUrl = this.imageUrlList;
      },
      error() {
        this.popupSleep = false;
      },
      success() {
        // this.popupSleep = false;
        const data = JSON.stringify({
          theme: this.teachName,
          ability: this.ability,
          lesson: this.teachContent,
          teachTime: this.teachTime,
          teachPresent: this.teachPresent,
          time: this.time,
          todayTime: moment().format('dddd'),
        });
        if (this.flag) {
          this.flag = false;
          this.postReport({
            type: 4,
            photos: JSON.stringify(this.imageUrlList),
            items: data,
            memo: this.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'),
          }).catch(() => {
            this.flag = true;
          });
        }
      },
      // 图片上传
      uploaded(index) {
        this.imageUrl = index;
        this.imageUrlList.push(index);
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
    },
    created() {
      this.todayTime = moment().format('YYYY-MM-D dddd   ');
      this.time = moment().format('YYYY-MM-DD');
      this.teachName = this.lessonList[0].teachTypeName;
      this.teachTime = this.lessonList[0].time;
      this.teachPresent = this.lessonList[0].description;
      this.teachContent = this.lessonList[0].className;
    },
  };

</script>
<style lang="less" scoped>
  .addButton {
    width: 100px;
    height: 100px;
    background: #ffffff;
    text-align: center;
    line-height: 100px;
    font-size: 50px;
    border:1px #cccccc dashed;
    color: #cccccc;
    margin-left: 20px;
  }
  .layout-teach{
    padding: 1rem 0;
    overflow: hidden;
    img{
      width: 1.2rem;
      height: 1.2rem;
      display: block;
      float:left;
      margin-right: .3rem;
      margin-left:11rem
    }
    div{
      color: #333333;
      display:block;
      float:left;
    }
  }
  .layout-teachTime{
    overflow:hidden;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin: 0;
    img{
      width: .5rem;
      height: 1rem;
      display: block;
      float: left;
      margin-top: .1rem
    }
  }
  .layout-present{
    padding: 1rem;
    margin: 0;
    color: #a6a6a6;
    background: #ffffff
  }
</style>
