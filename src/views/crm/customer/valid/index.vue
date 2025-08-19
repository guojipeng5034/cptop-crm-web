<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryformRef" inline label-width="120">
      <div class="search-form-items pos-relative">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.customerType" placeholder="类型" class="!w-80px type">
                <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
              <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
                :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
                class="!w-160px id">
                <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="跟进状态" prop="callStatus" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.callStatus" placeholder="请选择或检索跟进状态" clearable filterable multiple
                class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CALL_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.mentorId" placeholder="请检索后选择Mentor" clearable filterable remote
                :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="Caller" prop="callerId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.callerId" placeholder="请检索后选择Caller" clearable filterable remote
                :loading="queryOptions.caller.loading" :remote-method="queryOptions.caller.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.caller.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="Tester" prop="testerId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.testerId" placeholder="请检索后选择Tester" clearable filterable remote
                :loading="queryOptions.tester.loading" :remote-method="queryOptions.tester.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.tester.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="转介绍人" prop="referrerNum" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.referrerNum" placeholder="请检索后选择转介绍人" clearable filterable remote
                :loading="queryOptions.referrer.loading" :remote-method="queryOptions.referrer.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.referrer.options" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="转介绍人Mentor" prop="referrerMentorId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.referrerMentorId" placeholder="请检索后选择转介绍Mentor" clearable filterable
                remote :loading="queryOptions.referrerMentor.loading"
                :remote-method="queryOptions.referrerMentor.handleSearch" class="!w-240px">
                <el-option v-for="option in queryOptions.referrerMentor.options" :key="option.value"
                  :label="option.label" :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="旧站点学号" prop="oldStudentNumber" @keyup.enter="handleQuery">
              <el-input v-model="queryParams.oldStudentNumber" clearable placeholder="请输入旧站点学号" class="!w-240px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="所属旧站点" prop="oldSiteId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.oldSiteId" placeholder="请选择或检索所属旧站点" clearable filterable
                class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="学员状态" prop="studyStatus" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.studyStatus" placeholder="请选择或检索学员状态" clearable filterable
                class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STUDY_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="推广负责人" prop="promotionResponsibleId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.promotionResponsibleId" placeholder="请检索后选择推广负责人" clearable filterable
                remote :loading="queryOptions.promotionResponsible.loading"
                :remote-method="queryOptions.promotionResponsible.handleSearch" class="!w-240px">
                <el-option v-for="option in queryOptions.promotionResponsible.options" :key="option.value"
                  :label="option.label" :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="推广部门" prop="promotionResponsibleDeptId" @keyup.enter="handleQuery">
              <el-tree-select v-model="queryParams.promotionResponsibleDeptId" multiple filterable clearable
                :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
                show-checkbox default-expand-all placeholder="请选择推广部门" node-key="id"
                @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.promotionResponsibleDeptId)"
                class="!w-240px">
                <template #default="{ node, data }">
                  <div class="custom-tree-node flex items-center gap-1">
                    <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                    <span>{{ node.label }}</span>
                  </div>
                </template>
              </el-tree-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="推广业务线" prop="promotionBusinessLineId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.promotionBusinessLineId" clearable placeholder="请选择推广业务线"
                class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="渠道标签" prop="pageTags" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.pageTags" placeholder="请选择渠道标签" clearable filterable remote
                :loading="queryOptions.pageTags.loading" :remote-method="queryOptions.pageTags.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.pageTags.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="一级渠道" prop="pageType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.pageType" placeholder="一级渠道" clearable filterable class="!w-240px"
                @change="queryOptions.channelType.change">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="二级渠道" prop="channelLevelTwo" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.channelLevelTwo" placeholder="二级渠道" :disabled="!queryParams.pageType"
                clearable filterable class="!w-240px">
                <el-option v-for="option in queryOptions.channelLevelTwo.options" :key="option.value"
                  :label="option.label" :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="三级渠道" prop="channelLevelThree" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.channelLevelThree" placeholder="三级渠道"
                :disabled="queryParams.pageType === undefined" clearable filterable
                :remote="queryOptions.channelLevelThree.needRemote" :loading="queryOptions.channelLevelThree.loading"
                :remote-method="queryOptions.channelLevelThree.handleSearch" class="!w-240px">
                <el-option v-for="option in queryOptions.channelLevelThree.options" :key="option.value"
                  :label="option.label" :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="四级渠道" prop="adid" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.adid" placeholder="四级渠道" clearable filterable remote
                :loading="queryOptions.page.loading" :remote-method="queryOptions.page.handleSearch" class="!w-240px">
                <el-option v-for="option in queryOptions.page.options" :key="option.adid" :label="option.label"
                  :value="option.adid">
                  <div class="flex justify-between gap-4">
                    <span>{{ option.label }}</span>
                    <span style="color: var(--el-text-color-secondary); font-size: 13px;">
                      {{ getDictLabel(DICT_TYPE.CRM_CHANNEL_TYPE, option.pageType) }}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 折叠展开按钮 -->
        <el-divider class="!m-block-5px">
          <el-button type="primary" link @click="showMoreFormItems">
            更多
            <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="showMoreItems ? 'arrow-down' : 'arrow-up'" />
          </el-button>
        </el-divider>

        <el-collapse v-model="showMoreItems" accordion>
          <el-collapse-item name="more">
            <template #default>
              <el-row>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item prop="age" @keyup.enter="handleQuery">
                    <template #label>
                      <span>年龄</span>
                      <el-check-tag :checked="ageType" type="primary" @change="changeAgeType">
                        区间
                      </el-check-tag>
                    </template>
                    <div class="flex flex-nowrap">
                      <el-select v-model="queryParams.age[0]" clearable filterable placeholder="--" class="!w-110px">
                        <el-option v-for="dict in minAgeOption" :key="dict.value" :label="dict.label"
                          :value="dict.value" />
                      </el-select>
                      <div class="m-inline-2">-</div>
                      <el-select v-model="queryParams.age[1]" clearable filterable placeholder="--" :disabled="!ageType"
                        class="!w-110px">
                        <el-option v-for="dict in maxAgeOption" :key="dict.value" :label="dict.label"
                          :value="dict.value" />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="直推代理" prop="agencyId" class="agency" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.agencyType" placeholder="类型" class="!w-80px type">
                      <el-option v-for="dict in agencyTypeOption" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                    <el-select v-model="queryParams.agencyId" placeholder="请检索后选择直推代理" clearable filterable remote
                      :loading="queryOptions.agency.loading" :remote-method="queryOptions.agency.handleSearch"
                      class="!w-160px">
                      <el-option v-for="option in queryOptions.agency.options" :key="option.value" :label="option.label"
                        :value="option.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="转介绍人代理" prop="referrerAgencyId" class="referrerAgency"
                    @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.referrerAgencyType" placeholder="类型" class="!w-80px type">
                      <el-option v-for="dict in agencyTypeOption" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                    <el-select v-model="queryParams.referrerAgencyId" placeholder="请检索后选择转介绍人代理" clearable filterable
                      remote :loading="queryOptions.referrerAgency.loading"
                      :remote-method="queryOptions.referrerAgency.handleSearch" class="!w-160px">
                      <el-option v-for="option in queryOptions.referrerAgency.options" :key="option.value"
                        :label="option.label" :value="option.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="代理类型" prop="agencySource" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.agencySource" placeholder="请选择代理类型" clearable class="!w-240px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="来源地区" prop="fromArea" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" class="!w-240px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="12" :lg="16" :md="12" :sm="24" :xs="24">
                  <el-form-item label="所属部门/组" prop="deptId" class="dept" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.roleType" placeholder="类型" class="!w-130px type">
                      <el-option v-for="dict in queryOptions.roleType" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                    <el-tree-select v-model="queryParams.deptId" multiple filterable clearable
                      :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags
                      :max-collapse-tags="3" show-checkbox default-expand-all placeholder="请选择或检索所属部门或组" node-key="id"
                      @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.deptId)"
                      class="!w-520px id">
                      <template #default="{ node, data }">
                        <div class="custom-tree-node flex items-center gap-1">
                          <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                          <span>{{ node.label }}</span>
                        </div>
                      </template>
                    </el-tree-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="站点" prop="siteId" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.siteId" placeholder="请选择站点" clearable class="!w-240px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="留资时间" prop="retentionInformationTime" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.retentionInformationTime" type="daterange"
                      start-placeholder="开始时间" end-placeholder="结束时间" clearable
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledAfterDate" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="注册时间" prop="createTime" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.createTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="YYYY-MM-DD"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledAfterDate" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="首次FTL时间" prop="firstFtlTime" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.firstFtlTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledAfterDate" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="预约测试时间" prop="reserveDatetime" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.reserveDatetime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="FTL次数" prop="ftlCompleteCount" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.ftlCompleteCount" placeholder="请选择或检索FTL完成次数" clearable filterable
                      class="!w-240px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CUSTOMER_FTL_NUM)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="首次付费时间" prop="firstPaidTime" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.firstPaidTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledAfterDate" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="线索所属部门" prop="listOwnerDeptId" class="dept" @keyup.enter="handleQuery">
                    <el-tree-select v-model="queryParams.listOwnerDeptId" multiple filterable clearable
                      :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags
                      :max-collapse-tags="3" show-checkbox default-expand-all placeholder="请选择或检索线索所属部门" node-key="id"
                      @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.listOwnerDeptId)"
                      class="!w-240px">
                      <template #default="{ node, data }">
                        <div class="custom-tree-node flex items-center gap-1">
                          <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                          <span>{{ node.label }}</span>
                        </div>
                      </template>
                    </el-tree-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="线索归属顾问" prop="listOwnerId" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.listOwnerId" placeholder="请检索后选择线索归属顾问" clearable filterable remote
                      :loading="queryOptions.listOwner.loading" :remote-method="queryOptions.listOwner.handleSearch"
                      class="!w-240px">
                      <el-option v-for="option in queryOptions.listOwner.options" :key="option.value"
                        :label="option.label" :value="option.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="UID" prop="uid" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.uid" clearable placeholder="请输入学员UID" class="!w-240px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="交接时间" prop="connectTime" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.connectTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledAfterDate" class="!w-220px" />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="search-form-buttons mt-10px mb-5px">
        <el-form-item>
          <el-button @click="handleQuery" class="!w-80px" v-hasPermi="['crm:customer:common:query']">
            <Icon icon="ep:search" class="mr-5px" /> 搜索
          </el-button>
          <el-button @click="resetQuery" class="!w-80px" v-hasPermi="['crm:customer:common:query']">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>
          <el-button type="success" plain @click="handleExport" v-hasPermi="['crm:customer:common:export']"
            :loading="exportLoading" class="!w-80px">
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button type="primary" plain @click="pushMessage" v-hasPermi="['crm:wechat-message:push']">
            <Icon icon="fa-brands:pushed" class="mr-5px" /> 批量推送
          </el-button>
          <el-button type="warning" plain @click="handleTransfer" v-hasPermiAll="['crm:customer:transfer-all']">
            <Icon icon="mingcute:transfer-line" class="mr-5px" /> 批量转让
          </el-button>
          <el-button type="warning" plain @click="handleExcelTransfer" v-hasPermiAll="['crm:customer:transfer:import']">
            <Icon icon="mingcute:transfer-line" class="mr-5px" /> Excel批量转让
          </el-button>
          <el-button type="danger" plain @click="allotClue" v-hasPermi="['crm:customer:common:update_listowner']">
            <Icon icon="humbleicons:arrow-join" class="mr-5px" /> 线索分配
          </el-button>
          <el-button type="warning" plain @click="handleConnectBatch" v-hasPermi="['crm:customer:connect']">
            <Icon icon="hugeicons:connect" class="mr-5px" /> 学员交接
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border class="customer-table" ref="tableRef"
      :row-key="(row) => row.id" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="序号" align="center" width="80" fixed>
        <template #default="scope">
          {{ calculateTableOrderNum(scope.$index, queryParams.pageSize, queryParams.pageNo) }}
        </template>
      </el-table-column>
      <el-table-column label="学员信息" align="center" min-width="200" fixed>
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.id, scope.row.name)" v-truncate="10">
              {{ scope.row.name }}
            </el-button>
            <a-tag v-if="scope.row.agencyFlag === true" color="arcoblue" class="ml-5px" size="small">代理</a-tag>
          </div>
          <div class="student-info font-size-3 c-#777 m-t-1">
            <span class="student-number flex justify-center items-center">
              <span>学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3">
                  {{ scope.row.id }}
                </el-button>
              </el-tooltip>
              <span class="divider ml-1 mr-1 color-#e8e8e8" v-if="scope.row.age">|</span>
              <arco-tag v-show="scope.row.age" :type="DICT_TYPE.CRM_AGE" :value="scope.row.age" :size="'small'" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上课方式" align="center" prop="customerLessonManner" width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CUSTOMER_LESSON_MANNER" :value="scope.row.customerLessonManner" />
        </template>
      </el-table-column>

      <el-table-column label="学员状态" align="center" prop="studyStatus" width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.STUDY_STATUS" :value="scope.row.studyStatus" />
        </template>
      </el-table-column>

      <el-table-column label="跟进状态" align="center" prop="callStatus" width="140" sortable="custom">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CALL_STATUS" :value="scope.row.callStatus" />
        </template>
      </el-table-column>

      <el-table-column label="手机号码" align="center" prop="phone" width="120" />

      <el-table-column label="当前年龄" align="center" width="100">
        <template #default="scope">
          {{ getCurrentAge(scope.row.age, scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="Caller" align="center" prop="callerName" min-width="90" />
      <el-table-column label="留资时间（末次）" align="center" prop="retentionInformationTime" width="150"
        :formatter="dateFormatterYMDHm" sortable="custom" />
      <el-table-column label="注册时间" align="center" prop="createTime" width="110" :formatter="dateFormatterYMDHm" />
      <el-table-column label="完课率" align="center" prop="classRate" width="100" sortable="custom">
        <template #default="scope">
          <el-progress type="circle" :percentage="scope.row.classRate" :color="[
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#6f7ad3', percentage: 60 },
            { color: '#1989fa', percentage: 80 },
            { color: '#5cb87a', percentage: 100 }
          ]" />
        </template>
      </el-table-column>

      <el-table-column label="试听课" align="center">
        <el-table-column prop="reserveFirstFtlTime" label="首次预约" align="center" width="110"
          :formatter="dateFormatterYMDHm" sortable="custom" />
        <el-table-column prop="firstFtlTime" label="首次试听" align="center" width="110" :formatter="dateFormatterYMDHm"
          sortable="custom" />
        <el-table-column prop="reserveDatetime" label="预约测试时间" align="center" width="130"
          :formatter="dateFormatterYMDHm" sortable="custom" />
        <el-table-column prop="testerName" label="Tester" align="center" min-width="90" />
        <el-table-column prop="ftlCompleteCount" label="FTL次数" align="center" width="90" sortable="custom">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CRM_CUSTOMER_FTL_NUM"
              :value="scope.row.ftlCompleteCount === null ? 0 : scope.row.ftlCompleteCount" />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="付费" align="center">
        <el-table-column prop="firstPaidTime" label="首次付费" align="center" width="110" :formatter="dateFormatterYMDHm"
          sortable="custom" />
        <el-table-column prop="mentorName" label="Mentor" align="center" min-width="90" />
        <el-table-column label="交接时间" align="center" prop="connectTime" width="150" :formatter="dateFormatterYMDHm"
          sortable="custom" />
      </el-table-column>

      <el-table-column label="推荐人数" align="center">
        <el-table-column prop="recommendedRegisterCount" label="注册" align="center" width="65" sortable="custom" />
        <el-table-column prop="recommendedFtlCount" label="试听" align="center" width="65" sortable="custom" />
        <el-table-column prop="recommendedPaidCount" label="付费" align="center" width="65" sortable="custom" />
      </el-table-column>

      <el-table-column label="代理信息" align="center" width="200">
        <template #default="scope">
          <div v-if="scope.row.agencyCustomerId && scope.row.agencyCustomerName">
            <div class="agency-name flex items-center ml-2">
              <el-tag class="mr-2 !w-45px" type="primary">学员名</el-tag>
              <el-button link type="primary" size="small"
                @click="handleOpenDrawer(scope.row.agencyCustomerId, scope.row.agencyCustomerName)">
                {{ scope.row.agencyCustomerName }}
              </el-button>
            </div>
            <div class="agency-id flex items-center ml-2 mt-1">
              <el-tag class="mr-2 !w-45px" type="success">学号</el-tag>
              <el-tooltip effect="light" content="点击复制" placement="top">
                <el-button link type="success" size="small" @click="handleCopy">
                  {{ scope.row.agencyCustomerId }}
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="agency-info flex items-center ml-2 mt-1" v-if="scope.row.agencyId && scope.row.agencyName">
            <el-tag class="mr-2 !w-45px" type="warning">代理</el-tag>
            <el-button link type="warning" size="small" @click="toAgencyList(scope.row.agencyId, scope.row.agencyName)">
              {{ scope.row.agencyName }}
            </el-button>
          </div>
          <div
            v-if="!((scope.row.agencyCustomerId && scope.row.agencyCustomerName) || (scope.row.agencyId && scope.row.agencyName))">
            -
          </div>
        </template>
      </el-table-column>

      <el-table-column label="转介绍信息" align="center" min-width="220">
        <template #default="scope">
          <div v-if="scope.row.referrerNum && scope.row.referrerName">
            <div class="referrer-number flex items-center ml-2">
              <el-tag class="mr-2 !w-45px" type="primary">学号</el-tag>
              <el-tooltip effect="light" content="点击复制" placement="top">
                <el-button link type="primary" size="small" @click="handleCopy">{{ scope.row.referrerNum }}</el-button>
              </el-tooltip>
            </div>
            <div class="referrer-name flex items-center ml-2 mt-1">
              <el-tag class="mr-2 !w-45px" type="success">姓名</el-tag>
              <el-button link type="primary" size="small" v-truncate="10"
                @click="handleOpenDrawer(scope.row.referrerNum, scope.row.referrerName)">{{ scope.row.referrerName }}
              </el-button>
            </div>
          </div>
          <div class="referrer-mentor flex items-center ml-2 mt-1" v-if="scope.row.referrerMentorName">
            <el-tag class="mr-2 !w-45px" type="danger">Mentor</el-tag>
            <span class="font-size-3">{{ scope.row.referrerMentorName }}</span>
          </div>
          <div class="referrer-mentor flex items-center ml-2 mt-1"
            v-if="scope.row.referrerAgencyId && scope.row.referrerAgencyName">
            <el-tag class="mr-2 !w-45px" type="warning">代理</el-tag>
            <el-button link type="warning" size="small"
              @click="toAgencyList(scope.row.referrerAgencyId, scope.row.referrerAgencyName)">
              {{ scope.row.referrerAgencyName }}
            </el-button>
          </div>
          <div
            v-if="!((scope.row.referrerNum && scope.row.referrerName) || scope.row.referrerMentorName || (scope.row.referrerAgencyId && scope.row.referrerAgencyName))">
            -
          </div>
        </template>
      </el-table-column>

      <el-table-column label="渠道细分" align="center" prop="channelName" width="240" />

      <el-table-column label="来源地区" align="center" prop="fromArea" min-width="140" sortable="custom" />

      <el-table-column label="部门/组" align="center" prop="deptName" width="160" />

      <el-table-column label="站点" align="center" prop="siteId" width="150">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="scope.row.siteId" />
        </template>
      </el-table-column>

      <el-table-column label="线索" align="center">
        <el-table-column label="归属部门" align="center" prop="listOwnerDeptName" width="160" />
        <el-table-column label="归属顾问" align="center" prop="listOwnerName" width="160" />
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" fixed="right">
        <template #default="scope">
          <el-button v-hasPermi="['crm:customer:common:update']" link type="primary"
            @click="openForm('update', scope.row.id)" class="!font-size-3">
            编辑
          </el-button>
          <el-button link type="warning" @click="goToQQE(scope.row.studentUid)" class="!font-size-3 !ml-5px"
            v-hasPermi="['crm:customer:get:qqe:button']">
            QQE
          </el-button>
          <el-button link @click="aliyunCall(scope.row.id)" class="!font-size-3 !ml-5px "
            v-hasPermi="['crm:customer:makecall']">
            外呼
          </el-button>
          <el-button v-show="scope.row.studyStatus === 1" link @click="handleConnect(scope.row.id)"
            class="!font-size-3 !ml-5px !text-#1abc9c" v-hasPermi="['crm:customer:connect']">
            交接
          </el-button>
          <el-dropdown @command="(command) => handleCommand(command, scope.row)" class="!pl-5px">
            <el-button type="success" link class="!font-size-3">更多
              <Icon icon="ep:d-arrow-right" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="getScript">
                  <Icon icon="ep:chat-line-square" />话术
                </el-dropdown-item>
                <el-dropdown-item v-show="checkPermi(['crm:poster-setting:query'])" command="getPoster">
                  <Icon icon="ep:postcard" />海报
                </el-dropdown-item>
                <el-dropdown-item v-show="checkPermi(['crm:points-store:query'])" command="goPointMall">
                  <Icon icon="solar:database-outline" />积分商城
                </el-dropdown-item>
                <el-dropdown-item command="goToMonthReport">
                  <Icon icon="mdi:calendar-month-outline" />月度报告
                </el-dropdown-item>
                <el-dropdown-item command="goToStudentPage">
                  <Icon icon="icon-park-outline:classroom" />学员页面
                </el-dropdown-item>
                <el-dropdown-item command="openDrawer">
                  <Icon icon="bx:bxs-user-detail" />详情
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      :pageSizes="[10, 20, 30, 50, 100, 500]" @pagination="getList" />
  </ContentWrap>

  <!-- 学员 表单 -->
  <CustomerForm ref="customerFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 批量转让 表单 -->
  <TransferLogForm ref="transferFormRef" @success="getList" @cancel-selection="cancelSelection" />
  <!-- Excel批量转让 表单 -->
  <BatchTransferCustomerForm ref="excelTransferFormRef" @success="getList" />
  <!-- 海报 表单 -->
  <GetPosterForm ref="getPosteRef" @success="getList" />
  <!-- 线索分配 表单 -->
  <AllotClueForm ref="allotClueFormRef" @success="getList" @cancel-selection="cancelSelection" />
</template>
<script setup lang="ts">
import router from '@/router'
import {
  DICT_TYPE, getIntDictOptions, getStrDictOptions, customerTypeOption, agencyTypeOption, getDictLabel,
  handleRemoteCustomerOptions, handleRemoteUserOptions, handleRemotePageOptions, handleRemotePageTagOptions,
  handleRemoteAgencyOptions, handleRemoteChannelActivityOptions
} from '@/utils/dict'
import { handleCopy } from '@/utils/common'
import { disabledAfterDate, dateFormatterYMDHm } from '@/utils/formatTime'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { handleSortfields, calculateTableOrderNum } from '@/utils/table'
import { goToQQE, goToStudentPage, goToMonthReport, goToPointMall } from '@/utils/navigation'
import { checkPermi } from '@/utils/permission'
import { useMessageStore } from '@/store/modules/message'
import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'
import { CustomerAccountApi } from '@/api/crm/customer/account'
import * as DeptApi from '@/api/system/dept'
import { cccApi } from '@/api/crm/ccc/makecall'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import CustomerForm from './CustomerForm.vue'
import GetPosterForm from '@/views/crm/customer/components/GetPosterForm.vue'
import TransferLogForm from '@/views/crm/customer/transfer/TransferLogForm.vue'
import AllotClueForm from '@/views/crm/customer/components/AllotClueForm.vue'
import BatchTransferCustomerForm from '@/views/crm/customer/transfer/BatchTransferCustomerForm.vue'

/** 有效学员 */
defineOptions({ name: 'Valid' })

/** 常量 */
/* 可选择的最大学员数量 */
const MAX_SELECT_CUSTOMER_NUM = 500 // 最多可选 500

/* 配置项 */
const message = useMessage() // 消息弹窗
const messageStore = useMessageStore()
const loading = ref(true) // 列表的加载中
const list = ref<CustomerVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryformRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined,// 学员
  studyStatus: undefined,
  callStatus: undefined,
  mentorId: undefined,
  callerId: undefined,
  testerId: undefined,
  referrerNum: undefined,
  referrerMentorId: undefined,
  oldStudentNumber: undefined,
  oldSiteId: undefined,
  promotionResponsibleId: undefined, // 推广负责人
  promotionResponsibleDeptId: [], // 推广部门
  promotionBusinessLineId: undefined, // 推广业务线
  pageTags: undefined, // 渠道标签
  pageType: undefined, // 一级渠道
  channelLevelTwo: undefined, // 二级渠道
  channelLevelThree: undefined, // 三级渠道
  adid: undefined, // 四级渠道
  channelName: undefined,
  registerIp: undefined,
  phoneSource: undefined,
  // 更多
  age: [],
  roleType: 'Mentor', // 所属部门/组类型
  deptId: [], // 所属部门/组
  siteId: undefined, // 站点
  agencyType: 1, // 直推代理类型
  agencyId: undefined, // 直推代理
  referrerAgencyType: 1, // 转介绍人代理类型
  referrerAgencyId: undefined, // 转介绍人代理
  agencySource: undefined,
  retentionInformationTime: [],
  createTime: [],
  firstFtlTime: [],
  reserveDatetime: [],
  ftlCompleteCount: undefined,
  firstPaidTime: [],
  fromArea: undefined,
  socialSoftware: undefined,
  listOwnerDeptId: [],
  listOwnerId: undefined,
  uid: undefined,
  connectTime: [], // 交接时间

  // 排序
  orderBy: ['']
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  caller: useRemoteSearch(handleRemoteUserOptions),
  tester: useRemoteSearch(handleRemoteUserOptions),
  referrer: useRemoteSearch(handleRemoteCustomerOptions),
  referrerMentor: useRemoteSearch(handleRemoteUserOptions),
  promotionResponsible: useRemoteSearch(handleRemoteUserOptions),
  pageTags: useRemoteSearch(handleRemotePageTagOptions),
  channelType: {
    change: () => {
      queryParams.channelLevelTwo = undefined
      queryParams.channelLevelThree = undefined
    },
  },
  channelActivity: useRemoteSearch(handleRemoteChannelActivityOptions, {
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
  }),
  channelAgency: useRemoteSearch(handleRemoteAgencyOptions, {
    type: 2,
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
  }),
  channelLevelTwo: {
    options: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return getIntDictOptions(DICT_TYPE.CRM_ACTIVITY_TYPE)
        case 2:
          return getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM).filter(item => item.value !== 0)
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_CHANNELS)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_SOURCE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_NEW_MEDIA_BUSINESS)
      }
    }),
  },
  channelLevelThree: {
    options: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return queryOptions.channelActivity.options
        case 2:
          return queryOptions.channelAgency.options
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_REGISTER_TYPE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)
      }
    }),
    loading: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return queryOptions.channelActivity.loading
        case 2:
          return queryOptions.channelAgency.loading
      }
    }),
    handleSearch: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return queryOptions.channelActivity.handleSearch
        case 2:
          return queryOptions.channelAgency.handleSearch
      }
    }),
    needRemote: computed(() => queryParams.pageType === 1 || queryParams.pageType === 2)
  },
  page: useRemoteSearch(handleRemotePageOptions, {
    channelType: toRef(queryParams, 'pageType'),
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
    channelLevelThree: toRef(queryParams, 'channelLevelThree'),
  }),
  agency: useRemoteSearch(handleRemoteAgencyOptions, {
    agencyType: toRef(queryParams, 'agencyType'),
  }),
  referrerAgency: useRemoteSearch(handleRemoteAgencyOptions, {
    referrerAgencyType: toRef(queryParams, 'referrerAgencyType'),
  }),
  roleType: getStrDictOptions(DICT_TYPE.DEPT_SEARCH_ROLE_TYPE).filter(item =>
    item.value === 'Mentor'
    || item.value === 'Tester'
    || item.value === 'Caller'
    || item.value === 'ReferrerMentor'),
  listOwner: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })
