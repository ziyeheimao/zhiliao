SET NAMES UTF8;                                             #语言编码
DROP DATABASE IF EXISTS zhiliao;                            #丢弃数据库 如果存在
CREATE DATABASE zhiliao CHARSET=UTF8;                       #语言编码
USE zhiliao;                                                #进入zhiliao

#创建用户表
CREATE TABLE user_info(
    userId INT PRIMARY KEY AUTO_INCREMENT,                  #用户id主键+自增
    email VARCHAR(128) UNIQUE,                              #电子邮件
    userName VARCHAR(32) UNIQUE,                            #用户昵称唯一约束
    password VARCHAR(128) NOT NULL,                         #密码 md5散列算法 不可为空
    sex TINYINT,                                            #性别布尔值 0保密 1男 2女
    userPic VARCHAR(512)                                    #头像地址
    -- phone VARCHAR(16) UNIQUE,                               #手机
    -- occupationCode VARCHAR(9),                              #行业代码
    --                                                         #职业代码
    --                                                         #岗位代码
    -- provinceCode VARCHAR(6),                                #省级代码
    -- cityCode VARCHAR(6),                                    #市级代码
    -- regionCode VARCHAR(6),                                  #区县代码
);

#向用户表插入数据
INSERT INTO user_info VALUES
(NULL,"819405241@qq.com","箫",md5("4869"),1,"http://127.0.0.1:80/static/userPic/1_Pic.gif"),
(NULL,"819405242@qq.com","筱竹听雨",md5("4869"),2,"http://127.0.0.1:80/static/userPic/2_Pic.gif"),
(NULL,"819405243@qq.com","子夜黑猫",md5("4869"),2,"http://127.0.0.1:80/static/userPic/9.jpg"),
(NULL,"819405244@qq.com","箫羽叶",md5("4869"),1,'http://127.0.0.1:80/static/userPic/4.jpg'),
(NULL,"819405245@qq.com","战神无双",md5("4869"),0,'http://127.0.0.1:80/static/userPic/5.jpg'),
(NULL,"819405246@qq.com","麦克斯韦的妖精",md5("4869"),2,'http://127.0.0.1:80/static/userPic/6.jpg'),
(NULL,"819405247@qq.com","棍+球=糖葫芦",md5("4869"),2,'http://127.0.0.1:80/static/userPic/7.jpg'),
(NULL,"819405248@qq.com","halihali",md5("4869"),0,'http://127.0.0.1:80/static/userPic/8.jpg'),
(NULL,"819405250@qq.com","bilibili",md5("4869"),0,'http://127.0.0.1:80/static/userPic/9.jpg'),
(NULL,"819405251@qq.com","dilidili",md5("4869"),0,'http://127.0.0.1:80/static/userPic/4.jpg'),
(NULL,"819405252@qq.com","zilizili",md5("4869"),0,'http://127.0.0.1:80/static/userPic/5.jpg'),
(NULL,"819405253@qq.com","箫羽姌",md5("4869"),2,'http://127.0.0.1:80/static/userPic/8.jpg'),
(NULL,"819405254@qq.com","箫箫",md5("4869"),2,'http://127.0.0.1:80/static/userPic/2_Pic.gif'),
(NULL,"819405255@qq.com","箫箫乐",md5("4869"),0,'http://127.0.0.1:80/static/userPic/10.jpg'),
(NULL,"819405256@qq.com","箫羽夜",md5("4869"),2,'http://127.0.0.1:80/static/userPic/11.jpg'),
(NULL,"819405257@qq.com","箫消乐",md5("4869"),2,'http://127.0.0.1:80/static/userPic/12.jpg'),
(NULL,"819405258@qq.com","箫姌",md5("4869"),2,'http://127.0.0.1:80/static/userPic/13.jpg'),
(NULL,"819405259@qq.com","箫羽",md5("4869"),1,"http://127.0.0.1:80/static/userPic/1_Pic.gif");



#创建帖子表 纸条 paper strip
CREATE TABLE paper_strip(
    paperStripId INT PRIMARY KEY AUTO_INCREMENT,            #用户id主键+自增
    userId INT,                                             #用户id
    userName VARCHAR(32),                                   #用户昵称
    title VARCHAR(128) NOT NULL,                            #标题
    content VARCHAR(419430400) NOT NULL,                    #内容 最大50MB 含base64图片
    keyword VARCHAR(1024),                                  #关键词
    coverMap VARCHAR(1024),                                 #封面图片链接
    releaseTime BIGINT NOT NULL,                            #发布时间 时间戳 -- var timestamp=new Date().getTime()；
    languageSign VARCHAR(128) NOT NULL,                     #语言标记 用来单独处理html之类会被浏览器 当代码跑的语言
    star INT,                                               #点赞
    starUserId VARCHAR(10240000),                           #点赞人id集合
    FOREIGN KEY(userId) REFERENCES user_info(userId)        #外键
    -- FOREIGN KEY(userName) REFERENCES user_info(userName)    #外键
);

