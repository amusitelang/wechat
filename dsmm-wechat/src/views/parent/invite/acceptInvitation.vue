<template>
  <div>
    <!--登录卡片-通用入口-->
    <div class="card card_invitation">
      <div class="card_invitation_img">
        <img src="../../../assets/img/icon/global/logo.png">
      </div>
      <input class="input_line" type="number" placeholder="输入邀请码" v-model="code">
      <span style="font-size: 12px;padding: .5rem 0;display: block;color: #F5A626;width: 9rem" class="color-info" @click="obtain">如何获取邀请码?</span>
      <div style="position: relative"  @click="popupVisible=true">
        <div class="input_line"  style="position: relative; z-index: 0">
          <span v-if="relationCn">{{relationCn}}</span>
          <span v-else style="color: #909399">与宝宝的关系</span>
        </div>
        <div style="font-size: 2rem" class="color-info">
          <i class="el-icon-caret-bottom" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%)"></i>
        </div>
      </div>
      <div class="button-block_primary" style="margin: 2rem 0;" @click="accept">绑定</div>
    </div>
    <mt-popup
      :closeOnClickModal=false
      v-model="popupVisible"
      position="bottom" style="width: 100%;">
      <Confirmation v-on:confirm="confirmSelect" v-on:cancel="cancelSelect"></Confirmation>
      <mt-picker value-key="cn" ref="picker" :slots="slots" ></mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupobtain"
       style="border-radius: 8px;" popup-transition="popup-fade">
      <div class="card" style="padding:1.5rem 2rem 0;border-radius: 8px">
        <div style="font-size: 18px;font-weight: bolder;padding-bottom: .8rem">如何获取邀请码?</div>
        <div style="width: 250px">
          1.联系已经绑定的家长;
          <br>
          2.他们的个人中心>宝宝家人>邀请家人;
          <br>
          3.把页面上邀请码复制给你。
        </div>
        <div class="border-b" style="padding-bottom: .9rem;color: #929292;">就可以来登录关注宝宝的学习成长了~</div>
        <div @click="closeobtain" style="text-align: center;color: #F5A626;padding: .9rem 0;">我知道了</div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex';
  import Confirmation from '../../../components/button/PopUpConfirmation';
  // import { MessageBox } from 'mint-ui';

  export default {
    data() {
      return {
        code: '',
        relationCn: '',
        relationEn: '',
        popupVisible: false,
        popupobtain: false,
        slots: [
          {
            flex: 1,
            values: [
              {
                en: 'father',
                cn: '爸爸',
              },
              {
                en: 'mother',
                cn: '妈妈',
              },
              {
                en: 'grandpa',
                cn: '爷爷',
              },
              {
                en: 'grandma',
                cn: '奶奶',
              },
              {
                en: 'grandfather',
                cn: '外公',
              },
              {
                en: 'grandmother',
                cn: '外婆',
              },
              {
                en: 'other',
                cn: '家长',
              },
            ],
            className: 'slot1',
          },
        ],
      };
    },
    components: {
      Confirmation,
    },
    computed: {
      ...mapState({
      }),
    },
    methods: {
      ...mapActions({
        acceptInvitation: 'parent/acceptInvitation',
      }),
      // 点击确认触发
      confirmSelect() {
        this.relationCn = this.$refs.picker.getSlotValue(0).cn;
        this.relationEn = this.$refs.picker.getSlotValue(0).en;
        this.popupVisible = false;
      },
      // 点击取消触发
      cancelSelect() {
        this.popupVisible = false;
      },
      obtain() {
        this.popupobtain = true;
        // MessageBox('如何获取邀请码?', '<div>\n' +
        //   '1.联系已经绑定的家长;\n' +
        //   '<br>\n' +
        //   '2.他们的个人中心>宝宝家人>邀请家人;\n' +
        //   '<br>\n' +
        //   '3.把页面上邀请码复制给你。\n' +
        //   '<br>\n' +
        //   '就可以来登录关注宝宝的学习成长了~\n' +
        //   '</div>');
      },
      closeobtain() {
        this.popupobtain = false;
      },
      accept() {
        if (this.relationEn && this.code) {
          this.acceptInvitation({
            inviteCode: this.code,
            relation: this.relationEn,
          }).then(() => {
            // this.$router.go(-1);
            this.$router.push('/binding/success');
          });
        } else {
          this.$toast('请完善页面信息');
        }
      },
    },
    created() {

    },
  };
</script>
<style lang="less">
.card_invitation {
  padding: 0 2rem;
  height: 100%;
  .card_invitation_img{
    padding-top: 2rem;
    img{
      display: block;
      width: 90%;
      margin: 2rem auto;
    }
  }
}
</style>
