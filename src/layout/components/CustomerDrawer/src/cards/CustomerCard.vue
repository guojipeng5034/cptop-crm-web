<template>
  <el-card class="customer-info">
    <el-descriptions border :column="5" v-loading="customerBasicDescriptionLoading">
      <template #title>
        <span class="font-size-4 font-700">学员信息</span>
      </template>
      <!-- 基础信息 -->
      <el-descriptions-item label="学员信息" label-align="center">
        <template #default>
          <div class="student-name">
            <span>{{ customerBasicDescription.name }}</span>
            <arco-tag class="ml-1.5" :type="DICT_TYPE.STUDY_STATUS" :value="customerBasicDescription.studyStatus"
              :size="'small'" />
          </div>
          <div class="student-info font-size-3 c-#444">
            <span class="student-number flex justify-center items-center">
              <span>学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="top">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                  {{ customerBasicDescription.id }}
                </el-button>
              </el-tooltip>
            </span>
            <span class="divider mx-1 font-size-3.5 color-#e8e8e8" v-if="customerBasicDescription.age">|</span>
            <arco-tag :type="DICT_TYPE.CRM_AGE" :value="customerBasicDescription.age" />
          </div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="推荐人" label-align="center" :align="referrerInfoEmpty ? 'center' : 'left'">
        <template #default>
          <div class="referrer-number" v-if="customerBasicDescription.referrerNum">
            <el-tag type="success" class="mr-1">学号</el-tag>
            <el-tooltip content="点击复制" placement="top">
              <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                {{ customerBasicDescription.referrerNum }}
              </el-button>
            </el-tooltip>
          </div>
          <div class="referrer-mentor" v-if="customerBasicDescription.referrerMentorName">
            <el-tag type="danger" class="mr-1">Mentor</el-tag>
            <el-text size="small">
              {{ customerBasicDescription.referrerMentorName }}
            </el-text>
          </div>
          <div class="referrer-agency" v-if="customerBasicDescription.referrerAgencyName">
            <el-tag type="warning" class="mr-1">代理</el-tag>
            <el-text size="small">
              {{ customerBasicDescription.referrerAgencyName }}
            </el-text>
          </div>
          <span v-if="referrerInfoEmpty">--</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="试听课" label-align="center" :align="ftlInfoEmpty ? 'center' : 'left'">
        <template #default>
          <div class="tester" v-if="customerBasicDescription.testerName">
            <el-tag type="success" class="mr-1">Tester</el-tag>
            <el-text size="small">{{ customerBasicDescription.testerName }}</el-text>
          </div>
          <div class="time" v-if="customerBasicDescription.reserveFirstFtlTime">
            <el-tag type="danger" class="mr-1">首次预约</el-tag>
            <el-text size="small">
              {{ formatDate(customerBasicDescription.reserveFirstFtlTime, 'YYYY-MM-DD HH:mm') }}
            </el-text>
          </div>
          <div class="time" v-if="customerBasicDescription.firstFtlTime">
            <el-tag type="warning" class="mr-1">首次试听</el-tag>
            <el-text size="small">{{ formatDate(customerBasicDescription.firstFtlTime, 'YYYY-MM-DD HH:mm') }}</el-text>
          </div>
          <span v-if="ftlInfoEmpty">--</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="付费" label-align="center" :align="paidInfoEmpty ? 'center' : 'left'">
        <template #default>
          <div class="mentor" v-if="customerBasicDescription.mentorName">
            <el-tag type="success" class="mr-1">Mentor</el-tag>
            <el-text size="small">{{
              customerBasicDescription.mentorName
            }}</el-text>
          </div>
          <div class="time" v-if="customerBasicDescription.firstPaidTime">
            <el-tag type="danger" class="mr-1">首次付费</el-tag>
            <el-text size="small">{{
              formatDate(customerBasicDescription.firstPaidTime, 'YYYY-MM-DD HH:mm')
            }}</el-text>
          </div>
          <span v-if="paidInfoEmpty">--</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="推荐人数" label-align="center" :align="recommendedInfoEmpty ? 'center' : 'left'">
        <template #default>
          <div class="recommended-register" v-if="customerBasicDescription.recommendedRegisterCount">
            <el-tag type="success" class="mr-1">注册</el-tag>
            <el-text size="small">
              {{ customerBasicDescription.recommendedRegisterCount }}
            </el-text>
          </div>
          <div class="recommended-ftl" v-if="customerBasicDescription.recommendedFtlCount">
            <el-tag type="danger" class="mr-1">试听</el-tag>
            <el-text size="small">
              {{ customerBasicDescription.recommendedFtlCount }}
            </el-text>
          </div>
          <div class="referrer-paid" v-if="customerBasicDescription.recommendedPaidCount">
            <el-tag type="warning" class="mr-1">付费</el-tag>
            <el-text size="small">
              {{ customerBasicDescription.recommendedPaidCount }}
            </el-text>
          </div>
          <span v-if="recommendedInfoEmpty">--</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="注册时间" label-align="center"
        :align="customerBasicDescription.createTime ? 'left' : 'center'">
        {{ formatDate(customerBasicDescription.createTime, 'YYYY-MM-DD HH:mm') }}
        <span v-if="!customerBasicDescription.createTime">--</span>
      </el-descriptions-item>
      <el-descriptions-item label="渠道" label-align="center"
        :align="customerBasicDescription.channelName ? 'left' : 'center'">
        {{ customerBasicDescription.channelName }}
        <span v-if="!customerBasicDescription.channelName">--</span>
      </el-descriptions-item>
      <el-descriptions-item label="代理" label-align="center" :span="1"
        :align="customerBasicDescription.agencyName ? 'left' : 'center'">
        {{ customerBasicDescription.agencyName }}
        <span v-if="!customerBasicDescription.agencyName">--</span>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱" label-align="center" v-if="customerBasicDescription.mail">
        {{ customerBasicDescription.mail }}
      </el-descriptions-item>
      <el-descriptions-item label="邮箱" label-align="center" v-else>
        <template #default>
          <div class="!mt-5px relative flex items-center flex-nowrap">
            <el-form-item class="!mb-5px !inline-block" size="small">
              <el-input v-model="customerBasicInfoFormData.mail" placeholder="请输入邮箱" clearable @blur="handleMailBlur"
                @focus="handleMailFocus" />
            </el-form-item>
            <el-button size="small" class="!ml-8px !mt--1 !h-22px" type="primary" plain
              @click="handleSaveBasicInfo('mail')">保存</el-button>
            <div class="error-message absolute bottom--2 left-0">
              <span v-show="mailErrorMessage">{{ mailErrorMessage }}</span>
            </div>
          </div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="所属部门" label-align="center"
        :align="customerBasicDescription.deptName ? 'left' : 'center'">
        {{ customerBasicDescription.deptName || '--' }}
      </el-descriptions-item>
      <el-descriptions-item label="跟进状态" label-align="center" :span="1"
        :align="customerBasicDescription.callStatus === null ? 'center' : 'left'">
        <span v-if="customerBasicDescription.callStatus === null">--</span>
        <arco-tag v-if="customerBasicDescription.callStatus === 5 && canUpdateCallStatus" :type="DICT_TYPE.CALL_STATUS"
          :value="customerBasicDescription.callStatus" />
        <el-select v-else-if="customerBasicDescription.callStatus !== null"
          v-model="customerBasicDescription.callStatus" size="small" clearable placeholder="请选择跟进状态"
          @change="callStatusChange">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CALL_STATUS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item label="Caller" label-align="center"
        :align="customerBasicDescription.callerName ? 'left' : 'center'">
        {{ customerBasicDescription.callerName }}
        <span v-if="!customerBasicDescription.callerName">--</span>
      </el-descriptions-item>
      <el-descriptions-item label="手机号" label-align="center">
        <template #default>
          <div class="relative">
            <div class="flex items-center justify-start">
              <arco-tag v-if="customerBasicDescription.countryCode" :type="DICT_TYPE.TELEPHONE_CODE_TYPE"
                :value="customerBasicDescription.countryCode" />
              <el-form-item v-else class="!mb-5px !inline-block" size="small">
                <el-select v-model="customerBasicInfoFormData.countryCode" placeholder="请填写国家码" clearable filterable
                  @change="handleCountryCodeChange" @blur="handleCountryCodeBlur" class="!w-120px">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TELEPHONE_CODE_TYPE)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <span v-if="customerBasicDescription.phone" class="ml-5px">
                {{ customerBasicDescription.phone }}
              </span>
              <el-form-item v-else class="!mb-5px ml-5px !inline-block" size="small">
                <el-input v-model="customerBasicInfoFormData.phone" placeholder="请输入手机号" clearable type="tel"
                  @blur="handlePhoneBlur" @focus="handlePhoneFocus" class="!w-120px" />
              </el-form-item>
              <el-button v-if="!customerBasicDescription.countryCode || !customerBasicDescription.phone" size="small"
                class="!ml-8px !h-22px" type="primary" plain @click="handleSaveBasicInfo('phone')">保存</el-button>
            </div>
            <div class="error-message mt-2px absolute left-0.5 bottom--2 right-0">
              <span v-show="countryCodeErrorMessage" class="w-100%">
                {{ countryCodeErrorMessage }}
              </span>
              <span v-show="phoneErrorMessage" class="absolute left-32 right-0">
                {{ phoneErrorMessage }}
              </span>
            </div>
          </div>
        </template>
      </el-descriptions-item>

      <el-descriptions-item label="旧站点学号" label-align="center"
        :align="customerBasicDescription.oldStudentNumber ? 'left' : 'center'">
        <el-tooltip effect="light" content="点击复制" placement="top">
          <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">{{
            customerBasicDescription.oldStudentNumber }}</el-button>
        </el-tooltip>
        <span v-if="!customerBasicDescription.oldStudentNumber">--</span>
      </el-descriptions-item>
      <el-descriptions-item label="所属旧站点" label-align="center"
        :align="customerBasicDescription.oldSiteId ? 'left' : 'center'">
        <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="customerBasicDescription.oldSiteId" />
        <span v-if="!customerBasicDescription.oldSiteId">--</span>
      </el-descriptions-item>
      <el-descriptions-item label="固定课" label-align="center" :span="4"
        :align="customerBasicDescription.fixingLessonsList?.length ? 'left' : 'center'">
        <div class="fixed-lesson" v-if="customerBasicDescription.fixingLessonsList?.length">
          <template v-for="item in customerBasicDescription.fixingLessonsList" :key="item.timeFrom">
            <span class="fixed-lesson-item">{{ jointRegularCurriculumInfo(item) }}</span>
          </template>
        </div>
        <span v-else>--</span>
      </el-descriptions-item>
      <el-descriptions-item label="注册链接" label-align="center" :span="4"
        :align="customerBasicDescription.sourceUrl ? 'left' : 'center'">
        {{ customerBasicDescription.sourceUrl || '--' }}
      </el-descriptions-item>
      <el-descriptions-item label="UID" label-align="center" :span="1"
        :align="customerBasicDescription.studentUid ? 'left' : 'center'">
        {{ customerBasicDescription.uid || '--' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 折叠展开按钮 -->
    <el-divider class="!my-15px">
      <el-button type="primary" link @click="handleMore">
        完整信息
        <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="activeNames ? 'arrow-down' : 'arrow-up'" />
      </el-button>
    </el-divider>

    <!-- 详细信息 -->
    <el-collapse v-model="activeNames" accordion class="mt--10px">
      <el-collapse-item name="more">
        <template #default>
          <el-form ref="formRef" :model="customerDetailFormData" v-loading="customerDetailLoading" size="small">
            <el-descriptions border :column="4" size="small" class="customer-info-detail">
              <el-descriptions-item label="英文名" label-align="center">
                <el-form-item prop="englishName" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.englishName" clearable placeholder="请输入英文名" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="First Name" label-align="center">
                <el-form-item prop="englishName" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.firstName" clearable placeholder="请输入First Name" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Last Name" label-align="center">
                <el-form-item prop="englishName" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.lastName" clearable placeholder="请输入Last Name" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="来源地区" label-align="center">
                <el-form-item prop="fromArea" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.fromArea" clearable placeholder="请输入来源地区" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="微信号" label-align="center">
                <el-form-item prop="wechat" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.wechat" clearable placeholder="请输入微信号" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="监护人" label-align="center">
                <el-form-item prop="parentType" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.parentType" clearable filterable placeholder="请选择或检索监护人">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PARENT_TYPE)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="和推荐人的关系" label-align="center">
                <el-form-item prop="relationshipsWithFriends" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.relationshipsWithFriends" clearable filterable
                    placeholder="请选择或检索和推荐人的关系">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_RELATIONSHIP_WITH_RECOMMENDERS
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="FTL预约时间" label-align="center">
                <el-form-item prop="reserveDatetime" class="!m-b-0">
                  <el-date-picker v-model="customerDetailFormData.reserveDatetime" type="datetime" clearable
                    format="YYYY-MM-DD HH:mm" value-format="x" placeholder="请选择FTL预约的时间" class="!w-100%" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="性别" label-align="center">
                <el-form-item prop="gender" class="!m-b-0">
                  <el-radio-group v-model="customerDetailFormData.gender">
                    <template v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)" :key="dict.value">
                      <el-radio :label="dict.label" :value="dict.value" />
                    </template>
                  </el-radio-group>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="生日" label-align="center">
                <el-form-item prop="birthday" class="!m-b-0">
                  <el-date-picker v-model="customerDetailFormData.birthday" type="date" clearable format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="请选择生日" class="!w-100%" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="国籍" label-align="center">
                <el-form-item prop="nationality" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.nationality" clearable placeholder="请输入国籍" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="地址" label-align="center">
                <el-form-item prop="address" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.address" clearable placeholder="请输入地址" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="学校地址" label-align="center">
                <el-form-item prop="school" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.school" clearable placeholder="请输入学校地址" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="学员类型" label-align="center">
                <el-form-item prop="customerType" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.customerType" clearable filterable
                    placeholder="请选择或检索学员类型">
                    <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CRM_STUDENT_TYPE)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="职业类型" label-align="center">
                <el-form-item prop="professionType" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.professionType" clearable filterable multiple
                    placeholder="请选择或检索职业类型">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_TYPE_OF_PROFESSION
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="英语能力" label-align="center">
                <el-form-item prop="englishAbility" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.englishAbility" clearable filterable
                    placeholder="请选择或检索英语能力">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_ENGLISH_ABILITY
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="父母英语能力" label-align="center">
                <el-form-item prop="parentEnAbility" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.parentEnAbility" clearable filterable
                    placeholder="请选择或检索父母英语能力">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_ENGLISH_ABILITY
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="英语等级" label-align="center">
                <el-form-item prop="englishLevel" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.englishLevel" clearable filterable
                    placeholder="请选择或检索英语等级">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ENGLISH_LEVEL)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="英语阅读能力" label-align="center">
                <el-form-item prop="englishReading" class="!m-b-0">
                  <el-switch v-model="customerDetailFormData.englishReading" inline-prompt :active-value="1"
                    :inactive-value="0" active-text="有" inactive-text="无" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="是否说粤语" label-align="center">
                <el-form-item prop="cantonese" class="!m-b-0">
                  <el-switch v-model="customerDetailFormData.cantonese" inline-prompt :active-value="1"
                    :inactive-value="0" active-text="是" inactive-text="否" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="上课设备" label-align="center">
                <el-form-item prop="equipment" class="!m-b-0">
                  <el-radio-group v-model="customerDetailFormData.equipment">
                    <template v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_STUDY_EQUIPMENT
                    )" :key="dict.value">
                      <el-radio :label="dict.label" :value="dict.value" class="!mr-20px" />
                    </template>
                  </el-radio-group>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="过去的学习期" label-align="center">
                <el-form-item prop="pastLearnPeriod" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.pastLearnPeriod" clearable filterable
                    placeholder="请选择或检索过去的学习期">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_LEARN_ENGLISH_PERIOD
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="英语学习周期" label-align="center">
                <el-form-item prop="englishLearnPeriod" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.englishLearnPeriod" clearable filterable
                    placeholder="请选择或检索英语学习周期">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_LEARN_ENGLISH_PERIOD
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="学习效果" label-align="center">
                <el-form-item prop="effection" class="!m-b-0">
                  <el-radio-group v-model="customerDetailFormData.effection">
                    <template v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_STUDY_EFFECTION
                    )" :key="dict.value">
                      <el-radio :label="dict.label" :value="dict.value" />
                    </template>
                  </el-radio-group>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="学习频次" label-align="center">
                <el-form-item prop="lessonTime" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.lessonTime" clearable filterable placeholder="请选择或检索学习频次">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_LESSON_TIME)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="选择标准" label-align="center">
                <el-form-item prop="selectionStandard" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.selectionStandard" clearable type="textarea" :rows="2"
                    placeholder="请输入选择标准" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="学习意图" label-align="center">
                <el-form-item prop="purpose" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.purpose" clearable filterable placeholder="请选择或检索学习意图">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PURPOSE_OF_STUDY)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="注册时的需求" label-align="center">
                <el-form-item prop="enrollmentRequirements" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.enrollmentRequirements" clearable placeholder="请输入注册时的需求"
                    type="textarea" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="孩子的需求" label-align="center">
                <el-form-item prop="requireByKid" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.requireByKid" clearable type="textarea" :rows="2"
                    placeholder="请输入孩子的需求" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="家长需求" label-align="center">
                <el-form-item prop="requireByParents" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.requireByParents" clearable type="textarea" :rows="2"
                    placeholder="请输入家长需求" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="缺点" label-align="center">
                <el-form-item prop="weekpoints" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.weekpoints" clearable type="textarea" :rows="2"
                    placeholder="请输入缺点" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="优点" label-align="center">
                <el-form-item prop="strongpoints" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.strongpoints" clearable type="textarea" :rows="2"
                    placeholder="请输入优点" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="转介绍备注" label-align="center">
                <el-form-item prop="recommenderRemarks" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.recommenderRemarks" clearable type="textarea" :rows="2"
                    placeholder="请输入转介绍备注" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="备注" label-align="center">
                <el-form-item prop="remarks" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.remarks" clearable type="textarea" :rows="2"
                    placeholder="请输入备注" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="即时通讯软件" label-align="center">
                <el-form-item prop="instantMessenger" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.instantMessenger" clearable filterable
                    placeholder="请选择或检索即时通讯软件">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_INSTANT_MESSENGER
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="社交软件" label-align="center">
                <el-form-item prop="socialSoftware" class="!m-b-0">
                  <el-select v-model="customerDetailFormData.socialSoftware" clearable filterable
                    placeholder="请选择或检索社交软件">
                    <el-option v-for="dict in getIntDictOptions(
                      DICT_TYPE.CRM_SOCIAL_SOFTWARE
                    )" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Facebook账号" label-align="center">
                <el-form-item prop="facebookNumber" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.facebookNumber" clearable placeholder="请输入Facebook账号" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Skype" label-align="center">
                <el-form-item prop="skype" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.skype" clearable placeholder="请输入Skype" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Whatsapp账号" label-align="center">
                <el-form-item prop="whatsapp" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.whatsapp" clearable placeholder="请输入Whatsapp账号" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Line账号" label-align="center">
                <el-form-item prop="lineNumber" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.lineNumber" clearable placeholder="请输入Line账号" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="Http Referer" label-align="center">
                <el-form-item prop="httpReferer" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.httpReferer" clearable placeholder="请输入Http Referer" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="来源 IP" label-align="center">
                <el-form-item prop="fromIp" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.fromIp" clearable placeholder="请输入来源 IP" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="来源关键词" label-align="center">
                <el-form-item prop="fromKeywords" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.fromKeywords" clearable placeholder="请输入来源关键词" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="来源搜索引擎" label-align="center">
                <el-form-item prop="fromSearchEngine" class="!m-b-0">
                  <el-input v-model="customerDetailFormData.fromSearchEngine" clearable placeholder="请输入来源搜索引擎" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="来源搜索引擎 ID" label-align="center" class="!w-25%">
                <el-form-item prop="fromSearchEngineId" class="!m-b-0 detail-last">
                  <el-input v-model="customerDetailFormData.fromSearchEngineId" clearable placeholder="请输入来源搜索引擎 ID" />
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>
          </el-form>
          <div class="detail-form-btns">
            <el-button type="primary" size="small" plain class="!line-height-0" @click="submitCustomerDetailFrom"
              v-hasPermi="['crm:customer-detail:update']">
              提交修改
            </el-button>
            <el-button size="small" plain class="!line-height-0" @click="cancelAmendCustomerDetail"
              v-hasPermi="['crm:customer-detail:update']">
              取消修改
            </el-button>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
