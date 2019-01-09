<template>
  <div>
    <div>
      <div class="card border-b">
        <child-info style="padding: .5rem 0;" :name="teacherSelectedChildInfo.name" :img="teacherSelectedChildInfo.photo"></child-info>
      </div>
      <div class="card" style="margin-top: 0">
        <div style="display: flex">
          <!--@click="timeSelect"-->
          <div class="new-card-cell" style="flex: 1;display: flex;">
            <div style="flex: 1;">进餐时间:</div>
            <div style="flex: 1;">
              <div style="float:left;">11:00-11:30</div>
            </div>
          </div>
          <div style="flex: 1;display: flex;padding: 1rem 0" @click="modeSelect">
            <div style="flex: 1;margin-left: 1rem">进餐方式:</div>
            <div style="flex: 1;">
              <div  style="float:left;">{{dayLunchInfoList.items.modeValue ? dayLunchInfoList.items.modeValue : '独立进食'}}</div>
              <img src="../../../assets/img/icon/global/arrow-right.png" alt="" style="width: .5rem;height: 1rem;margin-left: .5rem;display:block;margin-top: .2rem;float:left;">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--进餐时间-->
    <!--进餐方式-->
    <mt-popup
      :closeOnClickModal=false
      v-model="popupVisible"
      position="bottom" style="width: 100%;">
      <confirmation v-on:confirm="confirmSelect" v-on:cancel="cancelSelect"></confirmation>
      <mt-picker ref="pickered" :slots="sloted" value-key="label"></mt-picker>
    </mt-popup>
    <div class="card">
      <div style="text-align: center;padding-top: 10px;">宝宝进食情况</div>
      <div class="card-cell" style="padding-top: 0;overflow:hidden;">
        <div class="slider"  v-for="(item , index) in dayLunchInfoList.items.todayLunch" :key="index">
          <div style="width: 2.5rem;height: 1.2rem;position: absolute;top: 2.8rem;left: 5rem;">没吃</div>
          <div style="width: 2.5rem;height: 1.2rem;position: absolute;top: 2.8rem;left: 40%;">1/3</div>
          <div style="width: 37px;height: 1.2rem;position: absolute;top: 2.8rem;left: 58%;">1/2</div>
          <div style="width: 37px;height: 1.2rem;position: absolute;top: 2.8rem;left: 75.5%;">2/3</div>
          <div style="width: 37px;height: 1.2rem;position: absolute;top: 2.8rem;left: 90%;">吃完</div>
          <span style="width: 5rem;margin-right: 1rem;margin-top: .7rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.content}}</span>
          <el-slider
            :show-tooltip="false"
            v-model="item.initial"
            :step="10"
            :max="40"
            show-stops style="flex: 1;margin-right: 1rem"
            @change="rangeValue(item, index)"
          >
          </el-slider>
        </div>
      </div>
    </div>
    <div class="card" style="margin: 0;display: flex;flex-wrap: wrap;padding-bottom: 1rem">
      <Thumbnail v-for="(image, index) in dayLunchInfoList.photos" :key="index" v-bind:image="image" v-bind:imageUrlList="dayLunchInfoList.photos"  v-on:deleteImage="deleteImage"></Thumbnail>
      <UploadPhotos v-if="dayLunchInfoList.photos.length <= 8"  v-on:uploaded="uploaded" style="float:left;"></UploadPhotos>
    </div>
    <div class="card detail_memo" style="margin: 0">
      <dw-input type-color="gray" v-model="dayLunchInfoList.memo" type="multi"></dw-input>
    </div>
    <div  class="button-block_primary" @click="sureSubmit">
      提交
    </div>
    <dw-dialog v-model="popVisible"  widthPercent="80%" v-on:confirm="success" :type="true" @touchmove.prevent>
      <div slot="popup-header">
        午餐通知
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
  import ChildInfo from '../../../components/layout/ChildInfo';
  import { mapState, mapActions } from 'vuex';
  import moment from 'moment';
  import constant from '../../../config/constant';
  // 新组件
  import DwDialog from '../../../components/planning/base/layout/Dialog';
  import DwPopupPrompt from '../../../components/planning/base/layout/PopupPrompt';
  import DwInput from '../../../components/planning/base/input/Input';

  export default {
    name: 'LunchList',
    data() {
      return {
        // 是否提交成功
        flag: true,
        value7: 0,
        dish: '',
        mainFood: '',
        popupVisible: false,
        popVisible: false,
        imageUrlList: [],
        imageUrl: '',  // 图片url
        detailTime: '',
        popupInfo: [
          {
            title: '进餐时间',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '进餐方式',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '今日主食',
            content: '',
            isIcon: false,
            icon: '',
            iconColor: '',
            isImg: false,
          },
          {
            title: '菜品例汤',
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
    computed: {
      sloted() {
        const data = [
          {
            flex: 1,
            values: constant.EATSTATUS,
            className: 'slot4',
            textAlign: 'center',
            value: '1',
          },
        ];
        return data;
      },
      ...mapState({
        todaySchedule: state => state.teacher.todaySchedule,
        teacherSelectedChildInfo: state => state.teacher.teacherSelectedChildInfo,
        dayLunchInfoList: state => state.teacher.dayLunchInfoList,
        loading: state => state.loading,
      }),
    },
    components: {
      Confirmation,
      UploadPhotos,
      Thumbnail,
      ChildInfo,
      DwDialog,
      DwPopupPrompt,
      DwInput,
    },
    created() {
      this.dayLunchInfoList.photos = [];
      const d = new Date();
      this.detailTime = moment(d).format('YYYY-MM-DD');
      const data = JSON.parse(this.todaySchedule.todayLunch).foods;
      const lunchData = [];
      data.forEach((index) => {
        if (index.foodName) {
          lunchData.push(index);
        }
      });
      this.dayLunchInfoList.items.todayLunch = lunchData.map(item => ({
        content: item.foodName,
        initial: 0,
        value: '没吃',
        typeName: item.typeName,
      }));
      const contentList = [];
      const stapleList = [];
      this.dayLunchInfoList.items.todayLunch.forEach((item) => {
        if (item.typeName === '主食') {
          stapleList.push(item.content);
        } else {
          contentList.push(item.content);
        }
      });
      this.mainFood = stapleList.join('、');
      this.dish = contentList.join('、');
    },
    methods: {
      ...mapActions({
        getTodaySchedule: 'teacher/getTodaySchedule',
        postReport: 'teacher/postReport',
      }),
      timeSelect() {
        this.$refs.picker.open();
      },
      modeSelect() {
        this.popupVisible = true;
      },
      handleConfirm(data) {
        this.dayLunchInfoList.items.mealTime = data;
      },
      confirmSelect() {
        this.dayLunchInfoList.items.modeValue = this.$refs.pickered.getSlotValue(0).label;
        this.popupVisible = false;
      },
      cancelSelect() {
        this.popupVisible = false;
      },
      rangeValue(item, index) {
        if (item.initial === 0) {
          this.dayLunchInfoList.items.todayLunch[index].value = '没吃';
        } else if (item.initial === 10) {
          this.dayLunchInfoList.items.todayLunch[index].value = '吃1/3';
        } else if (item.initial === 20) {
          this.dayLunchInfoList.items.todayLunch[index].value = '吃1/2';
        } else if (item.initial === 30) {
          this.dayLunchInfoList.items.todayLunch[index].value = '吃2/3';
        } else if (item.initial === 40) {
          this.dayLunchInfoList.items.todayLunch[index].value = '吃完';
        }
      },
      //      提交
      sureSubmit() {
        this.popVisible = true;
        this.popupInfo[0].content = '11:00-11:30'; // 进餐时间
        this.popupInfo[1].content = this.dayLunchInfoList.items.modeValue ? this.dayLunchInfoList.items.modeValue : '独立进食'; // 进餐方式
        this.popupInfo[2].content = this.mainFood; // 主食
        this.popupInfo[3].content = this.dish; // 菜汤
        this.popupInfo[4].content = this.dayLunchInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'); // 备注信息
        this.popupInfo[5].imgUrl = this.dayLunchInfoList.photos; // 照片
      },
      clickToConfirm(value) {
        this.popVisible = value;
      },
      error() {
        this.popVisible = false;
      },
      success() {
        this.popVisible = false;
        const data = JSON.stringify({
          mealTime: '11:00-11:30',
          lunchToday: this.dish,
          todayLunch: this.dayLunchInfoList.items.todayLunch,
          modeValue: this.dayLunchInfoList.items.modeValue,
          detailTime: this.detailTime,
        });
        const payload = {
          type: 3,
          photos: JSON.stringify(this.dayLunchInfoList.photos),
          items: data,
          memo: this.dayLunchInfoList.memo.replace(/\r\n/g, '\n').replace(/\n/g, '\n').replace(/\s/g, '\n'),
        };
        if (this.flag) {
          this.flag = false;
          this.postReport(payload).catch(() => {
            this.flag = true;
          });
        }
      },
      // 图片上传
      uploaded(index) {
        this.imageUrl = index;
        if (this.dayLunchInfoList.photos.length <= 8) {
          this.dayLunchInfoList.photos.push(index);
        } else {
          this.$toast('最多可以上传九张图片');
        }
      },
      // 删除图片
      deleteImage(index) {
        let num = 0;
        this.dayLunchInfoList.photos.forEach((item, line) => {
          if (item === index) {
            num = line;
            return num;
          }
        });
        this.dayLunchInfoList.photos.splice(num, 1);
      },
    },
  };
</script>
<style lang="less" scoped>
  .time{
    padding: 5px 0;
  }
  .slider{
    height: 4rem;
    margin-top: 2rem;
    display: flex;
    position: relative;
  }
  .slider:first-of-type{
    margin-top: 0;
  }
</style>
