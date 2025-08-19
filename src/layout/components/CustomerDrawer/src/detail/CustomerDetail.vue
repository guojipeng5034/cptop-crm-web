<template>
  <div class="customer-drawer-content">
    <el-tabs v-model="tabActiveName" class="detail mt-20px" stretch @tab-click="handleTabClick">
      <!-- 1.学员详情 tab -->
      <el-tab-pane name="customer detail" class="detail-customer">
        <template #label>
          <div class="custom-tabs-label pt-1 pb-1">
            <Icon icon="fa-solid:user-graduate" />
            <span>学员详情</span>
          </div>
        </template>

        <template #default>
          <el-scrollbar max-height="calc(100vh - 180px)">
            <!-- *1 TODO封装 学员信息 Card -->
            <el-card class="customer-info">
              <el-descriptions border :column="4" label-width="95" v-loading="basicFormLoading">
                <template #title>
                  <span class="font-size-4 font-700">学员信息</span>
                </template>
                <!-- 基础信息 -->
                <el-descriptions-item label="学员信息" label-align="center">
                  <template #default>
                    <div class="student-name flex items-center">
                      <span>{{ basicFormData.name }}</span>
                      <el-button class="ml-2" type="primary" text size="small"
                        @click="editCustomer('name', { name: basicFormData.name })">变更</el-button>
                    </div>
                    <div>
                      <arco-tag :type="DICT_TYPE.STUDY_STATUS" :value="basicFormData.studyStatus" :size="'small'" />
                      <el-button class="ml-2" type="primary" text size="small"
                        v-hasPermi="['crm:customer:update:effective:status:button']"
                        @click="editCustomer('status', { studyStatus: basicFormData.studyStatus })">变更</el-button>
                    </div>
                    <div class="student-info font-size-3 c-#444">
                      <span class="student-number flex items-center">
                        <span class="m-r-1.5">学号:</span>
                        <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                          {{ basicFormData.id }}
                        </el-button>
                        <span class="divider mx-1 font-size-3.5 color-#e8e8e8" v-if="basicFormData.age">|</span>
                        <arco-tag :type="DICT_TYPE.CRM_AGE" :value="basicFormData.age" :size="'small'" />
                      </span>
                    </div>
                  </template>
                </el-descriptions-item>

                <el-descriptions-item label="推荐人" label-align="center" :align="referrerInfoEmpty ? 'center' : 'left'">
                  <template #default>
                    <div class="referrer-info" v-if="!referrerInfoEmpty">
                      <div v-if="basicFormData.referrerNum">
                        <el-tag type="success" class="mr-1">学号</el-tag>
                        <el-tooltip effect="light" content="点击复制" placement="right">
                          <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">{{
                            basicFormData.referrerNum }}</el-button>
                        </el-tooltip>
                      </div>
                      <div v-if="basicFormData.referrerName">
                        <el-tag type="success" class="mr-1">姓名</el-tag>
                        <el-tooltip effect="light" content="点击查看详情" placement="right">
                          <el-button link type="primary" @click="handleReferrerClick" class="!font-size-3 !p-0">{{
                            basicFormData.referrerName }}</el-button>
                        </el-tooltip>
                      </div>
                      <div v-if="basicFormData.referrerMentorName">
                        <el-tag type="danger" class="mr-1">Mentor</el-tag>
                        <el-text size="small">
                          {{ basicFormData.referrerMentorName }}
                        </el-text>
                      </div>
                      <div v-if="basicFormData.referrerAgencyName">
                        <el-tag type="warning" class="mr-1">代理</el-tag>
                        <el-text size="small">
                          {{ basicFormData.referrerAgencyName }}
                        </el-text>
                      </div>
                    </div>
                    <span v-else>--</span>
                  </template>
                </el-descriptions-item>

                <el-descriptions-item label="试听课" label-align="center" :align="ftlInfoEmpty ? 'center' : 'left'">
                  <template #default>
                    <div class="tester flex items-center" v-if="basicFormData.testerName">
                      <div>
                        <el-tag type="success" class="mr-1">Tester</el-tag>
                        <el-text size="small">{{ basicFormData.testerName }}</el-text>
                      </div>
                      <el-button class="ml-2" type="primary" text size="small"
                        @click="switchTesterOrCaller('Tester')">变更</el-button>
                    </div>
                    <div class="time" v-if="basicFormData.reserveFirstFtlTime">
                      <el-tag type="danger" class="mr-1">首次预约</el-tag>
                      <el-text size="small">{{
                        formatDate(basicFormData.reserveFirstFtlTime, 'YYYY-MM-DD HH:mm')
                      }}</el-text>
                    </div>
                    <div class="time" v-if="basicFormData.firstFtlTime">
                      <el-tag type="warning" class="mr-1">首次试听</el-tag>
                      <el-text size="small">
                        {{ formatDate(basicFormData.firstFtlTime, 'YYYY-MM-DD HH:mm') }}
                      </el-text>
                    </div>
                    <div class="time" v-if="basicFormData.reserveLastFtlTime">
                      <el-tag type="danger" class="mr-1">末次预约</el-tag>
                      <el-text size="small">{{
                        formatDate(basicFormData.reserveLastFtlTime, 'YYYY-MM-DD HH:mm')
                      }}</el-text>
                    </div>
                    <div class="count" v-if="basicFormData.ftlCompleteCount !== null">
                      <el-tag type="danger" class="mr-1">FTL次数</el-tag>
                      <el-tooltip effect="light" content="点击查看FTL详情" placement="top">
                        <el-button link type="primary" @click="handleFtlCompleteCountClick"
                          class="!font-size-3 !p-0 ml-2">
                          {{ getDictLabel(DICT_TYPE.CRM_CUSTOMER_FTL_NUM, basicFormData.ftlCompleteCount) }}
                        </el-button>
                      </el-tooltip>
                    </div>
                    <span v-if="ftlInfoEmpty">--</span>
                  </template>
                </el-descriptions-item>

                <el-descriptions-item label="付费" label-align="center" :align="paidInfoEmpty ? 'center' : 'left'">
                  <template #default>
                    <div class="mentor" v-if="basicFormData.mentorName">
                      <el-tag type="success" class="mr-1">Mentor</el-tag>
                      <el-text size="small">{{ basicFormData.mentorName }}</el-text>
                    </div>
                    <div class="time" v-if="basicFormData.firstPaidTime">
                      <el-tag type="danger" class="mr-1">首次付费</el-tag>
                      <el-text size="small">{{
                        formatDate(basicFormData.firstPaidTime, 'YYYY-MM-DD HH:mm')
                      }}</el-text>
                    </div>
                    <span v-if="paidInfoEmpty">--</span>
                  </template>
                </el-descriptions-item>

                <el-descriptions-item label="推荐人数" label-align="center"
                  :align="recommendedInfoEmpty ? 'center' : 'left'">
                  <template #default>
                    <div class="recommended-register" v-if="basicFormData.recommendedRegisterCount">
                      <el-tag type="success" class="mr-1">注册</el-tag>
                      <el-text size="small">
                        {{ basicFormData.recommendedRegisterCount }}
                      </el-text>
                    </div>
                    <div class="recommended-ftl" v-if="basicFormData.recommendedFtlCount">
                      <el-tag type="danger" class="mr-1">试听</el-tag>
                      <el-text size="small">
                        {{ basicFormData.recommendedFtlCount }}
                      </el-text>
                    </div>
                    <div class="referrer-paid" v-if="basicFormData.recommendedPaidCount">
                      <el-tag type="warning" class="mr-1">付费</el-tag>
                      <el-text size="small">
                        {{ basicFormData.recommendedPaidCount }}
                      </el-text>
                    </div>
                    <span v-if="recommendedInfoEmpty">--</span>
                  </template>
                </el-descriptions-item>

                <el-descriptions-item label="注册时间" label-align="center"
                  :align="basicFormData.createTime ? 'left' : 'center'">
                  {{ formatDate(basicFormData.createTime, 'YYYY-MM-DD HH:mm') }}
                  <span v-if="!basicFormData.createTime">--</span>
                </el-descriptions-item>

                <el-descriptions-item label="渠道" label-align="center"
                  :align="basicFormData.pageType || basicFormData.channelName || basicFormData.promotionBusinessLine ? 'left' : 'center'">
                  <div
                    v-if="basicFormData.pageType || basicFormData.channelName || basicFormData.promotionBusinessLine">
                    <div>
                      <el-tag type="primary" class="mr-1">渠道大类</el-tag>
                      <el-text size="small">
                        {{ getLabelByValue(basicFormData.pageType,
                          getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)) }}
                      </el-text>
                    </div>
                    <div>
                      <el-tag type="success" class="mr-1">渠道细分</el-tag>
                      <el-text size="small">{{ basicFormData.channelName }}</el-text>
                    </div>
                    <div>
                      <el-tag type="warning" class="mr-1">推广业务线</el-tag>
                      <el-text size="small">
                        {{ getLabelByValue(basicFormData.promotionBusinessLine,
                          getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES)) }}
                      </el-text>
                    </div>
                  </div>
                  <span v-else>--</span>
                </el-descriptions-item>

                <!-- <el-descriptions-item label="代理" label-align="center" :span="1"
                  :align="basicFormData.agencyName ? 'left' : 'center'">
                  {{ basicFormData.agencyName }}
                  <span v-if="!basicFormData.agencyName">--</span>
                </el-descriptions-item> -->

                <el-descriptions-item label="邮箱" label-align="center" v-if="basicFormData.mail">
                  {{ basicFormData.mail }}
                  <div v-if="basicFormData.mail">
                    <el-button size="small" class="!px-1 !h-5"
                      @click="checkFullInfo(CRM_DESENSITIZE_TYPE.MAIL, currentId)"
                      v-hasPermi="['crm:sensitize:query']">查看完整信息</el-button>
                    <el-button class="ml-2" type="primary" text size="small"
                      v-hasPermi="['crm:customer:update:effective:status:button']" @click="editCustomer('mail')">
                      变更
                    </el-button>
                  </div>
                </el-descriptions-item>

                <el-descriptions-item label="邮箱" label-align="center" v-else>
                  <template #default>
                    <div class="!mt-5px relative flex items-center flex-nowrap">
                      <el-form-item class="!mb-5px !inline-block" size="small">
                        <el-input v-model="basicInfoFormData.mail" placeholder="请输入邮箱" clearable @blur="handleMailBlur"
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
                  :align="basicFormData.deptName ? 'left' : 'center'">
                  {{ basicFormData.deptName || '--' }}
                </el-descriptions-item>

                <el-descriptions-item label="跟进状态" label-align="center" :span="1"
                  :align="basicFormData.callStatus === null ? 'center' : 'left'">
                  <span v-if="basicFormData.callStatus === null">--</span>
                  <arco-tag v-if="basicFormData.callStatus === 5 && canUpdateCallStatus" :type="DICT_TYPE.CALL_STATUS"
                    :value="basicFormData.callStatus" />
                  <el-select v-else-if="basicFormData.callStatus !== null" v-model="basicFormData.callStatus"
                    size="small" placeholder="请选择跟进状态" @change="callStatusChange">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CALL_STATUS)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-descriptions-item>

                <el-descriptions-item label="Caller" label-align="center"
                  :align="basicFormData.callerName ? 'left' : 'center'">
                  {{ basicFormData.callerName }}
                  <el-button v-if="basicFormData.callerName" class="ml-2" type="primary" text size="small"
                    @click="switchTesterOrCaller('Caller')">变更</el-button>
                  <span v-if="!basicFormData.callerName">--</span>
                </el-descriptions-item>

                <el-descriptions-item label="手机号" label-align="center">
                  <template #default>
                    <div class="relative">
                      <div class="flex items-center justify-start">
                        <arco-tag v-if="basicFormData.countryCode" :type="DICT_TYPE.TELEPHONE_CODE_TYPE"
                          :value="basicFormData.countryCode" />
                        <el-form-item v-else class="!mb-5px !inline-block" size="small">
                          <el-select v-model="basicInfoFormData.countryCode" placeholder="请填写国家码" clearable filterable
                            @change="handleCountryCodeChange" @blur="handleCountryCodeBlur" class="!w-120px">
                            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TELEPHONE_CODE_TYPE)"
                              :key="dict.value" :label="dict.label" :value="dict.value" />
                          </el-select>
                        </el-form-item>

                        <span v-if="basicFormData.phone" class="ml-5px">
                          {{ basicFormData.phone }}
                        </span>
                        <el-form-item v-else class="!mb-5px ml-5px !inline-block" size="small">
                          <el-input v-model="basicInfoFormData.phone" placeholder="请输入手机号" clearable type="tel"
                            @blur="handlePhoneBlur" @focus="handlePhoneFocus" class="!w-120px" />
                        </el-form-item>
                        <el-button v-if="
                          !basicFormData.countryCode || !basicFormData.phone
                        " size="small" class="!ml-8px !h-22px" type="primary" plain
                          @click="handleSaveBasicInfo('phone')">保存</el-button>
                      </div>
                      <!-- 查看完整信息按钮 -->
                      <div v-if="basicFormData.phone">
                        <el-button size="small" class="!px-1 !h-5"
                          @click="checkFullInfo(CRM_DESENSITIZE_TYPE.PHONE, currentId)"
                          v-hasPermi="['crm:sensitize:query']">查看完整信息</el-button>
                        <el-button class="ml-2" type="primary" text size="small"
                          :disabled="basicFormData.existQqeAccount"
                          v-hasPermi="['crm:customer:update:effective:status:button']"
                          @click="editCustomer('phone', { countryCode: basicInfoFormData.countryCode })">
                          变更
                        </el-button>
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
                  :align="basicFormData.oldStudentNumber ? 'left' : 'center'">
                  <el-tooltip effect="light" content="点击复制" placement="top">
                    <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                      {{ basicFormData.oldStudentNumber }}
                    </el-button>
                  </el-tooltip>
                  <span v-if="!basicFormData.oldStudentNumber">--</span>
                </el-descriptions-item>

                <el-descriptions-item label="所属旧站点" label-align="center"
                  :align="basicFormData.oldSiteId ? 'left' : 'center'">
                  <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="basicFormData.oldSiteId" />
                  <span v-if="!basicFormData.oldSiteId">--</span>
                </el-descriptions-item>

                <el-descriptions-item label="UID" label-align="center" :span="2"
                  :align="basicFormData.uid ? 'left' : 'center'">
                  {{ basicFormData.uid || '--' }}
                </el-descriptions-item>

                <el-descriptions-item label="固定课" label-align="center" :span="4"
                  :align="basicFormData.fixingLessonsList?.length ? 'left' : 'center'">
                  <div class="fixed-lesson" v-if="basicFormData.fixingLessonsList?.length">
                    <template v-for="item in basicFormData.fixingLessonsList" :key="item.timeFrom">
                      <span class="fixed-lesson-item">{{ jointRegularCurriculumInfo(item) }}</span>
                    </template>
                  </div>
                  <span v-else>--</span>
                </el-descriptions-item>

                <el-descriptions-item label="注册链接" label-align="center" :span="4"
                  :align="basicFormData.sourceUrl ? 'left' : 'center'">
                  {{ basicFormData.sourceUrl || '--' }}
                </el-descriptions-item>
                <!-- <el-descriptions-item label="所属地区" label-align="center" :span="4"
                  :align="basicFormData.source ? 'left' : 'center'">
                  <div>
                    <span>注册IP：</span> 
                    <acro-tag :type="DICT_TYPE.SYSTEM_AREA_TYPE" :value="basicFormData.source" />
                    <span>手机号归属地：</span> 
                    <acro-tag :type="DICT_TYPE.SYSTEM_AREA_TYPE" :value="basicFormData.source" />
                    <span>来源地区：</span> 
                    <acro-tag :type="DICT_TYPE.SYSTEM_AREA_TYPE" :value="basicFormData.source" />
                  </div>
                </el-descriptions-item> -->
              </el-descriptions>

              <!-- 折叠展开按钮 -->
              <el-divider class="!my-15px">
                <el-button type="primary" link @click="handleCustomerMore">
                  完整信息
                  <Icon icon="ep:arrow-up-bold" class="ml-0.5"
                    :class="customerDetailActiveNames ? 'arrow-down' : 'arrow-up'" />
                </el-button>
              </el-divider>

              <!-- 详细信息 -->
              <el-collapse v-model="customerDetailActiveNames" accordion class="mt--10px">
                <el-collapse-item name="customerDetailMore">
                  <template #default>
                    <el-form ref="formRef" :model="detailFormData" v-loading="customerDetailLoading" size="small">
                      <el-descriptions border :column="4" size="small" class="customer-info-detail">
                        <el-descriptions-item label="英文名" label-align="center" :span="1">
                          <el-form-item prop="englishName" class="!m-b-0">
                            <el-input v-model="detailFormData.englishName" clearable placeholder="请输入英文名" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="First Name" label-align="center" :span="1">
                          <el-form-item prop="englishName" class="!m-b-0">
                            <el-input v-model="detailFormData.firstName" clearable placeholder="请输入First Name" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="Last Name" label-align="center" :span="1">
                          <el-form-item prop="englishName" class="!m-b-0">
                            <el-input v-model="detailFormData.lastName" clearable placeholder="请输入Last Name" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="来源地区" label-align="center" :span="1">
                          <el-form-item prop="fromArea" class="!m-b-0">
                            <el-input v-model="detailFormData.fromArea" clearable placeholder="请输入来源地区" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="微信号" label-align="center" :span="1">
                          <el-form-item prop="wechat" class="!m-b-0">
                            <el-input v-model="detailFormData.wechat" clearable placeholder="请输入微信号" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="监护人" label-align="center" :span="1">
                          <el-form-item prop="parentType" class="!m-b-0">
                            <el-select v-model="detailFormData.parentType" clearable filterable placeholder="请选择或检索监护人">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PARENT_TYPE)" :key="dict.value"
                                :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="和推荐人的关系" label-align="center" :span="1">
                          <el-form-item prop="relationshipsWithFriends" class="!m-b-0">
                            <el-select v-model="detailFormData.relationshipsWithFriends" clearable filterable
                              placeholder="请选择或检索和推荐人的关系">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_RELATIONSHIP_WITH_RECOMMENDERS)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="FTL预约时间" label-align="center" :span="1">
                          <el-form-item prop="reserveDatetime" class="!m-b-0">
                            <el-date-picker v-model="detailFormData.reserveDatetime" type="datetime" clearable
                              format="YYYY-MM-DD HH:mm" value-format="x" placeholder="请选择FTL预约的时间" class="!w-100%" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="性别" label-align="center" :span="1">
                          <el-form-item prop="gender" class="!m-b-0">
                            <el-radio-group v-model="detailFormData.gender">
                              <template v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)" :key="dict.value">
                                <el-radio :label="dict.label" :value="dict.value" />
                              </template>
                            </el-radio-group>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="生日" label-align="center" :span="1">
                          <el-form-item prop="birthday" class="!m-b-0">
                            <el-date-picker v-model="detailFormData.birthday" type="date" clearable format="YYYY-MM-DD"
                              value-format="YYYY-MM-DD" placeholder="请选择生日" class="!w-100%" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="国籍" label-align="center" :span="1">
                          <el-form-item prop="nationality" class="!m-b-0">
                            <el-input v-model="detailFormData.nationality" clearable placeholder="请输入国籍" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="地址" label-align="center" :span="1">
                          <el-form-item prop="address" class="!m-b-0">
                            <el-input v-model="detailFormData.address" clearable placeholder="请输入地址" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="学校地址" label-align="center" :span="1">
                          <el-form-item prop="school" class="!m-b-0">
                            <el-input v-model="detailFormData.school" clearable placeholder="请输入学校地址" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="学员类型" label-align="center" :span="1">
                          <el-form-item prop="customerType" class="!m-b-0">
                            <el-select v-model="detailFormData.customerType" clearable filterable
                              placeholder="请选择或检索学员类型">
                              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CRM_STUDENT_TYPE)" :key="dict.value"
                                :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="职业类型" label-align="center" :span="1">
                          <el-form-item prop="professionType" class="!m-b-0">
                            <el-select v-model="detailFormData.professionType" clearable filterable multiple
                              placeholder="请选择或检索职业类型">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_TYPE_OF_PROFESSION)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="英语能力" label-align="center" :span="1">
                          <el-form-item prop="englishAbility" class="!m-b-0">
                            <el-select v-model="detailFormData.englishAbility" clearable filterable
                              placeholder="请选择或检索英语能力">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ENGLISH_ABILITY)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="父母英语能力" label-align="center" :span="1">
                          <el-form-item prop="parentEnAbility" class="!m-b-0">
                            <el-select v-model="detailFormData.parentEnAbility" clearable filterable
                              placeholder="请选择或检索父母英语能力">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ENGLISH_ABILITY)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="英语等级" label-align="center" :span="1">
                          <el-form-item prop="englishLevel" class="!m-b-0">
                            <el-select v-model="detailFormData.englishLevel" clearable filterable
                              placeholder="请选择或检索英语等级">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ENGLISH_LEVEL)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="英语阅读能力" label-align="center" :span="1">
                          <el-form-item prop="englishReading" class="!m-b-0">
                            <el-switch v-model="detailFormData.englishReading" inline-prompt :active-value="1"
                              :inactive-value="0" active-text="有" inactive-text="无" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="是否说粤语" label-align="center" :span="1">
                          <el-form-item prop="cantonese" class="!m-b-0">
                            <el-switch v-model="detailFormData.cantonese" inline-prompt :active-value="1"
                              :inactive-value="0" active-text="是" inactive-text="否" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="上课设备" label-align="center" :span="1">
                          <el-form-item prop="equipment" class="!m-b-0">
                            <el-radio-group v-model="detailFormData.equipment">
                              <template v-for="dict in getIntDictOptions(DICT_TYPE.CRM_STUDY_EQUIPMENT)"
                                :key="dict.value">
                                <el-radio :label="dict.label" :value="dict.value" class="!mr-20px" />
                              </template>
                            </el-radio-group>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="过去的学习期" label-align="center" :span="1">
                          <el-form-item prop="pastLearnPeriod" class="!m-b-0">
                            <el-select v-model="detailFormData.pastLearnPeriod" clearable filterable
                              placeholder="请选择或检索过去的学习期">
                              <el-option v-for="dict in getIntDictOptions(
                                DICT_TYPE.CRM_LEARN_ENGLISH_PERIOD
                              )" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="英语学习周期" label-align="center" :span="1">
                          <el-form-item prop="englishLearnPeriod" class="!m-b-0">
                            <el-select v-model="detailFormData.englishLearnPeriod" clearable filterable
                              placeholder="请选择或检索英语学习周期">
                              <el-option v-for="dict in getIntDictOptions(
                                DICT_TYPE.CRM_LEARN_ENGLISH_PERIOD
                              )" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="学习效果" label-align="center" :span="1">
                          <el-form-item prop="effection" class="!m-b-0">
                            <el-radio-group v-model="detailFormData.effection">
                              <template v-for="dict in getIntDictOptions(DICT_TYPE.CRM_STUDY_EFFECTION)"
                                :key="dict.value">
                                <el-radio :label="dict.label" :value="dict.value" />
                              </template>
                            </el-radio-group>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="学习频次" label-align="center" :span="1">
                          <el-form-item prop="lessonTime" class="!m-b-0">
                            <el-select v-model="detailFormData.lessonTime" clearable filterable
                              placeholder="请选择或检索学习频次">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_LESSON_TIME)" :key="dict.value"
                                :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="选择标准" label-align="center" :span="1">
                          <el-form-item prop="selectionStandard" class="!m-b-0">
                            <el-input v-model="detailFormData.selectionStandard" clearable type="textarea" :rows="2"
                              placeholder="请输入选择标准" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="学习意图" label-align="center" :span="1">
                          <el-form-item prop="purpose" class="!m-b-0">
                            <el-select v-model="detailFormData.purpose" clearable filterable multiple collapse-tags
                              collapse-tags-tooltip :max-collapse-tags="1" placeholder="请选择或检索学习意图">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PURPOSE_OF_STUDY)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="孩子的需求" label-align="center" :span="1">
                          <el-form-item prop="requireByKid" class="!m-b-0">
                            <el-input v-model="detailFormData.requireByKid" clearable type="textarea" :rows="2"
                              placeholder="请输入孩子的需求" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="注册时的需求" label-align="center" :span="4">
                          <el-form-item prop="enrollmentRequirements" class="!m-b-0">
                            <el-input v-model="detailFormData.enrollmentRequirements" clearable placeholder="请输入注册时的需求"
                              type="textarea" :rows="5" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="家长需求" label-align="center" :span="1">
                          <el-form-item prop="requireByParents" class="!m-b-0">
                            <el-input v-model="detailFormData.requireByParents" clearable type="textarea" :rows="2"
                              placeholder="请输入家长需求" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="缺点" label-align="center" :span="1">
                          <el-form-item prop="weekpoints" class="!m-b-0">
                            <el-input v-model="detailFormData.weekpoints" clearable type="textarea" :rows="2"
                              placeholder="请输入缺点" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="优点" label-align="center" :span="1">
                          <el-form-item prop="strongpoints" class="!m-b-0">
                            <el-input v-model="detailFormData.strongpoints" clearable type="textarea" :rows="2"
                              placeholder="请输入优点" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="转介绍备注" label-align="center" :span="1">
                          <el-form-item prop="recommenderRemarks" class="!m-b-0">
                            <el-input v-model="detailFormData.recommenderRemarks" clearable type="textarea" :rows="2"
                              placeholder="请输入转介绍备注" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="备注" label-align="center" :span="1">
                          <el-form-item prop="remarks" class="!m-b-0">
                            <el-input v-model="detailFormData.remarks" clearable type="textarea" :rows="2"
                              placeholder="请输入备注" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="即时通讯软件" label-align="center" :span="1">
                          <el-form-item prop="instantMessenger" class="!m-b-0">
                            <el-select v-model="detailFormData.instantMessenger" clearable filterable
                              placeholder="请选择或检索即时通讯软件">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_INSTANT_MESSENGER)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="社交软件" label-align="center" :span="1">
                          <el-form-item prop="socialSoftware" class="!m-b-0">
                            <el-select v-model="detailFormData.socialSoftware" clearable filterable
                              placeholder="请选择或检索社交软件">
                              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SOCIAL_SOFTWARE)"
                                :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="Facebook账号" label-align="center" :span="1">
                          <el-form-item prop="facebookNumber" class="!m-b-0">
                            <el-input v-model="detailFormData.facebookNumber" clearable placeholder="请输入Facebook账号" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="Skype" label-align="center" :span="1">
                          <el-form-item prop="skype" class="!m-b-0">
                            <el-input v-model="detailFormData.skype" clearable placeholder="请输入Skype" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="Whatsapp账号" label-align="center" :span="1">
                          <el-form-item prop="whatsapp" class="!m-b-0">
                            <el-input v-model="detailFormData.whatsapp" clearable placeholder="请输入Whatsapp账号" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="Line账号" label-align="center" :span="1">
                          <el-form-item prop="lineNumber" class="!m-b-0">
                            <el-input v-model="detailFormData.lineNumber" clearable placeholder="请输入Line账号" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="Http Referer" label-align="center" :span="1">
                          <el-form-item prop="httpReferer" class="!m-b-0">
                            <el-input v-model="detailFormData.httpReferer" clearable placeholder="请输入Http Referer" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="来源 IP" label-align="center" :span="1">
                          <el-form-item prop="fromIp" class="!m-b-0">
                            <el-input v-model="detailFormData.fromIp" clearable placeholder="请输入来源 IP" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="来源关键词" label-align="center" :span="1">
                          <el-form-item prop="fromKeywords" class="!m-b-0">
                            <el-input v-model="detailFormData.fromKeywords" clearable placeholder="请输入来源关键词" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="来源搜索引擎" label-align="center" :span="1">
                          <el-form-item prop="fromSearchEngine" class="!m-b-0">
                            <el-input v-model="detailFormData.fromSearchEngine" clearable placeholder="请输入来源搜索引擎" />
                          </el-form-item>
                        </el-descriptions-item>

                        <el-descriptions-item label="来源搜索引擎 ID" label-align="center" :span="1">
                          <el-form-item prop="fromSearchEngineId" class="!m-b-0">
                            <el-input v-model="detailFormData.fromSearchEngineId" clearable
                              placeholder="请输入来源搜索引擎 ID" />
                          </el-form-item>
                        </el-descriptions-item>
                        <!-- 用于占位，解决最后一个 description-item 宽度问题-->
                        <el-descriptions-item label="占位" label-align="center" v-show="false" :span="1">
                          <div>last</div>
                        </el-descriptions-item>
                      </el-descriptions>
                    </el-form>
                    <div class="detail-form-btns">
                      <el-button type="primary" size="small" plain class="!line-height-0"
                        @click="submitCustomerDetailFrom" v-hasPermi="['crm:customer-detail:update']">
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

            <!-- FTL详情 -->
            <FtlRecordDialog ref="ftlDetailDialogRef" />
            <!-- 查看完整无掩码信息 -->
            <MasklessInfoDialog ref="masklessInfoDialogRef" />
            <!-- 学员信息 卡片 -->
            <!-- <CustomerCard ref="customerCardRef" :customerId="currentId" :customer-name="currentName" /> -->
            <!-- 客户联系状态记录 卡片 -->
            <ContactStatusCard ref="contactStatusCardRef" :customer-id="currentId" />
            <!-- 微信信息 卡片 -->
            <WechatCard ref="wechatCardRef" :customer-id="currentId" />
            <!-- 课程信息 卡片 -->
            <LessonCard ref="lessonCardRef" :student-uid="currentUid" />
            <!-- 流转记录 卡片 -->
            <TransferCard ref="transferCardRef" :customer-id="currentId" />
            <!-- 课程信息 卡片 -->
            <AssessmentCard ref="assessmentCardRef" :student-uid="currentUid" />
            <!-- 留资记录 卡片 -->
            <RetentionCard ref="retentionCardRef" :customer-id="currentId" />
          </el-scrollbar>
        </template>
      </el-tab-pane>

      <!-- 2.学员账号 tab -->
      <CustomerAccountTab ref="customerAccountTabRef" :customerId="currentId" :customer-name="currentName"
        @refresh-uid="handleRefreshUid" />
      <!-- 3.订单 tab -->
      <OrderTab ref="orderTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 4.套餐 tab -->
      <PackageTab ref="packageTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 5.联系记录 tab -->
      <ContactHistoryTab ref="contactHistoryTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 6.次卡 tab -->
      <CustomerTicketTab ref="customerTicketTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 7.课时点 tab -->
      <QQEPointTab ref="QQEPointTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 8.学员券 tab -->
      <CustomerVouchersTab ref="customerVouchersTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 9.积分 tab -->
      <CustomerPointTab ref="customerPointTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 10.状态记录 tab -->
      <StudyStatusTab ref="studyStatusTabRef" :customerId="currentId" :customer-name="currentName" />
      <!-- 11.星币 tab -->
      <CustomerStarTab ref="customerStarTabRef" :customerId="currentId" :customer-name="currentName" />
    </el-tabs>
    <!-- 变更 Tester Caller 表单 -->
    <TransferLogForm ref="transferLogFormRef" @success="customerEditSuccess" />
    <!-- 编辑 Customer 表单 -->
    <CustomerEditForm ref="customerEditFormRef" @success="customerEditSuccess" />
  </div>