<script lang="ts" setup>
import { getIntDictOptions, getStrDictOptions, DICT_TYPE, getLabelByValue } from '@/utils/dict'
import { formatDate, dateObjectToStr2, disabledAfterDate } from '@/utils/formatTime'
// import { timeWithoutSecondFormat } from '@/utils/formatter'
import { CustomerDetailApi, CustomerDetailVO } from '@/api/crm/customer/detail'
import { handleCopy } from '@/utils/common'
import { CustomerApi } from '@/api/crm/customer/base'

// const currentId = ref() // 当前 customer id
const currentUid = ref() // 当前 customer uid
const currentName = ref() // 当前 customer Name

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

/* 学员基础信息 */
const customerBasicDescriptionLoading = ref(false)
const customerBasicDescription = ref({
  id: null, // 学号
  name: '', // 学员姓名
  studyStatus: null, // 学习状态
  age: null, // 年龄
  referrerNum: null, // 推荐人学号
  referrerMentorName: '', // 推荐人Mentor
  referrerAgencyName: '', // 推荐代理
  testerName: '', // 试听课Tester
  reserveFirstFtlTime: null, // 首次预约试听时间
  firstFtlTime: null, // 首次试听时间
  mentorName: '', // Mentor名称
  firstPaidTime: null, // 首次付费时间
  recommendedRegisterCount: null, // 推荐注册人数
  recommendedFtlCount: null, // 推荐试听人数
  recommendedPaidCount: null, // 推荐付费人数
  createTime: null, // 注册时间
  channelName: '', // 渠道
  agencyName: '', // 代理
  mail: '', // 邮箱
  deptName: '', // 所属部门
  callStatus: null, // 跟进状态
  callerName: '', // Caller
  countryCode: null, // 国家码
  phone: '', // 手机号
  oldStudentNumber: null, // 旧站点学号
  oldSiteId: null, // 所属旧站点
  fixingLessonsList: '', // 固定课
  sourceUrl: '', // 固定课
  studentUid: undefined,  // UID
  uid: undefined,  // UID
})

