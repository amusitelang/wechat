import * as api from '../../api/';
import { Toast } from 'mint-ui';
import router from '../../router/index';

const teacher = {
  loading: false,
  namespaced: true,
  state: {
    dayCheckInfoList: {
      items: {
        bodyTemperature: '',
        headAndMouth: '',
        bodyCondition: '',
        feeling: '',
        entranceTime: '',
        nail: '',
      },
      memo: '宝宝安全入园啦，家长朋友请放心',
    },
    dayLunchInfoList: {
      photos: [],
      items: {
        todayLunch: [],
      },
      memo: '今天的饭菜营养美味，宝宝今天吃得可香了',
    },
    daySleepInfoList: {
      photos: [],
      items: {},
      memo: '午睡时间到了，伴随着适宜的室温，宝宝安静的睡着了',
    },
    daySummaryInfoList: {
      items: {
        bodyTemperature: '',
        feeling: '',
        leaveTime: '',
        drinkWater: '',
        shit: '',
        relationPn: '',
        relation: '',
      },
      memo: '宝宝在袋鼠麻麻又度过了难忘的一天，大家明天见啦～',
    },
    tokenTeacherInfo: {},
    tokenClassInfoList: [],
    teacherSelectedClassId: '',
    teacherSelectedChildInfo: {},
    classReadingChildList: [],
    todaySchedule: {},
    teacherFeeFollowList: [],
    evaluationList: [],
    historyReportListType: '',
  },
  mutations: {
    switchTeacherSelectedClassId(state, payload) {
      state.teacherSelectedClassId = payload;
    },
    switchHistoryReportType(state, payload) {
      state.historyReportListType = payload;
    },
  },
  actions: {
    getTokenTeacherInfo({ state }) {
      return new Promise((resolve, reject) => {
        api.getTokenTeacherInfo().then((res) => {
          state.tokenTeacherInfo = res.obj;
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTokenClassInfoList({ state }) {
      return new Promise((resolve, reject) => {
        api.getTokenClassInfoList().then((res) => {
          if (res.obj.length !== 0) {
            state.tokenClassInfoList = res.obj;
            if (state.teacherSelectedClassId === '') {
              state.teacherSelectedClassId = res.obj[0].id;
            }
          } else {
            router.replace('/teacher/noClass');
          }
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getClassReadingChildList({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getClassReadingChildList(data).then((res) => {
          state.classReadingChildList = res.obj;
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTodaySchedule({ state }) {
      return new Promise((resolve, reject) => {
        api.getTodaySchedule({
          classId: state.teacherSelectedClassId,
        }).then((res) => {
          state.todaySchedule = res.obj;
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTodayReportCount({ state }) {
      return new Promise((resolve, reject) => {
        api.getTodayReportCount({
          classId: state.teacherSelectedClassId,
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getClassHistoryReportList({ state }, queryRules) {
      return new Promise((resolve, reject) => {
        api.getClassHistoryReportList(queryRules).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTodayReportedChildList({ state }, payload) {
      return new Promise((resolve, reject) => {
        api.getTodayReportedChildList(payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    postReport({ state }, payload) {
      const data = {
        classId: state.teacherSelectedClassId,
        childId: state.teacherSelectedChildInfo.id,
      };
      Object.keys(payload).forEach((key) => {
        data[key] = payload[key];
      });
      return new Promise((resolve, reject) => {
        api.postReport(data).then((res) => {
          Toast('发送成功，1s后自动跳转页面');
          setTimeout(() => {
            router.go(-1);
          }, 1000);
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTeacherSelectedChildInfo({ state }, urlVars) {
      return new Promise((resolve, reject) => {
        api.getChildInfo(urlVars).then((res) => {
          state.teacherSelectedChildInfo = res.obj;
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 续费跟进
    getFollowList({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getFollowList(data).then((res) => {
          state.teacherFeeFollowList = res.obj;
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    postFollowAdd({ state }, data) {
      return new Promise((resolve, reject) => {
        api.postFollowAdd(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getFollowDetail({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getFollowDetail(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 个人信息修改
    postTeacherName({ state }, data) {
      return new Promise((resolve, reject) => {
        api.postTeacherName(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTeacherBirthday({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getTeacherBirthday(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    postTeacherPhone({ state }, data) {
      return new Promise((resolve, reject) => {
        api.postTeacherPhone(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 历史评分
    getScoreList({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getScoreList(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getScoreDetail({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getScoreDetail(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 我的好评
    getEvaluationList({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getEvaluationList(data).then((res) => {
          state.evaluationList = res.obj;
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getEvaluationAdd({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getEvaluationAdd(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 互动率
    getStatisticalList({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getStatisticalList({
          classId: state.teacherSelectedClassId,
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getStatisticalDetail({ state }, data) {
      return new Promise((resolve, reject) => {
        api.getStatisticalDetail(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 请假
    postLeave({ state }, data) {
      return new Promise((resolve, reject) => {
        api.postLeave(data).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
};

export default teacher;