</template>
<script setup lang="ts">
/* utils */
import { getIntDictOptions, getStrDictOptions, DICT_TYPE, getLabelByValue, getDictLabel } from '@/utils/dict'
import { formatDate, dateObjectToStr2 } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { isEmpty } from '@/utils/is'
import { CRM_DESENSITIZE_SOURCE, CRM_DESENSITIZE_TYPE } from '@/utils/constants'
/* api */
import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'
import { CustomerDetailApi, CustomerDetailVO } from '@/api/crm/customer/detail'
/* form */
import TransferLogForm from '../TransferLogForm.vue'
import CustomerEditForm from '../CustomerEditForm.vue'
/* dialog */
import FtlRecordDialog from '@/views/crm/customer/components/FtlRecordDialog.vue'
import MasklessInfoDialog from '@/views/crm/components/MasklessInfoDialog/MasklessInfoDialog.vue'
/* card */
// import CustomerCard from './cards/CustomerCard.vue'
import WechatCard from '../cards/WechatCard.vue'
import LessonCard from '../cards/LessonCard.vue'
import TransferCard from '../cards/TransferCard.vue'
import AssessmentCard from '../cards/AssessmentCard.vue'
import RetentionCard from '../cards/RetentionCard.vue'
import ContactStatusCard from '../cards/ContactStatusCard.vue'
/* tab 栏 */
// import customerDetailTab from './CustomerDetailTab.vue'
import CustomerAccountTab from './tabs/CustomerAccountTab.vue'
import OrderTab from './tabs/OrderTab.vue'
import ContactHistoryTab from './tabs/ContactHistoryTab.vue'
import CustomerTicketTab from './tabs/CustomerTicketTab.vue'
import QQEPointTab from './tabs/QQEPointTab.vue'
import CustomerVouchersTab from './tabs/CustomerVouchersTab.vue'
import CustomerPointTab from './tabs/CustomerPointTab.vue'
import PackageTab from './tabs/PackageTab.vue'
import StudyStatusTab from './tabs/StudyStatusTab.vue'
import CustomerStarTab from './tabs/CustomerStarTab.vue'