watch(() => queryParams.agencyType, () => { queryParams.agencyId = undefined })
watch(() => queryParams.referrerAgencyType, () => { queryParams.referrerAgencyId = undefined })

// 9.age
const ageOptions = ref(getIntDictOptions(DICT_TYPE.CRM_AGE))
const fixedAgeOptions = ref([...ageOptions.value]) // 固定副本
const ageType = ref(false)
// 计算可选的最小年龄范围
const minAgeOption = computed(() => {
  return ageType.value
    ? fixedAgeOptions.value.filter(item => !queryParams.age[1] || item.value <= queryParams.age[1])
    : fixedAgeOptions.value
})

// 计算可选的最大年龄范围
const maxAgeOption = computed(() => {
  return ageType.value
    ? fixedAgeOptions.value.filter(item => !queryParams.age[0] || item.value >= queryParams.age[0])
    : fixedAgeOptions.value
})

const changeAgeType = (status) => {
  ageType.value = status
  if (!status) {
    // 关闭区间模式
    queryParams.age[1] = null
  } else {
    // 开启区间模式
    if (!queryParams.age[0]) queryParams.age[0] = ageOptions.value[0]?.value || 1
    if (!queryParams.age[1]) queryParams.age[1] = ageOptions.value[ageOptions.value.length - 1]?.value || 99
  }
}