/* 如果学员没有手机号、邮箱原地修改 */
const customerBasicInfoFormData = ref({
  id: undefined,
  countryCode: undefined,
  phone: undefined,
  mail: undefined,
  seaType: undefined
})
const countryCodeErrorMessage = ref('')
const phoneErrorMessage = ref('')
const mailErrorMessage = ref('')

const handleCountryCodeChange = () => {
  countryCodeErrorMessage.value = ''
}

const handleCountryCodeBlur = () => {
  if (!customerBasicInfoFormData.value.countryCode) {
    countryCodeErrorMessage.value = '国家码为必选项'
  }
}

const handlePhoneFocus = () => {
  phoneErrorMessage.value = ''
}

const handlePhoneBlur = () => {
  if (!customerBasicInfoFormData.value.phone) {
    phoneErrorMessage.value = '手机号为必填项'
  }
}

const handleMailFocus = () => {
  mailErrorMessage.value = ''
}

const handleMailBlur = () => {
  if (customerBasicInfoFormData.value.mail) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regex.test(customerBasicInfoFormData.value.mail)) {
      mailErrorMessage.value = '请检查邮箱格式'
    }
  }
}

/* 详细信息 */
const customerDetailLoading = ref(false)
const customerDetailFormData = ref({
  englishName: undefined, // 英文名
  firstName: undefined, // firstName
  lastName: undefined, // lastName
  fromArea: undefined, // 来源地区
  wechat: undefined, // 微信号
  parentType: undefined, // 监护人
  relationshipsWithFriends: undefined, // 与推荐人关系
  reserveDatetime: undefined, // FTL预约时间
  gender: undefined, // 性别
  birthday: undefined, // 生日
  nationality: undefined, // 国籍
  address: undefined, // 地址
  school: undefined, // 学校
  customerType: undefined, // 学员类型
  professionType: undefined, // 职业类型
  englishAbility: undefined, // 英语能力
  parentEnAbility: undefined, // 父母英语能力
  englishLevel: undefined,  // 英语等级
  englishReading: undefined,  //英语阅读能力
  cantonese: undefined,  // 是否说粤语
  equipment: undefined,  // 上课设备
  pastLearnPeriod: undefined,  // 过去的学习期
  englishLearnPeriod: undefined,  // 英语学习周期
  effection: undefined,  // 学习效果
  lessonTime: undefined,  // 学习频次
  selectionStandard: undefined,  // 选择标准
  purpose: undefined, // 学习意图
  enrollmentRequirements: undefined,  // 注册时的需求
  requireByKid: undefined,  // 孩子的需求
  requireByParents: undefined,  // 家长需求
  weekpoints: undefined,  // 缺点
  strongpoints: undefined, // 优点
  recommenderRemarks: undefined,  // 转介绍备注
  remarks: undefined,  // 备注
  instantMessenger: undefined,  // 即时通讯工具
  socialSoftware: undefined, // 社交软件
  facebookNumber: undefined,  // Facebook账号
  skype: undefined, // Skype
  whatsapp: undefined,  // Whatsapp账号
  lineNumber: undefined, // Line账号
  httpReferer: undefined, // Http Referer
  fromIp: undefined,  // 来源 IP
  fromKeywords: undefined,  // 来源关键词
  fromSearchEngine: undefined, // 来源搜索引擎
  fromSearchEngineId: undefined, // 来源搜索引擎 ID
})

