<template>
  <div class="cash">
    <app-header title="提现"></app-header>
    <div class="title">钱包余额：</div>
    <mu-form ref="form" :model="validateForm" class="card-content">
      <mu-form-item label="地址：" prop="address" :rules="addressRules">
        <mu-text-field v-model="validateForm.address" prop="address" placeholder="请输入收款地址"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="数量：" prop="number" :rules="numberRules">
        <mu-text-field type="number" v-model="validateForm.number" prop="number" placeholder="请输入提现数量"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="交易密码：" prop="password" :rules="passwordRules">
        <mu-text-field type="password" v-model="validateForm.password" prop="password" placeholder="请输入交易密码"></mu-text-field>
      </mu-form-item>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit">确定</mu-button>
      </mu-form-item>
    </mu-form>
    <div class="prompt">
      <div class="tit">提示：</div>
      <div>
        1.提币将扣除提币金额的10%作为提币手续费.<br>
2.提币前，请确保流通钱包内有足够的ETH。<br>
3.因提币需人工审核，且转币需网络确认等，在提交提币申
请后，正常情况需3至5个工作日到账，请耐心等待！<br>
4.在提币的过程中遇到任何问题，请随时与系统客服联系！
      </div>
    </div>
  </div>   
</template>

<script>
export default {
  name: "Cash",
  data() {
    return {
      addressRules: [
        { validate: (val) => !!val, message: '请输入地址'},
      ],
      numberRules: [
        { validate: (val) => !!val, message: '请输入数量'},
        { validate: (val) => val > 0, message: '请输入正确的数量'},
        // { validate: (val) => val < this.info.data.okfine, message: '余额不足'}
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '请输入交易密码'},
      ],
      validateForm: {
        address: '',
        number: '',
        password: '',
      },
      info:{}
    };
  },
  created() {
    // this.getInfo();
    // this.getAddress();
  },
  methods: {
    getInfo() {
      this.$http.post("/api/info/moneyadress")
      .then(response => {
        this.info = response.data;
      })
    },
    getAddress() {
      this.$http.post("/api/regular/getaddress")
      .then(response => {
        const res = response.data;
        this.validateForm.address = res.data.address;
      })
    },
    // 提交
    submit() {
      this.$refs.form.validate().then((result) => {
        if(result){
          const formData = {
            address: this.validateForm.address,
            num: this.validateForm.number,
            Paytoken: this.validateForm.password,
            type: 'OKFINE'
          }
          this.$http.post("/api/regular/okfinedraw", formData)
          .then((response) => {
            console.log(response.data)
            const res = response.data;
            if( res.status === "y") {
              console.log(res)
              this.$router.back();
            }
            this.$toast.message(res.msg);
          })
        }
      });
    },
  }
};
</script>
<style scoped>
.cash .title{ padding: 15px 0 15px 10%; color: #AE3EE5; font-size: 14px;  background-color: #F2F3F9; }
.card-content{ padding-bottom: 0;}
.cash .prompt{ padding: 0 10%; color: #7A7A7A;}
.cash .prompt .tit{ font-size: 15px; color: #443C5C;}
.cash .mu-input{ font-size: 14px;}
</style> 
