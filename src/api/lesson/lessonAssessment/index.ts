import request from '@/config/axios'

// 学员课程 VO
export interface CustomerLessonVO {
  textbookId:	number // 教材id
  textbookName:	string	// 教材名称
  learnedPages:	number	// 已学页数
  totalPages:	number	// 总页数
  completedRate:	string	// 完成进度
  currentLearningFlag:	boolean // 当前所学标识
}

// 课程评价 VO
export interface LessonAssessmentVO {
  lessonId:	bigint // 	lesson id	
  startTime: string // 	开始时间
  teacherId:	bigint //	老师Id
  teacherName:	string	// 老师名称	
  attitude:	string // 	专注度： 数据字典
  difficultyMatching:	string // 	难易程度：数据字典
  courseLink:	string // 课程链接
}

export const CustomerLessonApi = {
  // 查询课程评价分页
  getLessonAssessmentPage: async (params: any) => {
    return await request.get({ url: `/lesson/lesson-assessment/pageLessonAssessment`, params })
  },

  // 查询学员学习课程
  getLearnedTextBookByStudentId: async (studentUid: string,) => {
    return await request.get({ url: `/lesson/lesson-assessment/listLearnedTextBookByStudentId?studentUid=${studentUid}` })
  },
}