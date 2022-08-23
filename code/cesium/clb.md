---
head:
  - - meta
    - name: description
      content: Cesium离线加载
  - - meta
    - name: keywords
      content: 免费 cesium cesiumlib 离线 脱网 tif terrain img 切片 瓦片图
---

# Cesium离线加载

## 背景(以下涉及到的所有东西都是免费)

`cesium` 在脱网环境下是加载不出来地球的，因为 `cesium` 需要 `token` 进行请求加载图片展示。所以如果脱网情况下使用 `cesium` 就需要自己部署一个离线地图服务

## 地图数据下载

### 1. 数据源

`cesium` 支持 `DEM` 数据源格式（通常是 **.tif**）。`DEM`（数字高程模型）数据建议从[地理空间数据云](http://www.gscloud.cn/home)下载，这是我国中科院提供的一个免费地理数据项目。

### 2. 批量收藏

在[地理空间数据云](http://www.gscloud.cn/home)注册之后，点击目录 **公开数据** -> **DEM 数字高程数据**，随后选择一个你中意的高程数据点击进去。该数据页面默认的分页是10条，我们选择20条（目前40条和60条分页`批量收藏`不会成功）。之后一页页的点击 **编号** -> **批量收藏** 吧 :)

### 3. 批量处理收藏数据

收藏完毕之后在个人账号下选择 **我的下载** -> **可下载数据** -> **分页选择60** -> **编号** -> **批量下载**。还是一页页点击哦 :)

### 4. 批量申请下载数据

目录 **下载申请** -> **批量申请**，在列表中点击 **详细**，用它提供的 `ftp` 地址、账号和密码来进行下载数据

:::tip
`ftp` 工具我建议用[WinSCP](https://winscp.net/eng/docs/lang:chs)(如果是windows系统)
:::

## 转换格式

在[地理空间数据云](http://www.gscloud.cn/home)下载好数据之后，发现都是 `.img` 格式。这里需要转换为 `.tif` 格式，再转为 `.terrain` 格式。

### .img -> .tif

这里我用的是 [ArcGIS](http://www.zhanshaoyi.com/11466.html)

安装 `ArcGIS` 之后，启动 `ArcMap` 应用程序。选择 **ArcToolbox** -> **Conversion Tools** -> **To Raster** -> **Raster To Other Format(multiple)**。随后添加 `img` 文件

:::tip
1. 添加 `.img` 文件的时候，可以按 `shift` 键进行多选
2. 存放 `.tif` 文件的文件夹最好是空文件夹
:::

### .tif -> .terrain

这里我用的是 [CesiumLab](http://www.cesiumlab.com/)(它有一个7天的免费试用)

在 `cesiumlab2` 应用中选择 **数据处理** -> **地形切片** -> **添加** -> **储存类型：散列文件** -> **输出文件：填写盛放生成数据的空文件夹路径** -> **确认**

*2000 years later ...*

## 部署地图服务