const props = defineProps({
  customerId: {
    type: Number,
    default: 0,
  },
})

/* 记录旧跟进状态 */
const oldCallStatus = ref()
const canUpdateCallStatus = ref(false)
watch(() => customerBasicDescription.value.callStatus, (val) => {
  if (val && val === 5) {
    canUpdateCallStatus.value = true
  }
})

/* 学员基础信息空值逻辑 */
const referrerInfoEmpty = computed(() => {
  if (
    !customerBasicDescription.value.referrerMentorName &&
    !customerBasicDescription.value.referrerAgencyName &&
    !customerBasicDescription.value.referrerNum
  ) {
    return true
  } else {
    return false
  }
})
const ftlInfoEmpty = computed(() => {
  if (
    !customerBasicDescription.value.testerName &&
    !customerBasicDescription.value.reserveFirstFtlTime &&
    !customerBasicDescription.value.firstFtlTime
  ) {
    return true
  } else {
    return false
  }
})
const paidInfoEmpty = computed(() => {
  if (!customerBasicDescription.value.mentorName && !customerBasicDescription.value.firstPaidTime) {
    return true
  } else {
    return false
  }
})

const recommendedInfoEmpty = computed(() => {
  if (
    !customerBasicDescription.value.recommendedRegisterCount &&
    !customerBasicDescription.value.recommendedRegisterCount &&
    !customerBasicDescription.value.recommendedPaidCount
  ) {
    return true
  } else {
    return false
  }
})

