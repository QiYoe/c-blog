---
title: 百度收录
head:
  - - meta
    - name: description
      content: 百度收录网站详细教程
  - - meta
    - name: keywords
      content: 百度收录 普通收录
---

## 为什么要进行百度收录？

如果没有百度收录，那么你的网站是在百度上搜索不到的。访问你的网站只能通过地址栏键入的方式才能访问

## 检查你的网站是否已收录

百度地址栏键入

```bash
site:你的网址
# site:后填写你的网站网址，比如我的网站是qiyoe.cn，地址栏键入site:qiyoe.cn
```

如果有返回结果，证明你的网站已收录，如果没有，则未被收录

## 收录流程

1、在未被收录的返回信息中点击[提交网址](https://ziyuan.baidu.com/linksubmit/url?sitename=http%3A%2F%2Fsite%3Aqiyoe.github.io)

2、在`用户中心`下的`管理员设置`中修改你的站点地址协议为https，比如我的是`https://www.qiyoe.cn`

2、在新打开的网页点击`HTTPS验证`。

::: warning
1、首页确保你的网址协议是https（我的是`https://qiyoe.cn`）

2、如果还是失败，检查地址栏，把http改成https。比如
`https://ziyuan.baidu.com/https/index?site=http://www.qiyoe.cn/`修改为
`https://ziyuan.baidu.com/https/index?site=https://www.qiyoe.cn/`
:::

3、在新打开的网页点击`普通收录`，选择手动提交，把链接提交上去，这是我网站的死链

```bash
httpa://www.qiyoe.cn/
httpa://www.qiyoe.cn/front-end/vitepress-build.html
httpa://www.qiyoe.cn/books/you-dont-know-js.html
httpa://www.qiyoe.cn/tools/smart-tools.html
```

4、最后就是等时间了，当时我的是花了两天时间才收录成功。验证成功的方式就是`site:你的网址`