/** 学员详情 组件 */
defineOptions({ name: 'CustomerDetail' })

/** 定义事件，用于操作成功后的回调  */
const emit = defineEmits(['addCustomerTab', 'refresh-uid', 'refresh-customer-name'])
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

/** props */
const props = defineProps({
  customerId: {
    type: Number,
    default: undefined,
    required: true
  },
  customerName: {
    type: String,
    default: undefined,
    required: true
  }
})

/** Tabs */
const tabActiveName = ref('customer detail') // tabs active name
const currentId = ref(props.customerId) // customer id
const currentName = ref(props.customerName) // customer Name
const currentUid = ref() // customer uid
const handleTabClick = (tabsPaneContext) => {
  switch (tabsPaneContext.paneName) {
    case 'customer detail':
      getCustomerBasicInfoList()
      break
    case 'account':
      customerAccountTabRef.value.getList()
      break
    case 'order':
      orderTabRef.value.getList()
      break
    case 'package':
      packageTabRef.value.resetTabActiveName()
      packageTabRef.value.getList()
      break
    case 'contact':
      contactHistoryTabRef.value.getList()
      break
    case 'ticket':
      customerTicketTabRef.value.getList()
      break
    case 'vouchers':
      customerVouchersTabRef.value.resetTabActiveName()
      customerVouchersTabRef.value.getList()
      break
    case 'qqepoint':
      QQEPointTabRef.value.getList()
      break
    case 'status':
      studyStatusTabRef.value.getList()
      break
    case 'point':
      customerPointTabRef.value.getList()
      break
    case 'coin':
      customerStarTabRef.value.getList()
      break
    default:
      break
  }
}