/* 固定课信息处理 */
const weekMap = {
  0: '每周日',
  1: '每周一',
  2: '每周二',
  3: '每周三',
  4: '每周四',
  5: '每周五',
  6: '每周六'
}
const jointRegularCurriculumInfo = (curriculumInfo) => {
  return `${weekMap[curriculumInfo.dayOfWeek]} ${curriculumInfo.timeFrom} - ${curriculumInfo.timeTo}`
}

/* 修改跟进状态 */
const callStatusChange = async (val) => {
  if (val === 5) {
    try {
      await message.confirm(`确认修改为“${getLabelByValue(val, getIntDictOptions(DICT_TYPE.CALL_STATUS))}”状态吗？修改后不可编辑！`)
      customerBasicDescription.value.callStatus = val
      oldCallStatus.value = val
      // 修改跟进状态
      await CustomerApi.updateCustomer({
        id: props.customerId,
        callStatus: customerBasicDescription.value.callStatus
      })
      canUpdateCallStatus.value = true
      message.success('修改跟进状态成功')
    } catch (e) {
      customerBasicDescription.value.callStatus = oldCallStatus.value
    }
  } else {
    try {
      await message.confirm(`确认修改为“${getLabelByValue(val, getIntDictOptions(DICT_TYPE.CALL_STATUS))}”状态吗？`)
      customerBasicDescription.value.callStatus = val
      oldCallStatus.value = val
      // 修改跟进状态
      await CustomerApi.updateCustomer({
        id: props.customerId,
        callStatus: customerBasicDescription.value.callStatus
      })
      message.success('修改跟进状态成功')
    } catch (e) {
      customerBasicDescription.value.callStatus = oldCallStatus.value
    }
  }
}

