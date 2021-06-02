# SEO优化

## 为什么要进行SEO优化？

为了能让你的网站搜索排名提前

## 优化点

基本上vitepress已经把大部分工作做了，剩下的基本都是需要自定义的一些

### title

首页title和文章页title要加上

### keywords

网站head标签添加keywords，对应vitepress中就是在`head`属性下添加`['meta', { name: 'keywords', content: '南上康青山...'}],`

### description

首页添加description

``` warning
vitepress把文章内的很多属性废弃了，比如description、tags等等，所以通常只加在首页就可以了
```

## 查看SEO评分

打开浏览器控制台的`Lighthouse`，点击生成报告，查看网站评分。我的是SEO评分是100🤭