/* cards */
const customerCardRef = ref() // 学员信息
const wechatCardRef = ref() // 微信信息
const lessonCardRef = ref() // 课程信息
const transferCardRef = ref() // 流转记录
const assessmentCardRef = ref() // 老师评价

/* tabs */
const contactHistoryTabRef = ref() // 联系记录
const orderTabRef = ref() // 订单
const customerTicketTabRef = ref() // 次卡
const packageTabRef = ref() // 套餐
const QQEPointTabRef = ref() // 课时点
const customerVouchersTabRef = ref() // 优惠券
const customerPointTabRef = ref() // 积分
const studyStatusTabRef = ref() // 状态记录
const customerStarTabRef = ref() // 星币

/* 1.5 学员基础 卡片 todo：抽取至学员信息 卡片 */
/* 1.5.1 学员基础信息信息 */
const basicFormLoading = ref(false) // 学员基础信息 loading
// 学员基础信息 数据
const basicFormData = ref({
  id: null, // 学号
  name: '', // 学员姓名
  studyStatus: null, // 学习状态
  age: null, // 年龄
  referrerNum: null, // 推荐人学号
  referrerName: '', // 推荐人姓名
  referrerMentorName: '', // 推荐人Mentor
  referrerAgencyName: '', // 推荐代理
  testerName: '', // 试听课Tester
  reserveFirstFtlTime: null, // 首次预约试听时间
  firstFtlTime: null, // 首次试听时间
  reserveLastFtlTime: null, // 末次预约时间
  mentorName: '', // Mentor名称
  firstPaidTime: null, // 首次付费时间
  recommendedRegisterCount: null, // 推荐注册人数
  recommendedFtlCount: null, // 推荐试听人数
  recommendedPaidCount: null, // 推荐付费人数
  createTime: null, // 注册时间
  pageType: null, // 渠道大类
  channelName: '', // 渠道细分
  promotionBusinessLine: null, // 推广业务线
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
  sourceUrl: '', // 来源url
  studentUid: undefined, // 学员UID
  uid: undefined, // UID
  existQqeAccount: undefined,
  ftlCompleteCount: undefined,
})