/* 展开/收起 */
const activeNames = ref('') // 控制折叠展开
const customerDetailDescription = ref({}) // 响应数据，用于表单取消修改复位数据
const handleMore = async () => {
  if (!activeNames.value) {
    activeNames.value = 'more'
    customerDetailLoading.value = true
    try {
      const data = await CustomerDetailApi.getCustomerDetail(props.customerId)
      data.birthday = dateObjectToStr2(data.birthday)
      customerDetailDescription.value = data
      customerDetailFormData.value = Object.assign({}, customerDetailDescription.value)
    } finally {
      customerDetailLoading.value = false
    }
  } else {
    activeNames.value = ''
  }
}

/* 获取学员基础信息 */
const getCustomerBasicInfoList = async () => {
  countryCodeErrorMessage.value = ''
  phoneErrorMessage.value = ''
  mailErrorMessage.value = ''
  customerBasicDescriptionLoading.value = true
  try {
    const data = await CustomerApi.getCustomer(props.customerId)
    console.log(11)
    customerBasicDescription.value = data
    currentUid.value = data.studentUid
    currentName.value = data.name
    customerBasicInfoFormData.value.id = data.id
    customerBasicInfoFormData.value.countryCode = data.countryCode
    customerBasicInfoFormData.value.phone = data.phone
    customerBasicInfoFormData.value.mail = data.mail
    customerBasicInfoFormData.value.seaType = data.seaType
    // customerDetailTabRef.value.getCustomerBasicList()
  } catch (e) {
    console.log('getCustomerBasicInfoList', e)
  } finally {
    customerBasicDescriptionLoading.value = false
  }
}
defineExpose({ weekMap, getCustomerBasicInfoList })