const checkAgeType = () => {
  // 开启区间模式、年龄不为空
  if (ageType.value && (queryParams.age[0] && queryParams.age[1])) {
    if (!queryParams.age[0]) queryParams.age[0] = ageOptions.value[0]?.value || 1
    if (!queryParams.age[1]) queryParams.age[1] = ageOptions.value[ageOptions.value.length - 1]?.value || 99
  } else {
    queryParams.age[1] = queryParams.age[0]
  }
}

/* 当前年龄 */
const getCurrentAge = (age, time) => {
  const currentAge = age + (new Date().getFullYear() - new Date(time).getFullYear())
  if (!age) return '-'
  if (currentAge < 18) {
    return currentAge + '岁'
  } else {
    return '成人'
  }
}

/* 展示更多搜索条件 */
const showMoreItems = ref('')
const showMoreFormItems = () => {
  if (!showMoreItems.value) {
    showMoreItems.value = 'more'
  } else {
    showMoreItems.value = ''
  }
}

/* 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/* 重置按钮操作 */
const resetQuery = () => {
  queryformRef.value.resetFields()
  handleQuery()

  // 清除从router带来的参数
  clearRouterQuery()
}

/* 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CustomerApi.exportCustomer(queryParams)
    download.excel(data, '有效学员.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 批量转让 */
