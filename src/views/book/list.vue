<template>
  <div class="app-container">
    <!--  图书列表页面头-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        clearable
        placeholder="书名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        clearable
        placeholder="作者"
        style="width: 200px;margin-left: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        style="margin-left: 5px"
        @change="handleFilter"
      >
        <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.label"/>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="forceRefresh"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left:5px;"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>
    <!--图书别表渲染-->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      />
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{row:{authorWrappe}}">
          <span v-html="authorWrappe"/>
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" width="150" align="center"/>
      <el-table-column label="分类" prop="categoryText" width="100" align="center"/>
      <el-table-column label="语言" prop="language" align="center"/>
      <el-table-column label="封面图片" width="150" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.cover">
            <img
              :src="scope.row.cover"
              style="width:120px;height:180px"
            >
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" width="100" align="center"/>
      <el-table-column label="文件路径" prop="fileName" width="100" align="center">
        <template slot-scope="{row:{filePath}}">
          <span>{{filePath | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="解压路径" width="100" align="center">
        <template slot-scope="{ row: { unzipPath }}">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDt | timeFiler }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="{scope}">
          <PreviewDialog title="电子书信息" :data='row'>
            <el-button type="text" icon="el-icon-view" />
          </PreviewDialog>
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)"/>
          <el-button type="text" icon="el-icon-edit" @click="handleDelete(row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import PreviewDialog from './components/PreviewDialog'
  /* eslint-disable */
  export default {
    name: "list",
    components:{PreviewDialog},
    filters: {
      timeFiler(time){
        if (time) {
          return parseTime(time, '{y}-{m}-{d} {h}:{i}');
        } else {
          return '无'
        }
      },
      valueFilter(value) {
        if (value) {
          return value;
        } else {
        return  '无'
        }
      }
    },
    data() {
      return {
        listQuery: {},
        listLoading: false,
        tableKey: 0,
        list: [],
        categoryList:[],
        showCover:false
      }
    },
    created() {
      //初始化加载列表数据


    },
    methods: {
//--------------------------------------------更能函数-------------------------------------------
//--------------------------------------------网络请求--------------------------------------------
      handleFilter() {

      },
      getBookList(){

      },
//--------------------------------------------事件绑定---------------------------------------------
      forceRefresh() {

      },
      handleCreate() {

      },
      changeShowCover() {

      },
      sortChange() {

      },
      getSortClass() {

      },
      handleUpdate(){

      },
      handleDelete(){

      }
    }
  }
</script>

<style scoped>

</style>