/* 保存基础信息 */
const handleSaveBasicInfo = async (type) => {
  if (type === 'phone') {
    if (!customerBasicInfoFormData.value.countryCode || !customerBasicInfoFormData.value.phone) {
      if (!customerBasicInfoFormData.value.countryCode) {
        countryCodeErrorMessage.value = '国家码为必选项'
      }
      if (!customerBasicInfoFormData.value.phone) {
        phoneErrorMessage.value = '手机号为必填项'
      }
      return
    }
  } else if (type === 'mail') {
    if (!customerBasicInfoFormData.value.mail) return
    if (customerBasicInfoFormData.value.mail) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!regex.test(customerBasicInfoFormData.value.mail)) {
        mailErrorMessage.value = '请检查邮箱格式'
        return
      }
    }
  }

  customerBasicDescriptionLoading.value = true
  try {
    const data = customerBasicInfoFormData.value
    await CustomerApi.updateCustomer(data)
    message.success(t('common.updateSuccess'))
    await getCustomerBasicInfoList()
  } finally {
    customerBasicDescriptionLoading.value = false
  }
}

/* 提交修改 */
const submitCustomerDetailFrom = async () => {
  // 提交请求
  customerDetailLoading.value = true
  try {
    const data = customerDetailFormData.value as unknown as CustomerDetailVO
    await CustomerDetailApi.updateCustomerDetail(data)
    message.success('修改成功')
    handleMore()
  } catch (error) {
    message.error('修改失败')
  } finally {
    customerDetailLoading.value = false
  }
}