const transferFormRef = ref()
const handleTransfer = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行操作')
    return
  }
  transferFormRef.value.open('create', multipleSelection.value)
}

/* Excel 批量转让 */
const excelTransferFormRef = ref()
const handleExcelTransfer = () => {
  excelTransferFormRef.value.open()
}

/* 列表选中状态变化 */
const multipleSelection = ref([])
const multiplePageData = ref({ list: [], total: 0 })

/* 多选 */
const tableRef = ref()
// 选中变化
const handleSelectionChange = (val) => {
  if (val.length > MAX_SELECT_CUSTOMER_NUM) {
    message.warning(`最多可选择${MAX_SELECT_CUSTOMER_NUM}个学员进行操作`)
    // 获取多余的行    
    const superfluousRow = val.slice(MAX_SELECT_CUSTOMER_NUM, val.length)
    // 调用 toggleRowSelection 取消勾选
    superfluousRow.forEach(item => {
      tableRef.value.toggleRowSelection(item, false)
    })
    return
  }
  multipleSelection.value = val.map((item) => item.id)
  multiplePageData.value = {
    list: val.map((item) => ({
      customerId: item.id,
      customerName: item.name,
      studyStatus: item.studyStatus
    })),
    total: val.length
  }
}
// 取消多选
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/* 批量推送 */
const pushMessage = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行推送')
    return
  }
  messageStore.setType('create')
  messageStore.setLimit(-1)
  messageStore.setIds(multipleSelection.value)
  messageStore.setPageData(multiplePageData.value)
  router.push({ name: 'MessageForm' })
}

