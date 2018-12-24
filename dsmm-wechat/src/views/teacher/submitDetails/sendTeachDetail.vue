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
    <div class="card border-b layout-teachTime"  @click="openTeach">
      <div style="float:left;">{{teachTime}}</div>
      <div style="float:right;overflow:hidden;">
        <div style="float: left;color: #949494;margin-right: .3rem"><span>{{teachName}}</span></div>
        <img src="../../../assets/img/icon/global/arrow-right.png" alt="">
      </div>
    </div>
    <div class="border-b layout-present" style="overflow:hidden;">
      <div style="float:left;color: #333333;">课程内容:</div>
      <div style="float: left;">《{{teachContent}}》</div>
    </div>
    <!--课程介绍-->
    <div class="border-b layout-present">
      {{teachPresent}}
    </div>
    <div class="card" style="margin: 0;overflow: hidden">
      <div style="margin: 1rem 0;display: flex;flex-wrap: wrap">
        <Thumbnail v-for="(image, index) in imageUrlList" :key="index" v-bind:image="image" v-bind:imageUrlList="imageUrlList"  v-on:deleteImage="deleteImage"></Thumbnail>
        <UploadPhotos v-if="imageUrlList.length <= 8"  v-on:uploaded="uploaded" style="float:left;"></UploadPhotos>
      </div>
      <div class="card-cell">
      <textarea rows="4" placeholder="可添加备注信息"
                style="-webkit-appearance: none;appearance: none;width: 100%;outline: none;border-radius: 5px;padding: .5rem .5rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;resize:none"
                v-model="memo" wrap="hard">

      </textarea>
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
    <mt-popup
      v-model="popupSleep"
      popup-transition="popup-fade" style="border-radius: 5px;" @touchmove.prevent>
      <div class="card" style="width:22rem;border-radius: 5px;" @touchmove.prevent>
        <div style="padding: 1rem 0 0;font-size: 16px;font-weight: bold">课程消息</div>
        <div style="overflow: hidden;padding: 1rem 0 0;">
          <div class="timeLeft" style="float: left;margin-right: 1rem">上课时间:</div>
          <div class="color-warning"  style="float: left;">{{teachTime}}</div>
        </div>
        <div style="overflow: hidden;padding: 1rem 0 0;">
          <div class="timeLeft" style="float: left;margin-right: 1rem">主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题:</div>
          <div class="color-warning"  style="float: left;">{{teachName}}</div>
        </div>
        <div style="overflow: hidden;padding: 1rem 0 ;">
          <div class="timeLeft" style="float: left;margin-right: 1rem">课程内容:</div>
          <div class="color-warning"  style="float: left;">{{teachContent}}</div>
        </div>
        <div style="overflow: hidden;padding: 0 0 1rem;">
          <div class="timeLeft" style="float: left;margin-right: 1rem">课程介绍:</div>
          <div class="color-warning"  style="float: left;width: 16rem">{{teachPresent}}</div>
        </div>
        <div class="card-cell" style="display: flex;flex-wrap: wrap;">
          <div style="width: 5.5rem;height: 5.5rem;margin: .2rem;overflow:hidden;"  v-for="(item, index) in imageUrlList" :key="index" >
            <img :src="item" alt="" style="height: 5.5rem;">
          </div>
        </div>
        <div style="padding: 1rem 0;font-size: 12px;">
          确认后并发送宝宝圈信息
        </div>
        <div class="button-group">
          <div class="button-return_submit" @click="error">返回修改</div>
          <div class="button-sure_submit" @click="success" v-loading="loading">确认发送</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import Confirmation from '../../../components/button/PopUpConfirmation';
  import UploadPhotos from '../../../components/button/UploadPhotos';
  import Thumbnail from '../../../components/layout/Thumbnail';
  import { mapState, mapActions } from 'vuex';
  import moment from 'moment';

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
      };
    },
    components: {
      Confirmation,
      UploadPhotos,
      Thumbnail,
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
