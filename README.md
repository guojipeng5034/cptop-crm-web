# 前端部署环境配置
生产环境发布流程

### Step 1. 环境安装
* 代码库地址：http://gitlab.52cebu.com/cptop/cptop-crm-web.git
* 分支：master
* node版本：>= 16.0.0
* pnpm版本：>=8.6.0
* 安装依赖：pnpm install

### Step 2. 修改打包配置
* 修改配置文件 .env.prod 对应请求和上传文件的域名

### Step 3. 打包
* 构建命令：npm run build:prod
* 构建路径：dist-prod

### Step 4. 配置域名

### Step 5. 访问登录 
用户名：admin

密码：admin123

### 现在前端部署环境支付页面使用的是cpzh 官网的页面，以及debug 模式，需要确认是否变更