/* 线索分配 */
const allotClueFormRef = ref()
const allotClue = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行分配')
    return
  }
  allotClueFormRef.value.open(multipleSelection.value)
}

/* 单学员交接 */
const handleConnect = async (customerId: number) => {
  await ElMessageBox.confirm(`请确认是否交接，交接后学员的Mentor将重新自动分配。`, '交接学员', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    await CustomerApi.handleValidCustomerConnect(customerId)
    message.success('交接成功')
    getList()
  })
}

/* 多学员交接 */
const handleConnectBatch = async () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行交接')
    return
  }
  const hasNoValid = multiplePageData.value.list.some(item => item.studyStatus !== 1)
  if (hasNoValid) {
    message.warning('请选择有效学员交接')
    return
  }
  await ElMessageBox.confirm(`已选择 ${multipleSelection.value.length} 个学员，请确认是否交接，交接后学员的Mentor将重新自动分配。`, '交接学员', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    await CustomerApi.handleValidCustomerConnectBatch({ customerIds: multipleSelection.value })
    message.success('交接成功')
    cancelSelection()
    getList()
  })
}

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/* 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    checkAgeType()
    const data = await CustomerApi.getCustomerPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/* 打开抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  name = name || '未命名'
  CustomerDrawerRef.value.openDrawer(id, name)
}

/* 编辑 */
const customerFormRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  customerFormRef.value.open(type, id, name)
}

