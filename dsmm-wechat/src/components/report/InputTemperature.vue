<template>
  <div>
    <div id="noModal">
      <div style="padding: 10px 0 1rem;text-align: center">{{title}}</div>
      <div class="card" style="display: flex;padding: 0 2rem;" @click="openKey">
        <div class="v-temperature" style="margin-left: .5rem;">{{temperatureGroup[0]}}</div>
        <div class="v-temperature" style="margin-left: .5rem;">{{temperatureGroup[1]}}</div>
        <div style="width: .5rem;height: 4rem;position: relative;margin: 0 .5rem;"><div style="width: .5rem;height: .5rem;background: #000;border-radius: 50%;position: absolute;bottom: 0;left: 0;"></div></div>
        <div class="v-temperature">{{temperatureGroup[2]}}</div>
        <div style="width: 2rem;height: 4rem;position: relative;margin: 0 .5rem;"><div style="font-size:20px;width: 2rem;height: 1.4rem;position: absolute;bottom: 0;left: 0;">℃</div></div>
      </div>
      <mt-popup
        v-model="popupVisible"
        position="bottom" style="width: 100%;overflow:hidden;" @touchmove.prevent :lock-scroll="true">
        <div style="box-shadow: 0 0 0.1rem #a6a6a6;background: #e6e6e6;padding: .6rem 0;" @touchmove.prevent>
          <el-row type="flex" align="middle">
            <el-col class="numberStyle" @click.native="inputPsd(1)">
              <div class="number">1</div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(2)">
              <div class="number">2</div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(3)">
              <div class="number">3</div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col class="numberStyle" @click.native="inputPsd(4)">
              <div class="number">4</div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(5)">
              <div class="number">5</div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(6)">
              <div class="number">6</div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col class="numberStyle" @click.native="inputPsd(7)">
              <div class="number">7</div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(8)">
              <div class="number">8</div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(9)">
              <div class="number">9</div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col class="numberStyle" @click.native="inputPsd('删除')">
              <div class="number">
                <img :src="require('../../assets/img/icon/global/delete_button.png')" alt="" style="width: 2rem;height: 1.5rem;margin: 1.3rem 0 0 3rem;display: block">
              </div>
            </el-col>
            <el-col class="numberStyle" @click.native="inputPsd(0)">
              <div class="number">0</div>
            </el-col>
            <el-col class="numberStyle" style="background: #27abff;color: #ffffff;" @click.native="inputPsd('完成')">
              <div class="number">确 定</div>
            </el-col>
          </el-row>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Temperature',
    data() {
      return {
        temperatureGroup: [],
        nowIndex: '',
        popupVisible: false,
      };
    },
    props: ['title', 'saveInfo'],
    methods: {
      // 开始
      openKey() {
        this.popupVisible = true;
      },
      // 新的
      inputPsd(value) {
        if (value === '完成') {
          if (this.temperatureGroup.length <= 0) {
            this.$emit('temperature', '');
            this.$toast('请输入正确温度');
          } else {
            if (this.temperatureGroup[1] === undefined) {
              this.temperatureGroup[1] = 0;
            }
            if (this.temperatureGroup[2] === undefined) {
              this.temperatureGroup[2] = 0;
            }
            if (this.temperatureGroup[0] === undefined) {
              this.temperatureGroup[0] = 0;
            }
            this.$emit('temperature', `${this.temperatureGroup[0]}${this.temperatureGroup[1]}.${this.temperatureGroup[2]}℃`);
          }
          this.popupVisible = false;
        } else if (value !== '完成' && value !== '返回' && value !== '删除') {
          if (this.temperatureGroup.length <= 2) {
            this.temperatureGroup.push(value);
          } else if (this.temperatureGroup.length > 2) {
            console.log('只能输入三位');
          }
        } else if (value === '删除') {
          this.temperatureGroup.pop();
        } else if (value === '返回') {
          this.popupVisible = false;
        }
        if (this.temperatureGroup.length === 3) {
          this.$emit('temperature', `${this.temperatureGroup[0]}${this.temperatureGroup[1]}.${this.temperatureGroup[2]}℃`);
        } else if (this.temperatureGroup.length <= 0) {
          this.$emit('temperature', '');
          this.$toast('请输入正确温度');
        }
      },
    },
    created() {
      if (this.saveInfo !== '' && this.saveInfo !== undefined) {
        this.temperatureGroup[0] = this.saveInfo.substring(0, 1);
        this.temperatureGroup[1] = this.saveInfo.substring(1, 2);
        this.temperatureGroup[2] = this.saveInfo.substring(3, 4);
      }
    },
  };
</script>
<style lang="less" scoped>
  @import "../../assets/css/global";
  .checked:active{
    background: rgba(128, 128,128, 0.8);
  }
  .numberStyle{
    text-align: center;
    font-size: 24px;
    margin: .25rem;
    height: 4rem;
    background: #ffffff;
    box-shadow: 0 .5rem 0.5rem #d5d5d5,.4rem .2rem 0.5rem #d5d5d5,0 -0.2rem 0.5rem #d5d5d5;
    border-radius: .25rem;
    .number {
      height: 100%;
      line-height: 4rem
    }
  }
  .v-temperature{
    flex: 1;
    height: 4rem;
    border: 1px @color-text-grey solid;
    border-radius: 4px;
    text-align: center;
    line-height: 4rem;
    font-size: 2rem;
  }
</style>