/* 1.5.2 获取学员基础信息 */
const getCustomerBasicInfoList = async () => {
  countryCodeErrorMessage.value = ''
  phoneErrorMessage.value = ''
  mailErrorMessage.value = ''
  basicFormLoading.value = true
  try {
    const fixedLessons = await CustomerApi.getCustomerFixingLessons(currentId.value)
    const data = await CustomerApi.getCustomer(currentId.value)
    currentUid.value = data.studentUid
    currentName.value = data.name
    basicFormData.value = {
      ...data,
      fixingLessonsList: fixedLessons,
      ftlCompleteCount: data.ftlCompleteCount === null ? 0 : data.ftlCompleteCount
    }
    basicInfoFormData.value = {
      ...basicInfoFormData.value,
      id: data.id,
      countryCode: data.countryCode,
      phone: data.phone,
      mail: data.mail,
      seaType: data.seaType
    }
    // customerDetailTabRef.value.getCustomerBasicList()
  } catch (e) {
    console.log('getCustomerBasicInfoList', e)
  } finally {
    basicFormLoading.value = false
  }
}

/* 1.5.3 如果学员没有手机号、邮箱原地修改 */
const basicInfoFormData = ref({
  id: undefined,
  countryCode: undefined,
  phone: undefined,
  mail: undefined,
  seaType: undefined
})
const countryCodeErrorMessage = ref('') // 国家码校验错误信息
const phoneErrorMessage = ref('') // 手机号校验错误信息
const mailErrorMessage = ref('') // 邮箱校验错误信息

