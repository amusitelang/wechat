<template>
  <div style="overflow-x: hidden">
    <div class="card border-b">
      <div class="card-cell">
        <div style="display: inline-block; width: 160px">
          <el-row type="flex" :gutter="14" align="middle">
            <el-col :span="10">
              <div class="head">
                <img src="../../assets/img/icon/global/address_photo.png" alt="" style="width: 48px;height: 48px;display: inline-block">
              </div>
            </el-col>
            <el-col :span="14">
              <div style="white-space: nowrap;font-size: 14px;">袋鼠麻麻·托育园</div>
              <div style="margin-top: 0.2rem; white-space: nowrap;color: #c1c1c1;" >挖掘儿童潜能，培养阳光性格</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="card" style="display: flex;padding: 1rem 3rem 0;margin: 0;">
      <div class="guide">
        <span>1</span>
      </div>
      <div style="width: 7rem;height: 25px;margin: 0  4px;">
        <div style="height: 1px;background: #e0e0e0;width: 100%;margin-top: 13px;"></div>
      </div>
      <div class="guide-next">
        <span>2</span>
      </div>
      <div style="width: 7rem;height: 25px;margin: 0  4px;">
        <div style="height: 1px;background: #e0e0e0;width: 100%;margin-top: 13px;"></div>
      </div>
      <div class="guide-next" style="overflow: hidden">
        <img src="../../assets/img/icon/reserve/flag.png" alt="" style="display: block;margin-top: .2rem;margin-left: .1rem">
      </div>
    </div>
    <div style="padding-top: 1rem;background: #ffffff;">
      <el-row :gutter="26">
        <el-col :span="8" style="text-align: center;color: #f5a627;"><span>完善信息</span></el-col>
        <el-col :span="8" style="text-align: center;color: #e0e0e0;"><span>验证联系方式</span></el-col>
        <el-col :span="8" style="text-align: center;color: #e0e0e0;"><span>完成预约</span></el-col>
      </el-row>
    </div>
    <!-- tab-container -->
    <div>
      <div class="card" style="padding-top: 2rem">
        <div class="card" style="font-size: 18px;color: #f5a626;text-align: center;margin: 0;">请完善您的信息</div>
        <div  class="layout" style="padding-top: 1rem;margin-bottom: 0rem">
          <el-input class="layout-lot" v-model="familyInfo.username" placeholder="* 您的姓名" style="border-color: #f5a626"></el-input>
        </div>
        <div class="layout">
          <el-input v-model="familyInfo.childName" placeholder="* 宝宝昵称/姓名" class="layout-lot"></el-input>
          <el-select v-model="familyInfo.sexValue" placeholder="* 宝宝性别?" class="input-bottom">
            <el-option
              v-for="item in gender"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input type="number" v-model="familyInfo.relation" placeholder="* 宝宝月龄"></el-input>
        </div>
        <div class="layout">
          <el-select v-model="familyInfo.storeValue" placeholder="* 选择试托门店?" class="input-bottom">
            <el-option
              v-for="item in store"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div  @click="nextStep" class="button-block_primary" style="margin-top: 20px;">下一步</div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        familyInfo: {
          username: '',
          relation: '',
          childName: '',
          relationValue: '',
          sexValue: '',
          storeValue: '',
        },
        gender: [{
          value: '1',
          label: '男',
        }, {
          value: '2',
          label: '女',
        }],
        store: [{
          value: '1',
          label: '云山中心',
        }, {
          value: '2',
          label: '双桥中心',
        }, {
          value: '3',
          label: '民生中心',
        }, {
          value: '4',
          label: '博兴中心',
        }, {
          value: '5',
          label: '三林中心',
        }, {
          value: '6',
          label: '陈春中心',
        }, {
          value: '7',
          label: '凤城中心',
        }, {
          value: '8',
          label: '株洲中心',
        }, {
          value: '12',
          label: '军体中心',
        }, {
          value: '13',
          label: '秀沿中心',
        }, {
          value: '14',
          label: '天山中心',
        }, {
          value: '15',
          label: '都市路中心',
        }],
      };
    },
    methods: {
      nextStep() {
        if (this.familyInfo.username !== '' && this.familyInfo.relation !== '' && this.familyInfo.childName !== '' && this.familyInfo.sexValue !== '' && this.familyInfo.storeValue !== '') {
          this.$store.commit('saveReserveInfo', this.familyInfo);
          this.$router.replace('/reserve/inputPhone');
        } else {
          this.$toast('请完善相关信息');
        }
      },
    },
  };

</script>

<style scoped lang="less">
  @import "../../assets/css/global";
  .input-bottom{
    margin-bottom: 1rem;
    width: 100%
  }
  .button-click{
    margin: 0;
    position: fixed;
    bottom: 0;
    left:0;
    width: 100%;
    padding:1rem 0;
  }
  .layout{
    border-radius: .25rem;
    margin-bottom: 1em;
    .layout-lot{
      margin-bottom: 1rem
    }
  }
  .head{
    border-radius: 50%;
    overflow: hidden;
    width: 48px;
    height: 48px;
    position: relative
  }
  .head-img{
    width: 100%;
    vertical-align: middle;
    top: 50%;
    position: absolute;
    transform: translateY(-50%)
  }
  .guide{
    padding: .28rem .6rem;
    border-radius: 100%;
    background: #f5a627;
    color: #ffffff;
    text-align: center;
    img{
      width: 12px;
      display: inline-block;
    }
    span{
      width: 12px;
      text-align: center;
      display: inline-block;
    }
  }
  .guide-next{
    padding: .28rem .6rem;
    border-radius: 100%;
    background: #e0e0e0;
    color: #ffffff;
    text-align: center;
    img{
      width: 12px;
      display: inline-block;
      /*margin-top: .3rem*/
    }
    span{
      width: 12px;
      text-align: center;
      display: inline-block;
    }
  }
</style>
