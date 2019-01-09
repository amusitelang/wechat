<script>
  export default {
    name: 'dw-photo-box',
    props: {
      number: {
        type: Number,
        default: 3,
      },
      spacing: {
        type: Number,
        default: 5,
      },
    },
    data() {
      return {
        sideLength: 'auto',
      };
    },
    render(h) {
      return <div class="photo-box" ref="box">
          {
            this.$slots.default.map((item, index) => {
              if ((index + 1) % this.number) {
                return <div class={[`photo-box-item-${this.number}`]} style={{ width: this.sideLength, height: this.sideLength, marginRight: `${this.spacing}px`, marginTop: `${this.spacing}px` }}>{item}</div>;
              }
              return <div class={[`photo-box-item-${this.number}`]} style={{ width: this.sideLength, height: this.sideLength, marginRight: 0, marginTop: `${this.spacing}px` }}>{item}</div>;
            })
      }
      </div>;
    },
    mounted() {
      this.sideLength = `${(((Math.trunc(this.$refs.box.offsetWidth) - (((this.number - 1)) * this.spacing))) / this.number)}px`;
      console.log(this.sideLength);
    },
  };
</script>
<style lang="less" scoped>
  .photo-box{
    display: flex;
    flex-wrap:wrap;
    justify-content:flex-start;
    align-items: flex-start
  }
  .photo-box-item{
    position: relative;
  }
  .photo-box-item-right{
    position: relative;
  }
  .photo-box-item-1:nth-child(-n + 1) {
    margin-top: 0 !important;
  }
  .photo-box-item-2:nth-child(-n + 2) {
    margin-top: 0 !important;
  }
  .photo-box-item-3:nth-child(-n + 3) {
    margin-top: 0 !important;
  }
  .photo-box-item-4:nth-child(-n + 4) {
    margin-top: 0 !important;
  }
  .photo-box-item-5:nth-child(-n + 5) {
    margin-top: 0 !important;
  }
  .photo-box-item-6:nth-child(-n + 6) {
    margin-top: 0 !important;
  }
  .photo-box-item-7:nth-child(-n + 7) {
    margin-top: 0 !important;
  }
  .photo-box-item-8:nth-child(-n + 8) {
    margin-top: 0 !important;
  }
  .photo-box-item-9:nth-child(-n + 9) {
    margin-top: 0 !important;
  }
  .photo-box-item-10:nth-child(-n + 10) {
    margin-top: 0 !important;
  }


</style>