// 1.5.3.1 监听国家码变化 用于重置校验错误信息
const handleCountryCodeChange = () => {
  countryCodeErrorMessage.value = ''
}

// 1.5.3.2 监听国家码失去焦点 用于校验国家码必填
const handleCountryCodeBlur = () => {
  if (!basicInfoFormData.value.countryCode) {
    countryCodeErrorMessage.value = '国家码为必选项'
  }
}

// 1.5.3.3 监听国手机含获取焦点 用于重置校验错误信息
const handlePhoneFocus = () => {
  phoneErrorMessage.value = ''
}

// 1.5.3.4 监听手机号获取焦点 用于重置校验错误信息
const handlePhoneBlur = () => {
  if (!basicInfoFormData.value.phone) {
    phoneErrorMessage.value = '手机号为必填项'
  }
}

// 1.5.3.5 监听邮箱获取焦点 用于重置校验错误信息
const handleMailFocus = () => {
  mailErrorMessage.value = ''
}

// 1.5.3.6 监听邮箱获取焦点 用于重置校验错误信息
const handleMailBlur = () => {
  if (basicInfoFormData.value.mail) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regex.test(basicInfoFormData.value.mail)) {
      mailErrorMessage.value = '请检查邮箱格式'
    }
  }
}

/* 1.5.4 保存学员基础信息 */
const handleSaveBasicInfo = async (type) => {
  // 1.5.4.1 校验手机号和邮箱格式
  if (type === 'phone') {
    if (!basicInfoFormData.value.countryCode || !basicInfoFormData.value.phone) {
      if (!basicInfoFormData.value.countryCode) {
        countryCodeErrorMessage.value = '国家码为必选项'
      }
      if (!basicInfoFormData.value.phone) {
        phoneErrorMessage.value = '手机号为必填项'
      }
      return
    }
  } else if (type === 'mail') {
    if (!basicInfoFormData.value.mail) return
    if (basicInfoFormData.value.mail) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!regex.test(basicInfoFormData.value.mail)) {
        mailErrorMessage.value = '请检查邮箱格式'
        return
      }
    }
  }

  // 1.5.4.2 保存学员基础信息
  basicFormLoading.value = true
  try {
    await CustomerApi.updateCustomer(basicInfoFormData.value)
    message.success(t('common.updateSuccess'))
    await getCustomerBasicInfoList()
  } finally {
    basicFormLoading.value = false
  }
}

