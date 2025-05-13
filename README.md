# taozi 科技的谷歌浏览器扩展

## 使用方法

### 1.下载 release 的包

- 解压
- 然后进入浏览器扩展管理页面 `chrome://extensions/`
- 打开开发者模块
- 点击加载已解压的扩展程序，然后选择解压目录就行了

### 2.自己拉代码构建

- 先执行`pnpm i`
- 在执行 `pnpm run build-package`
- 根第一种方式一样，只不过加载已解压的扩展程序时选择`./extensions`

## 功能

### 快速生成变量名

因为用到了百度翻译的 api 所以需要配置百度翻译 api 的一些东西

![](./assets/Snipaste_2025-05-13_16-57-49.png)

### 根据 codesign.qq.com 里面的样式快速生成需要的代码，并过滤掉多余的 css 样式

这个功能也要配置百度翻译 api

![](./assets/Snipaste_2025-04-27_13-36-43.png)

### 根据 apifox.com 的 api 信息快速生成 api 调用代码

先配置调用代码的模板

![](./assets/Snipaste_2025-04-27_13-46-17.png)

然后点击按钮

![](./assets/Snipaste_2025-04-27_13-46-42.png)

就能生成 api 调用代码了

![](./assets/Snipaste_2025-04-27_13-51-53.png)

### 实时显示 tapd 代办的事项

这个功能需要自己去部署 cloudflare worker，代码在 packages/cf-worker

然后把访问地址配置到 CFWorker 代理地址中才行

![](./assets/Snipaste_2025-05-13_16-54-32.png)
