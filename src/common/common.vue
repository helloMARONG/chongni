<template>
  <div class="share">
  </div>
</template>

<script>
export default {
  methods: {
    // 截屏+分享
    saveImg(successCB, errorCB, fileName, imgID, overwrite, format, quality, clip) {
      let that = this;
      setTimeout(() => {
        that.shareBtn = false;  //隐藏按钮
        successCB = successCB || function() {};
        errorCB = errorCB || function() {};
        fileName = fileName || Date.parse(new Date()); //文件名 不需后缀名, 默认当前时间戳
        imgID = imgID || String(Date.parse(new Date())); //原生图片ID, 默认当前时间戳
        overwrite = overwrite || true;  //是否覆盖
        format = format || "png"; //保存的格式
        quality = quality || 50;  //保存质量，1-100
        clip = clip || {top: "0px", left: "0px",  width: "100%", height: "90%"};  //指定截屏区域
        let self = plus.webview.currentWebview();
        let bitmap = new plus.nativeObj.Bitmap(imgID);
        //绘制截图
        self.draw(bitmap, function() {
            // 保存Bitmap图片
            bitmap.save("_doc/shareimg.png",{overwrite: overwrite, format: format, quality: quality, clip: clip}, function(i) {
                let index = i.target.lastIndexOf('/');
                let str = i.target.substr(index+1);
                console.log(str);
                let msg = {
                  type: 'image', 
                  pictures: ['_doc/'+str], //这里的pictures是要分享的图片 该图片放在项目根目录下
                };
                plus.share.sendWithSystem(msg, function(){
                  console.log('Success');
                }, function(e){
                  console.log('Failed: '+JSON.stringify(e));
                })
                that.shareBtn = true;  //显示按钮
              },
              function(e) {
                bitmap.clear();
                that.shareBtn = true;  //显示按钮
                that.$toast.message("图片绘制失败");
              }
            );
          },
          function(e) {
            that.shareBtn = true;  //显示按钮
            that.$toast.message("截图失败");
          }
        );
      }, 100);
    },
    // 调用系统内置分享文字+链接
    shareLink(url) {
      let msg = {
        type: 'web',
        content: '我现在每天都在玩嗨比特，赚炉石得现金，邀请还获双向福利，快来和我一起领取！千万人中选中你，不领就亏了',
        href: this.info.value,
      };
      plus.share.sendWithSystem(msg, function(){
        console.log('Success');
      }, function(e){
        console.log('Failed: '+JSON.stringify(e));
      })
    },
    // 截屏保存图片至相册
    saveImg(successCB, errorCB, fileName, imgID, overwrite, format, quality, clip) {
      successCB = successCB || function() {};
      errorCB = errorCB || function() {};
      fileName = fileName || Date.parse(new Date()); //文件名 不需后缀名, 默认当前时间戳
      imgID = imgID || String(Date.parse(new Date())); //原生图片ID, 默认当前时间戳
      overwrite = overwrite || true;  //是否覆盖
      format = format || "png"; //保存的格式
      quality = quality || 50;  //保存质量，1-100
      clip = clip || {top: "0px", left: "0px",  width: "100%", height: "100%"};  //指定截屏区域
      let self = plus.webview.currentWebview();
      let bitmap = new plus.nativeObj.Bitmap(imgID);
      //绘制截图
      let that = this;
      self.draw(bitmap, function() {
          // 保存Bitmap图片
          bitmap.save("_doc/" + fileName + "." + format,{overwrite: overwrite, format: format, quality: quality, clip: clip}, function(i) {
              //保存到系统相册
              plus.gallery.save(
                i.target,
                function(d) {
                  //销毁Bitmap图片
                  bitmap.clear();
                  that.$toast.message("图片保存成功");
                },
                function(e) {
                  //销毁Bitmap图片
                  bitmap.clear();
                  that.$toast.message("图片保存至相册失败");
                }
              );
            },
            function(e) {
              bitmap.clear();
              that.$toast.message("图片保存失败");
            }
          );
        },
        function(e) {
          that.$toast.message("截屏绘制失败");
        }
      );
    },
    // 支付宝，微信支付
    pay() {
      // 获取支付通道
      plus.payment.getChannels( function(s){
        channels = s;
      }, function(e){
        alert( "获取支付通道列表失败："+JSON.stringify(e));
      });
      // 请求支付操作
      const formData = {
        order_no: this.vipOrder.order_no,
      }
      this.$http.post("/Pay/aliPay",formData).then(response => {
        let that = this;
        // console.log(response.data);
        // console.log(JSON.stringify(channels));  // 0支付宝alipay，1微信wxpay，这里要加个判断，可能某些地方是反的
        let payType = "";
        if(channels[0].id == 'alipay') {
          payType = channels[0];
        }else if(channels[0].id == 'wxpay'){
          payType = channels[1];
        }
        const res = response.data;
        if(res.status == 0) {
          plus.payment.request(payType, res.data.sdk, function(){  //支付宝
            that.$toast.message("支付操作成功！");
            setTimeout(() => {
              that.$router.push("/MyVip");
            }, 500);
          }, function(e){
            that.$toast.message("支付失败！");
            // alert("支付失败："+JSON.stringify(e));
          } );
        }else{
          this.$toast.message(res.msg);  //未开放
        }
      })
    },
    
  }
}
</script>
