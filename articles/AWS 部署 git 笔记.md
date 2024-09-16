## AWS服务器部署git仓库

#### 前置任务：申请并拥有一个AWS云服务器

这个网上的资料已经非常多了，这里提供两个链接：
[bilibili](https://www.bilibili.com/video/BV1QY4y1m7fw/?spm_id_from=333.337.search-card.all.click)
[YouTube](https://www.youtube.com/watch?v=SFaSB6vgp8k)

拥有云服务器之后，你就可以在自己电脑上远程连接上云服务器，我使用的是AWS提供的指令中的SSH连接方式，
```bash
ssh -i "sample.pem" username@ip address.ap-east-1.compute.amazonaws.com
```
此外，你还需要用自己的git邮箱生产一个密钥对用于ssh密钥，之后在AWS上部署ssh时要用，你可以在自己电脑的git bash 上输入以下指令
```shell
ssh-keygen -t rsa -b 2048 -C "your_email@example.com"
```
之后你就可以获得一个公钥和私钥，公钥用于上传到git, 私钥用于解锁。这里值得注意的是，如果之后需要团队合作，那么最好每一个用户都根据自己的邮箱生成一个密钥对，然后将公钥加到git当中。
#### 配置步骤（我使用的是Ubuntu）

- 首先初始化一个git仓库
	1. 远程连接你的云服务器
	2. 安装git `sudo apt-get install git`
	3. 切换到根用户 `sudo su`
	4. 添加一个主账户 `sudo adduser username`
	5. 切换到用户目录下 `cd /home/username`
	6. 新建仓储目录 `mkdir git-resposity`
	7. 初始化git仓储 `git init --bare /home/username/git-resposity/name.git`
- 接着配置你的SSH
	1. 修改git仓库权限 `sudo chown -R git:git sample.git`
	2. 切换到你的git用户 `sudo su - username`
	3. 创建 `/.ssh` 目录（如果还没有的话）`mkdir -p ~/.ssh`
	4. 创建一个`authorized_keys`然后将公钥复制进去 `nano ~/.ssh/authorized_keys, 然后保存退出, 这样你的主用户的公钥就已经在git里面了
	5. 检查用户权限
	   `chmod 600 ~/.ssh/authorized_keys`
	   `chmod 700 ~/.ssh`
	6. 退出用户 `exit`

到此配置完毕，你可以尝试在客户端clone你的项目
```shell
git clone username@ipaddress:/home/username/repositories/your-repo.git
```
或者带上你的私钥
```shell
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa' git clone username@ipaddress:/home/username/repositories/your-repo.git
```
其中`~/.ssh/id_rsa` 是你的私钥地址，一般存放在`C:/user/admin/.ssh`下

##### 报错
如果出现报错提示 `detected dubious ownership`, 你还需要将git仓库添加到安全目录当中，连接到实例之后，执行下面的命令
```shell
git config --global --add safe.directory /home/username/repositories/your-repo.git
```
同时也可以再次确保一下权限问题
```shell
sudo chown -R git:git /home/username/repositories/your-repo.git
sudo chmod -R 755 /home/username/repositories/your-repo.git
```
#### 添加团队成员

- 创建新用户
	- 同样先连接到你的服务器，使用根用户权限
	- 创建一个新用户 `sudo adduser git2`
	- 把新用户添加到主用户组，一边新用户拥有和主用户一样的权限
	  `sudo usermod -aG git git2`
- 配置权限
	- 在客户端为新用户生成一个密钥对 `ssh-keygen -t rsa -b 2048 -C "git2@example.com"`
	- 将公钥复制到服务器 
	  `nano /home/main user/git2_key.pub`
	  `sudo chown git:git /home/main username/git2_key.pub`
	- 切换到主用户添加成员用户公钥 `sudo su - main user`
	- 添加公钥内同到git仓库的`zuthorized_keys` 文件
	  `cat /home/git/git2_key.pub >> ~/.ssh/authorized_keys`
	  `rm /home/git/qiuqiu_key.pub`
	- 确保`.ssh` 和 `authorized_keys`权限正确
	  `chmod 700 ~/.ssh`
	  `chmod 600 ~/.ssh/authorized_keys`
- 配置完成
	现在可以在客户端本地推拉仓库了
```shell
GIT_SSH_COMMAND='ssh -i ~/.ssh/git2_key' git clone username@ipaddress:/home/username/git-resposity/fydzz.git
```
