-- ----------------------------
-- Table structure for SYS_USER
-- ----------------------------
DROP TABLE "SYS_USER";
CREATE TABLE "SYS_USER" (
  "USERID" VARCHAR2(32 BYTE) NOT NULL ,
  "USERNAME" VARCHAR2(100 BYTE) ,
  "PASSWORD" VARCHAR2(100 BYTE) ,
  "NICKNAME" VARCHAR2(100 BYTE) ,
  "EMAIL" VARCHAR2(50 BYTE) ,
  "PHONE" VARCHAR2(20 BYTE) ,
  "SEX" CHAR(1 BYTE) ,
  "BIRTHDAY" DATE ,
  "IDCARD" VARCHAR2(20 BYTE) ,
  "TEL" VARCHAR2(20 BYTE) ,
  "ADDRESS" VARCHAR2(100 BYTE) ,
  "HOMETEL" VARCHAR2(20 BYTE) ,
  "USERTYPE" CHAR(3 BYTE) ,
  "UPDATETIME" DATE ,
  "DEPARTID" VARCHAR2(32 BYTE) ,
  "NOTE" VARCHAR2(1000 BYTE) ,
  "UPDATEPER" VARCHAR2(32 BYTE) ,
  "ORGANID" VARCHAR2(32 BYTE) ,
  "CHECKSTATES" CHAR(1 BYTE) ,
  "USERSTATES" CHAR(1 BYTE) ,
  "JOBTYPE" CHAR(1 BYTE) ,
  "EXECCODE" VARCHAR2(20 BYTE) 
)
TABLESPACE "VGUARD"
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;
COMMENT ON COLUMN "USERID" IS '用户id';
COMMENT ON COLUMN "USERNAME" IS '账户';
COMMENT ON COLUMN "PASSWORD" IS '密码';
COMMENT ON COLUMN "NICKNAME" IS '用户名字';
COMMENT ON COLUMN "EMAIL" IS '用户邮箱';
COMMENT ON COLUMN "PHONE" IS '移动电话';
COMMENT ON COLUMN "SEX" IS '性别';
COMMENT ON COLUMN "BIRTHDAY" IS '出生日期';
COMMENT ON COLUMN "IDCARD" IS '身份证';
COMMENT ON COLUMN "TEL" IS '办公电话';
COMMENT ON COLUMN "ADDRESS" IS '家庭住址';
COMMENT ON COLUMN "HOMETEL" IS '家庭电话';
COMMENT ON COLUMN "USERTYPE" IS '用户类型(常量定义暂定：企业：ENT，政府:GOV，系统:SYS)';
COMMENT ON COLUMN "UPDATETIME" IS '更新时间';
COMMENT ON COLUMN "DEPARTID" IS '部门id';
COMMENT ON COLUMN "NOTE" IS '备注';
COMMENT ON COLUMN "UPDATEPER" IS '更新人';
COMMENT ON COLUMN "ORGANID" IS '机构/企业id';
COMMENT ON COLUMN "CHECKSTATES" IS '审核状态';
COMMENT ON COLUMN "USERSTATES" IS '用户状态1:正常2:删除';
COMMENT ON COLUMN "JOBTYPE" IS '职务类型(1局长2科长3执法员)';
COMMENT ON COLUMN "EXECCODE" IS '执法编号';
COMMENT ON TABLE "SYS_USER" IS '系统用户';

-- ----------------------------
-- Table structure for LK_ROLE_PRIV
-- ----------------------------
DROP TABLE "LK_ROLE_PRIV";
CREATE TABLE "LK_ROLE_PRIV" (
  "CONID" VARCHAR2(32 BYTE) NOT NULL ,
  "ROLEID" VARCHAR2(32 BYTE) ,
  "PRIVID" VARCHAR2(32 BYTE) ,
  "OPERID" VARCHAR2(32 BYTE) 
)
TABLESPACE "DOUBLESAFE"
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 786432 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;
COMMENT ON COLUMN "LK_ROLE_PRIV"."CONID" IS '主键';
COMMENT ON COLUMN "LK_ROLE_PRIV"."ROLEID" IS '角色主键';
COMMENT ON COLUMN "LK_ROLE_PRIV"."PRIVID" IS '菜单主键';
COMMENT ON COLUMN "LK_ROLE_PRIV"."OPERID" IS '操作ID';
COMMENT ON TABLE "LK_ROLE_PRIV" IS '角色权限中间表';

-- ----------------------------
-- Checks structure for table LK_ROLE_PRIV
-- ----------------------------
ALTER TABLE "LK_ROLE_PRIV" ADD CONSTRAINT "SYS_C0027250" CHECK ("CONID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "LK_ROLE_PRIV" ADD CONSTRAINT "SYS_C0027251" CHECK ("CONID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;


- ----------------------------
-- Table structure for SYS_ROLE
-- ----------------------------
DROP TABLE "SYS_ROLE"; 
CREATE TABLE "SYS_ROLE" (
  "ROLEID" VARCHAR2(32 BYTE) NOT NULL ,
  "ROLENAME" VARCHAR2(50 BYTE) ,
  "NOTE" VARCHAR2(1000 BYTE) ,
  "UPDATETIME" DATE ,
  "UPDATEPER" VARCHAR2(32 BYTE) ,
  "USERTYPE" CHAR(3 BYTE) ,
  "ORGID" VARCHAR2(32 BYTE) ,
  "ISMEMBER" CHAR(1 BYTE) ,
  "USERLEVEL" CHAR(1 BYTE) 
)
TABLESPACE "DOUBLESAFE"
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;
COMMENT ON COLUMN "SYS_ROLE"."ROLEID" IS '角色id';
COMMENT ON COLUMN "SYS_ROLE"."ROLENAME" IS '角色名称';
COMMENT ON COLUMN "SYS_ROLE"."NOTE" IS '备注';
COMMENT ON COLUMN "SYS_ROLE"."UPDATETIME" IS '更新时间';
COMMENT ON COLUMN "SYS_ROLE"."UPDATEPER" IS '更新人';
COMMENT ON COLUMN "SYS_ROLE"."USERTYPE" IS '用户类型(常量定义暂定：企业：ENT，政府:GOV，系统:SYS)';
COMMENT ON COLUMN "SYS_ROLE"."ORGID" IS '机构ID';
COMMENT ON COLUMN "SYS_ROLE"."ISMEMBER" IS '是否成员单位';
COMMENT ON COLUMN "SYS_ROLE"."USERLEVEL" IS '用户级别 0:厂区;1:车间/部门; 2:班组;3:其他';
COMMENT ON TABLE "SYS_ROLE" IS '角色表';
