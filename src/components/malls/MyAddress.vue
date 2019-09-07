<template>
  <div class="myAddress">
    <app-header title="收获地址"></app-header>
    <mu-form ref="form" :model="validateForm" class="card-content">
      <mu-form-item label="收货人：" prop="name" :rules="nameRules">
        <mu-text-field v-model="validateForm.name" prop="name" placeholder=""></mu-text-field>
      </mu-form-item>
      <mu-form-item label="联系电话：" prop="phone" :rules="phoneRules">
        <mu-text-field type="phone" v-model="validateForm.phone" prop="phone" placeholder=""></mu-text-field>
      </mu-form-item>
      <mu-form-item label="所在地区：" prop="area" :rules="areaRules">
        <v-distpicker :province="validateForm.province" :city="validateForm.city" :area="validateForm.area" @selected="onSelected"></v-distpicker>
      </mu-form-item>
      <mu-form-item label="详细地址：" prop="areaDetails" :rules="areaDetailsRules">
        <mu-text-field v-model="validateForm.areaDetails" prop="areaDetails" placeholder=""></mu-text-field>
      </mu-form-item>
      <mu-form-item>
        <mu-button class="common-btn" @click="submit">确定</mu-button>
      </mu-form-item>
    </mu-form>
    
  </div>   
</template>

<script>
import VDistpicker from 'v-distpicker'
export default {
  name: "MyAddress",
  data() {
    return {
      nameRules: [
        { validate: (val) => !!val, message: '请输入姓名'},
      ],
      phoneRules: [
        { validate: (val) => !!val, message: '请输入电话'},
        // { validate: val => (/^[1][3-9][0-9]{9}$/.test(val)), message: "请输入正确的手机号" }
      ],
      areaRules: [
        { validate: (val) => !!val, message: '请选择地区'},
      ],
      areaDetailsRules: [
        { validate: (val) => !!val, message: '请输入详细地址'},
      ],
      validateForm: {
        name: '',
        phone: '',
        province:'',
        city: '',
        area: '',
        areaDetails: '',
      },
    };
  },
  components: { 
    VDistpicker 
  },
  created() {
    // this.getAddress();
  },
  methods: {
    // 收获地址
    getAddress() {
      this.$http("shop/address").then(response => {
        const res = response.data.data;
        console.log(res);
        this.validateForm.areaDetails = res.address;
        this.validateForm.name = res.name;
        this.validateForm.phone = res.mobile;
        this.validateForm.province = res.province;
        this.validateForm.city = res.city;
        this.validateForm.area = res.town;
      })
    },
    // 省市区
    onSelected(data) {
      console.log(data);
      this.validateForm.province = data.province.value;
      this.validateForm.city = data.city.value;
      this.validateForm.area = data.area.value;
      console.log(this.validateForm)
    },
    // 提交
    submit() {
      this.$refs.form.validate().then((result) => {
        if(result){
          const formData = {
            name: this.validateForm.name,
            mobile: this.validateForm.phone,
            province: this.validateForm.province,
            city: this.validateForm.city,
            town: this.validateForm.area,
            address: this.validateForm.areaDetails,
          }
          this.$http.post("/shop/address", formData).then((response) => {
            // console.log(response.data)
            const res = response.data;
            this.$toast.message(res.msg);
            if(res.status === 0){
              this.$router.back();
            }
          })
        }
      });
    },
  }
};
</script>
<style scoped>
.distpicker-address-wrapper{ width: 100%; top: 320px; overflow: auto;  background: #fff;}
.distpicker-address-wrapper select{font-size:12px;}

</style> 
