## 开发

```bash
# 克隆项目
git clone git@github.com:lc84188418/pxx-cms-ui.git

# 提交代码
git add .
git commit -m '提交代码'
git push

# 拉代码
git pull

#其他git操作
#查询某文件提交记录 如 index.vue
进入文件所在目录后 git log index.vue


# 进入项目目录
cd pxx-cms-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