/* 1.5.5 学员基础信息空值逻辑判断 空值则显示‘--’*/
// 1.5.5.1 推荐人信息空值逻辑判断
const referrerInfoEmpty = computed(() => {
  return !basicFormData.value.referrerNum
})

// 1.5.5.2 试听课信息空值逻辑判断
const ftlInfoEmpty = computed(() => {
  return (
    !basicFormData.value.testerName &&
    !basicFormData.value.reserveFirstFtlTime &&
    !basicFormData.value.firstFtlTime &&
    basicFormData.value.ftlCompleteCount === null &&
    basicFormData.value.reserveLastFtlTime
  )
})

// 1.5.5.3 付费课信息空值逻辑判断
const paidInfoEmpty = computed(() => {
  return (!basicFormData.value.mentorName && !basicFormData.value.firstPaidTime)
})

// 1.5.5.4 推荐人数空值逻辑判断
const recommendedInfoEmpty = computed(() => {
  return (
    !basicFormData.value.recommendedRegisterCount &&
    !basicFormData.value.recommendedRegisterCount &&
    !basicFormData.value.recommendedPaidCount
  )
})

/* 1.5.6 固定课信息处理 */
const weekMap = {
  0: '每周日',
  1: '每周一',
  2: '每周二',
  3: '每周三',
  4: '每周四',
  5: '每周五',
  6: '每周六'
}
// 1.5.6.1 拼接周几 + 时间 + 固定课
const jointRegularCurriculumInfo = (curriculumInfo) => {
  if (isEmpty(curriculumInfo)) return ''
  const timeFrom = translateFixingLessonTime(curriculumInfo.timeFrom)
  const timeTo = translateFixingLessonTime(curriculumInfo.timeTo)
  return `${weekMap[curriculumInfo.dayOfWeek]} ${timeFrom} - ${timeTo}`
}

// 1.5.6.2 转换时间（小时 - 1），由于QQE返回日本时区时间，这里简单处理
const translateFixingLessonTime = (time: string) => {
  const charts = time.slice(0, 2) // 获取时间字符串前2位字符
  return time.replace(charts, (parseInt(charts) - 1).toString()) // 替换掉前2位字符，并加1
}

/* 1.6 跟进状态修改 */
/* 1.6.1 记录旧跟进状态 */
const canUpdateCallStatus = ref(false)
const oldCallStatus = ref()

/* 1.6.2 监听跟进状态 */
watch(
  () => basicFormData.value.callStatus,
  (val) => {
    if (val && val === 5) {
      canUpdateCallStatus.value = true
    }
  }
)

/* 1.6.3 修改跟进状态 */
const callStatusChange = async (val) => {
  if (val === 5) {
    if (!basicFormData.value.reserveDatetime) {
      await message.error('请先填写FTL预约时间！')
      basicFormData.value.callStatus = oldCallStatus.value
      return
    }
    try {
      await message.confirm(
        `确认修改为“${getLabelByValue(val, getIntDictOptions(DICT_TYPE.CALL_STATUS))}”状态吗？修改后不可编辑！`
      )
      basicFormData.value.callStatus = val
      oldCallStatus.value = val
      // 修改跟进状态
      await CustomerApi.updateCustomer({
        id: currentId.value,
        callStatus: basicFormData.value.callStatus
      })
      canUpdateCallStatus.value = true
      message.success('修改跟进状态成功')
    } catch (e) {
      basicFormData.value.callStatus = oldCallStatus.value
    }
  } else {
    try {
      await message.confirm(
        `确认修改为“${getLabelByValue(val, getIntDictOptions(DICT_TYPE.CALL_STATUS))}”状态吗？`
      )
      basicFormData.value.callStatus = val
      oldCallStatus.value = val
      // 修改跟进状态
      await CustomerApi.updateCustomer({
        id: currentId.value,
        callStatus: basicFormData.value.callStatus
      })
      message.success('修改跟进状态成功')
    } catch (e) {
      basicFormData.value.callStatus = oldCallStatus.value
    }
  }
}

