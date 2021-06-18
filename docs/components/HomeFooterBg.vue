<template>
  <div class="footer_bg">
    <div class="footer_bg_one">
      <img 
        class="lazy"
        data-url="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/1.gif"
        style="width: 100%;"
        alt=""
        src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/1.gif"
      />
    </div>
    <div class="footer_bg_three">
      <img 
        class="lazy"
        data-url="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/3.gif"
        style="width: 100%;"
        alt=""
        src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/3.gif"
      />
    </div>
    <div class="footer_bg_two">
      <img 
        class="lazy"
        data-url="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/2.gif"
        style="width: 100%;"
        alt=""
        src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/2.gif"
      />
    </div>
    <div class="footer_bg_four">
      <img 
        class="lazy"
        data-url="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/4.gif"
        style="width: 100%;"
        alt=""
        src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/assets-storage/imgs/blog-home-footer/4.gif"
      />
    </div>
  </div>
</template>

<style scoped>
.footer_bg {
  position: relative;
  background: url(https://img.halfrost.com/Blog/ArticleTitleImage/footer_bg.png) repeat-x scroll center 0;
  width: 100%;
  height: 264px;
  overflow-x: hidden;
  overflow-y: hidden;
}

.footer_bg .footer_bg_one {
  background: no-repeat center center;
  width: 60px;
  height: 96px;
  background-size: 100%;
  position: absolute;
  bottom: -10px;
  left: 30%;
  transform: scale(2.7);
  -webkit-animation: myfirst 20s linear infinite;
  animation: myfirst 20s linear infinite;
}

.footer_bg .footer_bg_three {
  background: no-repeat center center;
  width: 60px;
  height: 96px;
  background-size: 100%;
  bottom: -46px;
  right: 38%;
  transform: scale(4.2);
  position: absolute;
  -webkit-animation: mySecond 25s linear infinite;
  animation: mySecond 25s linear infinite;
}

.footer_bg .footer_bg_two {
  background: no-repeat center center;
  width: 60px;
  height: 96px;
  background-size: 100%;
  bottom: 20px;
  left: 38%;
  position: absolute;
  -webkit-animation: myfirst 30s linear infinite;
  animation: myfirst 30s linear infinite;
}

.footer_bg .footer_bg_four {
  background: no-repeat center center;
  width: 60px;
  height: 96px;
  background-size: 100%;
  bottom: 10px;
  right: 38%;
  transform: rotateY(180deg);
  position: absolute;
  -webkit-animation: mySecond 35s linear infinite;
  animation: mySecond 35s linear infinite;
}

@keyframes myfirst {
  0%   { left: -25%; }
  100% { left: 110%; }
}

@keyframes mySecond {
  0%   { left: 110%; }
  100% { left: -20%; }
}
</style>