/* 查看代理列表 */
const toAgencyList = (id: number, name: string) => {
  router.push({
    name: 'Agency',
    query: {
      agencyId: id,
      agencyName: name,
    }
  })
}

/* 一键外呼 */
const aliyunCall = async (customerId: number) => {
  try {
    await message.confirm(`确认要外呼该学员吗?`)
  } catch {
    return
  }
  try {
    // 发起外呼
    await cccApi.makeCall({ customerId })
    message.success('外呼成功')
  } catch {
    message.error('外呼失败')
  }
}

/* 话术 */
const getScript = (row) => {
  message.notify('该功能暂未开放')
  console.log('get script' + row.id)
}

/* 海报 */
const getPosteRef = ref()
const getPoster = (row) => {
  getPosteRef.value.open(row.id, row.uid, row.agencyFlag, null, row.name)
}

/** 操作分发 */
const handleCommand = (command: string, row) => {
  switch (command) {
    case 'getScript':
      getScript(row)
      break
    case 'getPoster':
      getPoster(row)
      break
    case 'goPointMall':
      goToPointMall(row.studentUid)
      break
    case 'goToMonthReport':
      goToMonthReport(row.studentUid)
      break
    case 'goToStudentPage':
      goToStudentPage(row.studentUid)
      break
    case 'openDrawer':
      handleOpenDrawer(row.id, row.name)
    default:
      break
  }
}