/* 1.7 查看详情 */
/* 1.7.1 点击推荐人查看详情 */
const handleReferrerClick = () => {
  emit(
    'addCustomerTab',
    basicFormData.value.referrerNum,
    basicFormData.value.referrerName
  )
}

/* 1.7.2 点击FTL次数查看详情 */
const ftlDetailDialogRef = ref()
const handleFtlCompleteCountClick = () => {
  ftlDetailDialogRef.value.open(currentId.value)
}

/* 1.8 学员完整详细信息 */
const customerDetailLoading = ref(false) // 学员详细信息加载中
// 学员详细信息 初始化表单数据
const detailFormData = ref({
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
  englishLevel: undefined, // 英语等级
  englishReading: undefined, //英语阅读能力
  cantonese: undefined, // 是否说粤语
  equipment: undefined, // 上课设备
  pastLearnPeriod: undefined, // 过去的学习期
  englishLearnPeriod: undefined, // 英语学习周期
  effection: undefined, // 学习效果
  lessonTime: undefined, // 学习频次
  selectionStandard: undefined, // 选择标准
  purpose: [], // 学习意图
  enrollmentRequirements: undefined, // 注册时的需求
  requireByKid: undefined, // 孩子的需求
  requireByParents: undefined, // 家长需求
  weekpoints: undefined, // 缺点
  strongpoints: undefined, // 优点
  recommenderRemarks: undefined, // 转介绍备注
  remarks: undefined, // 备注
  instantMessenger: undefined, // 即时通讯工具
  socialSoftware: undefined, // 社交软件
  facebookNumber: undefined, // Facebook账号
  skype: undefined, // Skype
  whatsapp: undefined, // Whatsapp账号
  lineNumber: undefined, // Line账号
  httpReferer: undefined, // Http Referer
  fromIp: undefined, // 来源 IP
  fromKeywords: undefined, // 来源关键词
  fromSearchEngine: undefined, // 来源搜索引擎
  fromSearchEngineId: undefined // 来源搜索引擎 ID
})

const customerDetailDescription = ref({}) // 响应数据，用于表单取消修改复位数据
const customerDetailActiveNames = ref() // 控制折叠展开-

/* 1.8.1 完整信息展开/收起 */
const handleCustomerMore = async (activeName) => {
  if (!customerDetailActiveNames.value) {
    customerDetailActiveNames.value = 'customerDetailMore'
    customerDetailLoading.value = true
    try {
      const data = await CustomerDetailApi.getCustomerDetail(currentId.value)
      // 处理生日为空
      if (!isEmpty(data.birthday)) {
        data.birthday = dateObjectToStr2(data.birthday)
      }
      customerDetailDescription.value = data
      detailFormData.value = Object.assign({}, customerDetailDescription.value)
    } finally {
      customerDetailLoading.value = false
    }
  } else {
    customerDetailActiveNames.value = ''
  }
}

/* 1.8.2 完整信息提交修改 */
const submitCustomerDetailFrom = async () => {
  // 提交请求
  customerDetailLoading.value = true
  try {
    const data = detailFormData.value as unknown as CustomerDetailVO
    await CustomerDetailApi.updateCustomerDetail(data)
    message.success('修改成功')
    getCustomerBasicInfoList()
    handleCustomerMore('customerDetailMore')
  } catch (error) {
    message.error('修改失败')
  } finally {
    customerDetailLoading.value = false
  }
}

/* 1.8.3 完整信息取消修改 */
const cancelAmendCustomerDetail = () => {
  detailFormData.value = Object.assign({}, customerDetailDescription.value)
}

/* 1.9 变更学员信息 */
// 1.9.1 变更 Caller/Teseter
const transferLogFormRef = ref()
const switchTesterOrCaller = (type: string) => {
  transferLogFormRef.value.open(type, currentId.value)
}

// 1.9.2 编辑学员姓名 / 学习状态
const customerEditFormRef = ref()
const editCustomer = (field: string, data?) => {
  customerEditFormRef.value.open(field, {
    ...data,
    id: currentId.value
  })
}

// 1.9.3 完成后刷新列表
const customerEditSuccess = async () => {
  await getCustomerBasicInfoList()
  await transferCardRef.value.getList()
  emit('refresh-customer-name', currentId.value, basicFormData.value.name)
}

/* 查看未脱敏数据 */
const masklessInfoDialogRef = ref()
const checkFullInfo = (type: number, customerId: number) => {
  masklessInfoDialogRef.value.open(type, customerId, CRM_DESENSITIZE_SOURCE.CUSTOMER)
}

/* 2.学员账号tab */
const customerAccountTabRef = ref()

/* 2.1 刷新账号列表的方法 */
const refreshAccountList = async () => {
  // 调用 CustomerAccountTab 组件的 getList 方法
  await customerAccountTabRef.value.getList()
}

/* 2.2 处理来自 CustomerAccountTab 的 refresh-uid 事件 */
const handleRefreshUid = () => {
  emit('refresh-uid')
}

defineExpose({ customerEditSuccess, refreshAccountList })

onMounted(async () => {
  currentId.value = props.customerId
  currentName.value = props.customerName
  await getCustomerBasicInfoList()
  oldCallStatus.value = basicFormData.value.callStatus
})
</script>

<style lang="scss" scoped>
.customer-drawer-content {

  /* tabs label */
  .custom-tabs-label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* 更多点击时箭头方向的的改变 */
  .arrow-up {
    transform: rotate(180deg);
    transition: all 0.3s;
  }

  .arrow-down {
    transform: rotate(0);
    transition: all 0.3s;
  }

  /* 学员详情 */
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

  /* description 样式 */
  :deep(.el-descriptions) {

    /* 学员信息 header */
    .el-descriptions__header {
      margin-bottom: 10px;
    }

    .el-descriptions__cell {
      padding: 5px 11px;
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

  :deep(.el-tag) {
    height: 20px;
    line-height: 10px;
    padding: 0 3px;

    .el-tag__content {
      text-align: center;
      font-size: 10px;
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
}
</style>
