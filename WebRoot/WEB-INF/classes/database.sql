create database quizGym;
use quizGym;
#####用户表
create table user(
	user_id int auto_increment primary key not null,
	user_count varchar(20) not null,
	user_password varchar(20) not null,
	user_name varchar(20) not null,
	user_mailbox varchar(20) not null,
	createTime date not null,
	user_score int not null default 0,
	user_type int not null default 0
);
####题目类型表
create table types(
	types_id int auto_increment primary key not null,
	types_name varchar(16) not null
)
####题目表
create table question(
	question_id int auto_increment primary key not null,
	question_name varchar(512) not null,
	answerA varchar(256),
	answerB varchar(256),
	answerC varchar(256),
	answerD varchar(256),
	right_answer varchar(8) not null,
	reason varchar(256),
	qt_id int not null,
	constraint qt_id_fk foreign key(qt_id) references types(types_id)
);
####用户做过题目中间表
create table uq_done_middle(
	user_id int,
	question_id int,
	status int,
	primary key(user_id,question_id)
);
####用户做过套题中间表
create table ug_collect_middle(
	user_id int,
	group_id int,
	right_num int default 0,
	wrong_num int default 0	
);
###套题信息
create table group_question(
    group_id int auto_increment primary key not null,
    group_name varchar(50) not null,
    creater_name varchar(20) not null,
    create_time date not null
);
###套题中的题目
create table group_content(
	group_id int not null,
	question_id int not null
);