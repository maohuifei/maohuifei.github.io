## 准备

1. 后端项目文件：huafengServer（koa+ts）
2. 前端项目文件：
    1. huafengWeb（vue3+ts）
    2. huafengWebAdmin（vue3+ts+elementPlus）
3. 数据库文件：huafengMySql
4. 云服务器：腾讯云Ubunto24
5. 其他：nginx、node、pm2、docter、k8s

## 本地运行项目

### 安装依赖

安装软件包管理器Homebrew

```bash
/bin/zsh -c "$(curl -fsSL <https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh>)"
```

使用homebrew安装node、mysql（这里node自带npm）

```
brew install node mysql
```

更换npm镜像源（淘宝）

```
npm config set registry <https://registry.npmmirror.com>
```

### 启动并设置mysql

```sql
-- 启动
mysql.server start
-- 初始化设置
mysql_secure_installation
-- 停止
mysql.server stop
-- 重启
mysql.server restart
-- 查看当前状态
mysql.server status

```

数据库配置

```sql
-- 新建一个用户：huafeng，密码：HFhf991((!
CREATE USER 'huafeng'@'localhost' IDENTIFIED BY 'HFhf991((!';
-- 新建一个数据库：huafengSQL
CREATE DATABASE huafengSQL;
-- 授予huafeng用户huafengSQL的权限
GRANT ALL PRIVILEGES ON huafengSQL.* TO 'huafeng'@'localhost';
-- 刷新权限
FLUSH PRIVILEGES;
-- 退出mysql
exit
```

### 后端项目

```
-- 启动项目
npm start
-- 生成typeorm数据库结构迁移文件
npm run migration:generate
-- 编译TS（按照配置文件tsconfig.json编译）
tsc
```

PS： 这里在tsconfig.json中修改了输出路径为./huafengserver/src， 再复制一份package.json，因为后面需要运行数据结构迁移文件，而原package.json里面路径还是ts文件，所以要修改package.json这几行的后缀ts为js 最后把修改后的package.json放入huafengserver文件夹

```json
"scripts": {

"migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts",

"migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts"

},
```

最后打包后的项目结构：

```
huafengserver
	-src
		- controllers
		- migrations
		- models
		- routes
		- utils
		- app.js
		- data-source.js
	-packsge.json
```

### 前端项目

```
-- 启动项目
npm run dev
-- 打包
npm build
-- 分别将打包后的dist文件夹重命名为huafeng和huafengadmin
```

最后打包好的项目结构：

```
huafeng/huafengadmin
	- assets
	- favicon.ico
	- index.html
	- 其他图片资源
```

## 初始云服务器（Ubuntu）

```
用户名：ubunto
密码：
```

设置防火墙端口白名单

```
22：用于远程登录
443: 用于ssl
```

## 远程ssh连接（mac终端）

连接命令：

```
ssh （用户名）@（IP地址）
```

**Ps可能要用到的命令：** 连接显示密钥匹配失败？

```
-- 重置密钥
ssh-keygen -R （IP地址）
```

如何进入root模式？

```
sudo -i
```

## 安装软件包（apt）

使用前先更新apt：

```
apt update
```

使用命令下载安装nginx、node、npm 、mysql-server、pm2

```
apt install （软件名）
```

更换npm镜像源（淘宝）

```
npm config set registry <https://registry.npmmirror.com>
```

## 上传项目文件

上传项目文件夹到服务器并改名

```bash
scp -r 本地文件 ubuntu@140.143.143.80:/tmp
```

服务器web项目文件夹路径：var/www/huafengWeb

```
-- 移动刚刚上传到tmp里面的huafeng、huafengadmin、huafengserver到目的文件夹
mv huafeng huafengadmin huafengserver /var/www/huafengWeb

-- 不能覆盖，必须先删除目标文件
cd /var/www/huafengWeb
rm -r huafeng huafengamdin
```

## 启动项目

### nginx

```
-- 启动nginx
systemctl start nginx
-- 查看nginx状态
systemctl status nginx
-- 修改nginx配置文件
nano /etc/nginx/sites-available/default
（配置文件内容查看下面的其他）
-- 重启nginx
systemctl restart nginx
-- 设置开机自启
systemctl enable nginx

```

此时应该已经能访问到网页资源

### mysql

```
步骤参考上面本地部署，命令有所区别
--启动命令
systemctl start mysql
-- 查看状态
systemctl status mysql
-- 登录控制台
mysql -u root -p
设置密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '密码';
-- 初始化安全配置
mysql_secure_installation

...

-- 设置开机自启
systemctl enable mysql
```

### 运行数据结构迁移文件

```
npm run migration:run
```

### pm2

```
-- 使用pm2启动后端项目入口文件
pm2 start app.js --name huafnegserver
-- 查看进程列表
pm2 list
-- 删除进程
pm2 delete 进程名
```

后端项目已启动，测试接口是否正常

## 部署完成

## 其他

### nginx配置

```bash
# 将 HTTP 重定向到 HTTPS

server {

    listen 80;

    server_name huafeng.website www.huafeng.website;

    return 301 https://$server_name$request_uri;

}

# HTTPS 服务器配置

server {

    listen 443 ssl;

    server_name huafeng.website www.huafeng.website;

    ssl_certificate /etc/nginx/ssl/huafeng.website_bundle.crt;    # 修改这里，使用正确的证书文件名

    ssl_certificate_key /etc/nginx/ssl/huafeng.website.key;      # 这个是对的，不用改

    ssl_session_timeout 5m;

    ssl_protocols TLSv1.2 TLSv1.3;

    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;

    ssl_prefer_server_ciphers on;

    # 前端服务 - 个人主页

    location /huafeng {

        alias /var/www/huafengWeb/huafeng/;

        try_files $uri $uri/ /huafeng/index.html;

    }

    # 前端服务 - 管理后台

    location /huafengadmin {

        alias /var/www/huafengWeb/huafengadmin/;

        try_files $uri $uri/ /huafengadmin/index.html;

    }

    # 后端服务

    location /api/ {

        proxy_pass <http://localhost:3000/api/>;  # 这个保持 http 因为是本地代理

        proxy_http_version 1.1;

        proxy_set_header X-Forwarded-Proto $scheme;  # 添加这行

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 添加这行

        proxy_set_header Upgrade $http_upgrade;

        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;

        proxy_cache_bypass $http_upgrade;

    }

    # 静态资源

    location /huafeng/assets/ {

        alias /var/www/huafengWeb/huafeng/assets/;

    }

    location /huafengadmin/assets/ {

        alias /var/www/huafengWeb/huafengadmin/assets/;

    }

}

```

### 日志查看

### nginx

日志文件路径 /var/log/nginx/

```
-- 错误日志
cat /var/log/nginx/error.log
-- 访问日志
cat /var/log/nginx/access.log
-- 实时查看日志
tail -f /var/log/nginx/access.log
```

### pm2

```
-- 查看最后200行日志
pm2 logs --lines 200
-- 查看错误日志
pm2 logs --err
```
## 技术升级-宝塔面板部署
```
下载宝塔、修改配置

```