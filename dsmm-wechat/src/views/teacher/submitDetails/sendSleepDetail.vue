<template>
    <div>
      <div class="card border-b">
        <child-info style="padding: .5rem 0;" :name="teacherSelectedChildInfo.name" :img="teacherSelectedChildInfo.photo"></child-info>
      </div>
      <div class="card card-cell" style="padding-bottom: 0;padding-top: 0;margin: 0 0 10px;border: 0">
        <div style="display: flex;">
          <div style="flex: 1;display: flex" @click="modeSelect" class="new-card-cell">
            <div style="flex: 1;">&nbsp;&nbsp;&nbsp;&nbsp;入睡方式:</div>
            <div style="flex: 1;">

              <div style="float:left;">{{daySleepInfoList.items.modeValue ? daySleepInfoList.items.modeValue : '独立入睡'}}</div>
              <img src="../../../assets/img/icon/global/arrow-right.png" alt="" style="width: .5rem;height: 1rem;margin-left: 1rem;display:block;margin-top: .2rem;float:left;">
            </div>
          </div>
          <div v-if="daySleepInfoList.items.modeValue !== '拒绝睡觉'" style="flex: 1;display: flex" @click="timeSelect" class="new-card-cell">
            <div style="flex: 1;">&nbsp;&nbsp;&nbsp;&nbsp;入睡时间:</div>
            <div style="flex: 1;">
              <div style="float:left;">{{pickerValue}}</div>
              <img src="../../../assets/img/icon/global/arrow-right.png" alt="" style="width: .5rem;height: 1rem;margin-left: 2rem;display:block;margin-top: .2rem;float:left;">
            </div>
          </div>
          <div v-else style="flex: 1;display: flex" class="new-card-cell">
            <div style="flex: 1;">&nbsp;&nbsp;&nbsp;&nbsp;入睡时间:</div>
            <div style="flex: 1;">
              <div style="float:left;">----</div>
              <img src="../../../assets/img/icon/global/arrow-right.png" alt="" style="width: .5rem;height: 1rem;margin-left: 2rem;display:block;margin-top: .2rem;float:left;">
            </div>
          </div>
        </div>
      </div>
      <!--入睡时间-->
      <mt-datetime-picker
        :closeOnClickModal=false
        ref="picker"
        type="time"
        v-model="pickerValue"
        :startHour=10
        :endHour=15
        @confirm="successConfirm" @touchmove.prevent>
      </mt-datetime-picker>
      <mt-popup
        :closeOnClickModal=false
        v-model="popupVisible"
        position="bottom" style="width: 100%;" @touchmove.prevent>
        <confirmation v-on:confirm="confirmSelect" v-on:cancel="cancelSelect" @touchmove.prevent></confirmation>
        <mt-picker ref="pickered" :slots="sloted"></mt-picker>
      </mt-popup>
      <!--<div style="margin: 14px;">-->
        <!--<dw-photo-layout :number='3' :spacing="5" v-if="daySleepInfoList.photos.length !== 0">-->
          <!--<template v-for='(item,index) in daySleepInfoList.photos'>-->
            <!--<dw-photo v-bind:image-url="item" :key="index" :image-list="daySleepInfoList.photos"></dw-photo>-->
          <!--</template>-->
        <!--</dw-photo-layout>-->
      <!--</div>-->
      <div class="card">
        <Temperature class="card-cell" style="padding-top: 0;"  title="室内温度" v-on:temperature="listenToMyBoy"  v-bind:saveInfo="daySleepInfoList.items.roomTemperature"></Temperature>
        <div class="card-cell" style="border: 0">
          <div style="margin: 0;display: flex;flex-wrap: wrap">
            <Thumbnail v-for="(image, index) in daySleepInfoList.photos" :key="index" v-bind:image="image" v-bind:imageUrlList="daySleepInfoList.photos"  v-on:deleteImage="deleteImage"></Thumbnail>
            <UploadPhotos v-if="daySleepInfoList.photos.length <= 8" v-on:uploaded="uploaded" style="float:left;"></UploadPhotos>
          </div>
        </div>
        <div class="detail_memo">
          <dw-input type-color="gray" v-model="daySleepInfoList.memo" type="multi"></dw-input>
        </div>
    </div>
    <div  class="button-block_primary" @click="sureSubmit">
      提交
    </div>
    <dw-dialog v-model="popupSleep"  widthPercent="80%" v-on:confirm="success" :type="true" @touchmove.prevent>
       <div slot="popup-header">
         午睡消息
       </div>
       <div slot="popup-content">
         <dw-popup-prompt :popup-info-list="popupInfo"></dw-popup-prompt>
       </div>
    </dw-dialog>
  </div>