/* 取消修改 */
const cancelAmendCustomerDetail = () => {
  customerDetailFormData.value = Object.assign({}, customerDetailDescription.value)
}
</script>
<style scoped lang="scss">
/* 更多点击时箭头方向的的改变 */
.arrow-up {
  transform: rotate(180deg);
  transition: all 0.3s;
}

.arrow-down {
  transform: rotate(0);
  transition: all 0.3s;
}

/* 学员详情 tab pane */
.detail-customer {

  /* 折叠控制按钮的居中 */
  :deep(.el-collapse) {
    --el-collapse-border-color: translate;
    border: 0px;

    .el-collapse-item__header {
      height: 0px;
      justify-content: center;

      .el-collapse-item__arrow {
        width: 0;
        color: transparent;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0 0 0;
    }

    .el-collapse-item__wrap {
      border: 0px;
    }
  }
}

/* 学员详情 */
/* description 样式 */
:deep(.el-descriptions) {

  /* 学员信息 header */
  .el-descriptions__header {
    margin-bottom: 10px;
  }

  .el-descriptions__cell {
    padding: 5px 11px;
    /* font-size: 12px; */
    /* line-height: 16px; */
  }
}

/* tab: 学员详情 */
.customer-info {

  /* 解决 clearable 撑开宽度问题 */
  :deep(.el-input__wrapper) {
    position: relative;

    .el-input__inner {
      padding-right: 18px;
    }

    .el-input__suffix {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  /* 确认修改 取消修改 居中 */
  .detail-form-btns {
    display: flex;
    justify-content: center;
    margin: 12px auto 4px;
  }
}

/* 国家码、电话号、邮箱检验信息样式 */
.error-message {
  line-height: 12px;
  font-size: 12px;
  color: var(--el-color-danger);
}

/* 固定课信息样式 */
.fixed-lesson {
  .fixed-lesson-item {
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
    font-size: 12px;
  }

  > :not(:last-child) {
    margin-right: 8px;
  }
}
</style>