#向纸条表插入数据
INSERT INTO paper_strip VALUES
(NULL,1,"箫","标题1qaz标题要长~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","分享一下商演价格","1 2 3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572851767000,'[0]',0,'[]'),
(NULL,1,"箫","标题2wsx","网站导航 | 宾馆索引 | 用户协议 | 关于携程 | 企业公民 | 诚聘英才 | 分销联盟 | 企业礼品卡采购 | 代理合作 | 广告业务 | 联系我们 | 返回旧版Copyright © 1999-2019, ctrip.com. All rights reserved","4 4 5","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572852767000,'[1]',0,'[]'),
(NULL,1,"箫","标题3edc","你们知道赛前说垃圾话和赛后说垃圾话的区别吗，当时全场包括LWX后来都觉得这句话说得有多不合时宜","5 6 7","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572853767000,'[0,1,2]',4,'[]'),
(NULL,1,"箫","标题4rfv","各位老铁，你们觉得米加勒会领盒饭嘛？","8 9 0","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572854767000,'[0,1,2]',0,'[]'),
(NULL,1,"箫","标题5tgb","我们助教老师画的，属于什么水平？","10 11 12","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572557767000,'[3,4,1]',0,'[]'),
(NULL,1,"箫","标题6yhn","这个兄弟刚步入社会第一次和领导吃饭，你们觉得会是什么结果","13 41 14","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572617767000,'[0,12,5]',0,'[]'),
(NULL,2,"筱竹听雨","标题7ujm","新手表示刚看完漫画，准备追小说，老鸟们有什么建设性的意见没","15 16 17","http://127.0.0.1:80/static/userPic/1_Pic.gif",1573857767000,'[6,1,5]',3,'[1]'),
(NULL,2,"筱竹听雨","标题8ik","贴吧即百度贴吧，是百度旗下独立品牌，全球最大的中文社区。贴吧的创意来自于百度首席执行官李彦宏：结合搜索引擎建立一个在线的交流平台，让那些对同一个话题感兴趣的人们聚集在一起，方便地展开交流和互相帮助。贴吧是一种基于关键词的主...","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572457767000,'[0,6,7]',5,'[]'),
(NULL,2,"筱竹听雨","标题9ol","tools插入代码，使用devtools插入代码使用devtools插入代码","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572557767000,'[]',0,'[]'),
(NULL,2,"筱竹听雨","标题10p","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",15728657767000,'[1,5,2]',0,'[]'),
(NULL,2,"筱竹听雨","标题11,","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572877767000,'[6,8,9]',0,'[]'),
(NULL,2,"筱竹听雨","标题12.","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572858767000,'[7,6,5]',0,'[]'),
(NULL,2,"筱竹听雨","标题13/","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572897767000,'[2,3,5,6,8]',2,'[]'),
(NULL,3,"子夜黑猫","标题15'","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572807767000,'[10,12,11]',1,'[]'),
(NULL,3,"子夜黑猫","标题14[","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572801767000,'[15,16,1]',0,'[]'),
(NULL,3,"子夜黑猫","标题15]","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1571857767000,'[3,4,5,6,7,8,9]',0,'[]'),
(NULL,3,"子夜黑猫","标题16!@#","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572257767000,'[11,12,13,14,15,16,17,18,19]',0,'[]'),
(NULL,3,"子夜黑猫","标题17$%^","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572357767000,'[1,2,3,4,5,6,7,8,9]',0,'[]'),
(NULL,3,"子夜黑猫","标题18&*(","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572845776700,'[1,2,3,4,5,6,7,8,9]',0,'[]'),
(NULL,3,"子夜黑猫","标题19)_+","内容","关键词1 关键词2 关键词3","http://127.0.0.1:80/static/userPic/1_Pic.gif",1572867767000,'[1,2,3,4,5,6,7,8,9,10]',0,'[]');


#验证码表
CREATE TABLE verification_code(
    verificationCodeId INT PRIMARY KEY AUTO_INCREMENT,      #验证码id主键+自增
    userId INT,                                             #用户ID 关联用户ID表
    verificationCode VARCHAR(4) NOT NULL,                   #四位验证码
    FOREIGN KEY(userId) REFERENCES user_info(userId)        #外键
);


#token_date表
CREATE TABLE token_date(
    tokenDateId INT PRIMARY KEY AUTO_INCREMENT,             #用户id主键+自增
    userId INT,                                             #用户ID 关联用户ID表
    timeStamp BIGINT NOT NULL,                              #token到期时 时间戳
    FOREIGN KEY(userId) REFERENCES user_info(userId)        #外键
);