</template>
<script>
  import Confirmation from '../../../components/button/PopUpConfirmation';
  import Temperature from '../../../components/report/InputTemperature';
  import UploadPhotos from '../../../components/button/UploadPhotos';
  import Thumbnail from '../../../components/layout/Thumbnail';
  import ChildInfo from '../../../components/layout/ChildInfo';
  import { mapActions, mapState } from 'vuex';
  // 重构组件
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwPhotoLayout from '../../../components/planning/base/photo';
  import DwPhoto from '../../../components/planning/base/layout/Photo';
  import DwPopupPrompt from '../../../components/planning/base/layout/PopupPrompt';
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    name: 'LunchList',
    data() {
      return {
        // 是否提交成功
        flag: true,
//          入睡时长
        durationVisible: false,
//        入睡方式
        popupVisible: false,
//        入睡时长默认值
        pickerValue: '11:30',
//        入睡方式默认值
        modeValue: '独立入睡',
        dish: '',
//        入睡时长
        duration: [
          {
            flex: 1,
            values: ['0-5分钟', '5-10分钟', '10-15分钟', '15-20分钟', '20分钟以上'],
            className: 'slot2',
            textAlign: 'center',
            value: '1',
          },
        ],
//        入睡方式
        sloted: [
          {
            flex: 1,
            values: ['独立入睡', '老师哄睡', '拒绝睡觉'],
            className: 'slot4',
            textAlign: 'center',
            value: '1',
          },
        ],
        childWords: '',
        popupSleep: false,
        imageUrl: '',  // 图片url
        imageUrlList: [], // 多张图片url
        deleteImageUrl: '',
        sleepTemp: '',
        // testPhotoList: [
        //   'https://dsmm-test.oss-cn-hangzhou.aliyuncs.com/staff/28/1539331938430',
        //   'https://dsmm-test.oss-cn-hangzhou.aliyuncs.com/staff/28/1539331938430',
        //   'https://dsmm-test.oss-cn-hangzhou.aliyuncs.com/staff/28/1539331938430',
        //   'https://dsmm-test.oss-cn-hangzhou.aliyuncs.com/staff/28/1539331938430',
        //   'https://dsmm-test.oss-cn-hangzhou.aliyuncs.com/staff/28/1539331938430',
        //   'https://dsmm-test.oss-cn-hangzhou.aliyuncs.com/staff/28/1539331938430',
        // ],
        popupInfo: [
          {
            title: '入睡时间',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '入睡方式',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '室内温度',
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
//    引入子组件
    components: {
      Temperature,
      UploadPhotos,
      confirmation: Confirmation,
      Thumbnail,
      ChildInfo,
      DwDialog,
      DwPhotoLayout,
      DwPhoto,
      DwPopupPrompt,
      DwInput,
    },
    computed: {
      ...mapState({
        teacherSelectedChildInfo: state => state.teacher.teacherSelectedChildInfo,
        daySleepInfoList: state => state.teacher.daySleepInfoList,
        loading: state => state.loading,
      }),
    },
//    通过路由将值传了进来并进行渲染
    created() {
      this.daySleepInfoList.photos = [];
      if (localStorage.getItem('sleepDetail')) {
        const sleepData = JSON.parse(localStorage.getItem('sleepDetail'));
        this.daySleepInfoList.items.napTime = JSON.parse(sleepData.items).napTime;
        this.daySleepInfoList.items.modeValue = JSON.parse(sleepData.items).modeValue;
        this.daySleepInfoList.items.roomTemperature = JSON.parse(sleepData.items).roomTemperature;
        this.daySleepInfoList.photos = JSON.parse(sleepData.photos);
      }
      if (this.daySleepInfoList.items.napTime !== '----' && this.daySleepInfoList.items.napTime !== undefined) {
        this.pickerValue = this.daySleepInfoList.items.napTime;
      }
    },
    methods: {
      ...mapActions({
        postReport: 'teacher/postReport',
      }),
      error() {
        this.popupSleep = false;
      },
      success() {
        this.popupSleep = false;
        let data = {};
        if (this.daySleepInfoList.items.modeValue !== '拒绝睡觉') {
          data = {
            napTime: this.pickerValue,  // 入睡时间
            modeValue: this.daySleepInfoList.items.modeValue ? this.daySleepInfoList.items.modeValue : '独立入睡', // 入睡方式
            roomTemperature: this.daySleepInfoList.items.roomTemperature, // 室内温度
            sleepInfo: this.daySleepInfoList.items.sleepInfo, // 睡眠情况
          };
        } else {
          data = {
            napTime: '----',  // 入睡时间
            modeValue: this.daySleepInfoList.items.modeValue ? this.daySleepInfoList.items.modeValue : '独立入睡', // 入睡方式
            roomTemperature: this.daySleepInfoList.items.roomTemperature, // 室内温度
            sleepInfo: this.daySleepInfoList.items.sleepInfo, // 睡眠情况
          };
        }
        const payload = {
          type: 2,
          photos: JSON.stringify(this.daySleepInfoList.photos),
          items: JSON.stringify(data),
          memo: this.daySleepInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'),
        };
        const memory = {
          type: 2,
          items: JSON.stringify(data),
          photos: '',
          memo: this.daySleepInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'),
        };
        localStorage.setItem('sleepDetail', JSON.stringify(memory));
        if (this.flag) {
          this.flag = false;
          this.postReport(payload).catch(() => {
            this.flag = true;
          });
        }
      },
      timeSelect() {
        this.$refs.picker.open();
        this.durationVisible = true;
      },
      modeSelect() {
        this.popupVisible = true;
      },
      successConfirm(data) {
        this.pickerValue = data;
        this.daySleepInfoList.items.napTime = data;
      },
      durationConfirm() {
        this.daySleepInfoList.items.napTime = this.$refs.pickeres.getSlotValue(0);
        this.durationVisible = false;
      },
      durationSelect() {
        this.durationVisible = false;
      },
      confirmSelect() {
        this.daySleepInfoList.items.modeValue = this.$refs.pickered.getSlotValue(0);
        this.popupVisible = false;
      },
      cancelSelect() {
        this.popupVisible = false;
      },
      listenToMyBoy(someData) {
        this.daySleepInfoList.items.roomTemperature = someData;
      },
      explanation(value) {
        this.daySleepInfoList.items.sleepInfo = value;
      },
      //      提交
      sureSubmit() {
        if (this.daySleepInfoList.items.modeValue === '拒绝睡觉') {
          this.daySleepInfoList.items.napTime = '----';
        }
        if (this.daySleepInfoList.items.roomTemperature === undefined) {
          this.$toast('请完善页面信息');
        } else {
          this.popupSleep = true;
          this.popupInfo[0].content = this.daySleepInfoList.items.napTime ? this.daySleepInfoList.items.napTime : '11:30';
          this.popupInfo[1].content = this.daySleepInfoList.items.modeValue ? this.daySleepInfoList.items.modeValue : '独立入睡';
          this.popupInfo[2].content = this.daySleepInfoList.items.roomTemperature;
          this.popupInfo[3].content = this.daySleepInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n');
          this.popupInfo[4].imgUrl = this.daySleepInfoList.photos;
        }
      },
      clickToConfirm(value) {
        this.popupSleep = value;
      },
      // 图片上传
      uploaded(index) {
        this.imageUrl = index;
        if (this.daySleepInfoList.photos.length <= 8) {
          this.daySleepInfoList.photos.push(index);
        } else {
          this.$toast('最多可以上传九张图片');
        }
      },
      // 删除图片
      deleteImage(index) {
        let num = 0;
        this.daySleepInfoList.photos.forEach((item, line) => {
          if (item === index) {
            num = line;
            return num;
          }
        });
        this.daySleepInfoList.photos.splice(num, 1);
      },
    },
  };
</script>
<style lang="less" scoped>
</style>
