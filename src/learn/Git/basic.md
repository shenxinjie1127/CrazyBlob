---
icon: akar-icons:file
date: 2025-07-01
order: 1
category:
  - Git
---

# Git 基础

## 文件状态

1. 工作区

   相当于本地写代码的区域，如git clone 一个项目到本地，相当于本地克隆了远程仓库项目的一个副本。
2. 暂存区

   暂存区是一个文件，保存了下次将提交的文件列表信息，一般在Git仓库目录中
3. 本地仓库

   提交更新，找到暂存区域文件，将快照永久性存储到Git本地仓库
4. 远程仓库

   远程仓库是一个Git服务器，保存了所有的版本信息，其他人可以通过克隆、拉取等方式获取到本地仓库的代码。

![img.png](/assets/images/source/git.png)

## Git 基本命令

### 用户信息配置

```bash
git config --global user.name "[name]"
git config --global user.email "[email address]"
```

### 项目初始化

```bash
git init [project-name]
git colne [url]
```

### 常用操作

- Git init 初始化仓库，默认为master分支
- Git add . 提交全部文件修改到缓存区
- Git add [具体某个文件路径+全名] 提交某些文件到缓存区
- Git diff 查看当前代码add 后，会add 哪些内容
- Git diff --staged 查看现在commit提交后，会提交哪些内容
- Git status 查看当前分支状态
- Git pull [远程仓库名] [远程分支名] 拉取远程仓库的分支与本地当前分支合并
- Git pull [远程仓库名] [远程分支名]:[本地分支名] 拉取远程仓库的分支与本地某个分支合并
- Git commit -m "注释" 提交代码到本地仓库，并写提交注释
- Git commit -v 提交时显示所有diff 信息
- Git commit --amend [file1] [file2] 重做了上一次commit ，并包括指定文件的新变化关于提交信息的格式，可以遵循以下的规则：

**关于提交信息的格式，遵循以下的规则：**

- feat：新特性
- fix： 修改bug
- refactor： 代码重构
- docs：文档修改
- style：代码格式修改，注意不是css修改
- test：测试用例修改
- chore：其他修改，比如构建流程，依赖管理

### 分支操作

- `Git branch` 查看本地所有分支
- `Git branch -r` 查看远程所有分支
- `Git branch -a` 查看本地和远程所有分支
- `Git merge <分支名>` 合并分支
- `Git merge --abort `合并分支出现冲突，取消合并，一切回到合并前的状态。
- `Git branch <新的分支> `基于当前分支，新建一个分支
- `Git checkout --orphan <新的分支>` 新建一个空分支（会保留之前分支的所有文件）
- `Git branch -D <分支名>` 删除本地某个分支
- `Git push origin -delete`  <分支名>  删除远程分支
- `Git branch <新的分支> <提交的ID>` 从提交历史回复删除的某个分支
- `Git branch -m <原分支> <新分支>` 分支更名
- `Git checkout <分支名>` 切换到本地某个分支
- `Git checkout <远程库>/<分支名>` 切换到线上某个分支
- `git checkout -b <新分支名>` 把基于当前分支新建分支，并切换为这个分支

### 远程仓库操作

- `Git fetch <remote>` 下载远程仓库的所有变动
- `Git remote -v `显示所有的远程仓库
- `Git pull <remote> <branch>` 拉取远程仓库的分支与本地当前分支合并
- `Git fetch` 获取线上最新版信息记录，不合并
- `Git push <remote> <branch>` 上传本地指定分支到远程仓库
- `Git push <remote> --force` 强行推送当前分支到远程仓库，即使有冲突
- `Git push <remote> --all` 推送所有分支到远程仓库

### 撤销操作

- `Git checkout <file>` 恢复暂存区的指定文件到工作区
- `Git checkout <commit> <file>` 恢复某个commit的指定文件到暂存区和工作区
- `Git checkout . `恢复暂存区的所有文件到工作区
- `Git reset [commit]` 重置当前分支的指针为指定commit 同时重置暂存区，但工作区不变。
- `Git reset --hard` 重置暂存区与工作区，与上一次commit 保持一致
- `Git reset <file>` 重置暂存区指定文件，与上一次commit 保持一致，但工作区保持不变
- `Git revert [commit]` 后者的所有变化都将被前者抵消，并且应用到当前分支

### 存储操作

- `Git stash` 暂时将未提交的变化移除
- `Git stash pop` 取出储藏中最后存入的工作状态进行恢复，会删除储藏。
- `Git stash list` 查看所有储藏中的工作
- `Git stash apply <储藏的名称>` 取出储藏中对应的工作状态进行恢复，不会删除储藏
- `Git stash clear` 清空所有储藏的工作
- `Git stash drop <储藏的名称>` 删除对应的某个储藏