/* 清除 router.query */
const clearRouterQuery = () => {
  router.replace({
    query: {}
  })
}

/* 七陌 内嵌 CRM 学员列表 */
const query = new URLSearchParams(location.search) // 获取 url 参数
const handleQimo = async () => {
  if (query.get('studentUid')) {
    try {
      const studentUid = query.get('studentUid')
      const { id, name } = await CustomerAccountApi.getCustomerByStudentUid(studentUid)
      if (id) {
        const customerId = id + '' // 转为 string
        await queryOptions.customer.handleSearch(customerId)
        // 根据 customerId 查询列表
        queryParams.customerId = id
        handleQuery()
      } else {
        // 清除 url 中的 studentUid 参数
        clearRouterQuery()
        // 提示 用户
        message.warning('未找到该学员')
      }
    } catch (error) {
      // 清除 url 中的 studentUid 参数
      clearRouterQuery()
      // 提示 用户
      message.warning('未找到该学员')
    }
  }
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  handleQimo()
  getList()
})

onUnmounted(() => {
  clearRouterQuery()
})
</script>
<style lang="scss" scoped>
/* content wrap */
:deep(.el-card__body) {
  padding: 10px 15px;
}

/* Search Form 部分样式 */
.search-form {
  .search-form-items {

    /* 减少表单元素下外边距 */
    .el-form-item {
      margin-bottom: 10px;
    }

    /* 控制 search form label 分散对齐 */
    :deep(.el-form-item label:after) {
      content: '';
      width: 100%;
    }

    :deep(.el-form-item__label) {
      display: inline-block;
      text-align: justify;
      text-align-last: justify;
      word-break: break-all;
    }

    .font-size-3 :deep(.el-form-item__label) {
      font-size: 12px;
    }

    /* 折叠 title 样式 */
    :deep(.el-form-item) {
      margin-right: 20px;
    }

    :deep(.el-collapse) {
      --el-collapse-border-color: translate;
      border: 0px;

      .el-collapse-item__header {
        height: 1px;

        .el-collapse-item__arrow {
          width: 0;
          /* margin: 0 8px; 居中显示关键 */
        }
      }

      .el-collapse-item__content {
        padding: 10px 0 0 0;
      }

      .el-collapse-item__wrap {
        border: 0px;
      }
    }

    .dept,
    .customer,
    .agency,
    .referrerAgency {
      :deep(.el-form-item__content) {
        display: flex;
        align-items: flex-start;
        flex-wrap: nowrap;
      }

      .type {
        :deep(.el-select__wrapper) {
          font-size: 12px;
          font-weight: 700;
          background-color: #f5f7fa;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      .id {
        :deep(.el-select__wrapper) {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
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

.customer-table {
  :deep(.el-table__inner-wrapper) {
    th.el-table__cell {
      padding: 5px 0;
    }

    td.el-table__cell {
      padding: 6px 0;
    }

    .cell {
      padding: 0px 6px;
      /* line-height: 20px; */
    }
  }

  :deep(.el-progress-circle) {
    width: 50px !important;
    height: 50px !important;
  }

  :deep(.el-progress__text) {
    font-size: 14px;
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

:deep(.el-table-fixed-column--right) {
  border-left: var(--el-table-border);

  .el-dropdown {
    vertical-align: bottom;
    padding-left: 10px;
  }
}

/* 隐藏原有日期面板 */
.age-picker .el-picker-panel__body {
  display: none;
}

/* 自定义年龄面板 */
.custom-age-panel {
  padding: 10px;
}

.age-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
</style>
