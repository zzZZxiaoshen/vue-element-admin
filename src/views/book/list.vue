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
    <!--图书列表渲染-->
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
      <el-table-column label="书名" width="150" align="center">
        <template slot-scope="{ row: { titleWrapper }}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{row:{authorWrapper}}">
          <span v-html="authorWrapper"/>
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
        <template slot-scope="{row}">
          <PreviewDialog title="电子书信息" :data='row'>
            <el-button type="text" icon="el-icon-view" />
          </PreviewDialog>
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)"/>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import PreviewDialog from './components/PreviewDialog'
  import {listBook,getCategory,deleteBook} from '@/api/book'
  import { parseTime } from '@/utils'
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
        list: null,
        categoryList:[],
        showCover:false
      }
    },
    created() {
      this.parseQuery()
    },
    mounted() {
      //初始化加载图书列表数据
      this.getList();
      //初始化加载分类
      // this.getCategoryList();
    },
    methods: {
//--------------------------------------------更能函数-------------------------------------------
      parseQuery() {
        const query = Object.assign({}, this.$route.query);

        let listQuery = {
          page: 1,
          pageSize: 20,
          sort: '-id'
        };
        if (query) {
          query.page && (query.page= Number(query.page))
          query.pageSize && (query.pageSize = Number(query.pageSize))

          listQuery = {
           ...listQuery,
           ...query
          }
        }
        this.listQuery = listQuery;
      },
      wrapperKeyword(k, v) {
        function hightlight(value) {
          return '<span style="color: #1890ff">'+value + '</span>'
        }

        if (!this.listQuery[k]) {
          return v;
        } else {
          return v.replace(new RegExp(this.listQuery[k],'ig'),v=>{
            hightlight(v);
          })
        }
      },
      sortById(order) {
        if (order === 'descending') { //降序
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
      },
      // 配置路由参数回显功能函数
      refresh(){
        this.$router.push({
          path: '/book/list',
          query: this.listQuery
        })
      },
//--------------------------------------------网络请求--------------------------------------------
      getCategoryList() {
        getCategory().then(res =>{
          this.categoryList = res.data
        })
      } ,
//--------------------------------------------事件绑定---------------------------------------------
      handleFilter() {
        //根据条件请求刷新数据
        //初始化查询条件
        this.listQuery.page = 1;
        //根据条件刷新页面
        this.refresh();
      },
      // 点击按条件查询
      forceRefresh() {
        window.location.reload();
        // this.getList();
      },
      //新增图书
      handleCreate() {
        this.$router.push('/book/create')
      },
      changeShowCover(value) {
        this.showCover = value
      },
      sortChange(key) {
        const {prop,order} = key;
        //descending 降序 ascending 升序
        if (prop === 'id') {
          this.sortById(order)
        }
      },
      // 获取排序点击的列 ，然后进行列表渲染
      getSortClass(key) {
        const sort = this.listQuery;
        return sort === `+${key}` ?
          "ascending":
          sort ===`-${key}` ? 'descending': ''
      },
      handleUpdate(row){
        const {fileName} = row;
      this.$router.push(`/book/edit/${fileName}`)
      },
      handleDelete(row){
        //请求删除接口
        this.$confirm('此操作将永久删除该电子书, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteBook(row.fileName).then(res=>{
            this.$notify({
              title: '成功',
              message: res.msg,
              type: "success",
              duration: 2000
            });
          })
        })
      },
      getList() {
        this.loading = true;
        listBook(this.listQuery).then(res=>{
          const {
            data, total
          } = res;
          this.list = data;
          this.total = total;
          this.loading = false;
          this.list.forEach(book =>{
            book.titleWrapper = this.wrapperKeyword('title', book.title);
            book.authorWrapper = this.wrapperKeyword('author', book.title);
          })
        })
      },
    },


  }
</script>

<style scoped>

</style>
