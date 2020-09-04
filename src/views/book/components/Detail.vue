<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" label-width="80px" :rules="rules" class="form-container">
      <sticky :z-index=10 :class-name="'sub-navbar '  + postForm.status">
        <el-button v-if="!isEdit"  >显示帮助</el-button>
        <el-button v-loading="loading"
        style="margin-left: 10px" type="success"
        class="submit-btn"
        @click="onSubmit">
          {{ isEdit ? '编辑电子书' : '新增电子书' }}
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <Warning/>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="image_uri" style="margin-bottom: 0;">
                <upload
                  v-model="postForm.image_uri"
                  :file-list="fileList"
                  :disabled="isEdit"
                  @onSuccess="onUploadSuccess"
                  @onRemove="onUploadRemove"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" prop="title">
                <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                  书名
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="postInfo-container">
            <el-row>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="作者：">
                  <el-input v-model="postForm.author"
                            placeholder="作者"
                            style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="出版社：">
                  <el-input v-model="postForm.publisher"
                            placeholder="出版社"
                            style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="语言：">
                  <el-input v-model="postForm.language"
                            placeholder="语言"
                            style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="根文件：">
                  <el-input v-model="postForm.rootFile"
                            placeholder="根文件"
                            style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="文件路径：">
                  <el-input v-model="postForm.filePath"
                            placeholder="文件路径"
                            style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="解压路径：">
                  <el-input v-model="postForm.unzipPath"
                            placeholder="解压路径"
                            style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="文件路径：">
                  <el-input
                    v-model="postForm.filePath"
                    placeholder="文件路径"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label-width="labelWidth" label="解压路径：">
                  <el-input
                    v-model="postForm.unzipPath"
                    placeholder="解压路径"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label-width="60px" label="封面：">
                  <a v-if="postForm.cover" href="postForm.cover">
                    <img :src="postForm.cover" class="preview-img">
                  </a>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label-width="60px" label="目录：">
                  <div
                    v-if="postForm.contents && postForm.contents.length > 0"
                    class="contents-wrapper"
                  >
                    <el-tree :data="contentsTree" @node-click="onContentClick"/>
                  </div>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>

          </div>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  /* eslint-disable */
  import Sticky from "@/components/Sticky/index";
  import MDinput from "@/components/MDinput/index";
  import Upload from "@/components/Upload/EbookUpload";
  import Warning from "./Warning"
  import {createBook, updateBook,getBook} from "@/api/book"


  const defaultForm = {
    title: '', // 书名
    author: '', // 作者
    publisher: '', // 出版社
    language: '', // 语种
    rootFile: '', // 根文件路径
    cover: '', // 封面图片URL
    coverPath: '', // 封面图片路径
    fileName: '', // 文件名
    originalName: '', // 文件原始名称
    filePath: '', // 文件所在路径
    unzipPath: '', // 解压文件所在路径
    contents: [] // 目录
  }

  const mappingRule = {
    title:"标题"
  }

  export default {
    name: 'Detail',
    components: {Sticky, Warning, MDinput, Upload},
    comments: {Sticky},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: mappingRule[rule.field] + '为必传项', type: 'error'
          })
          callback(new Error(mappingRule[rule.field] + '为必传项'))
        } else {
          callback()
        }
      }

      const validateSourceUri = (rule, value, callback) => {
        if (value) { //校验uri 是否为正确 但是不是必填项
          if (validURL(value)) {
            validURL(value);
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(new Error('外链url填写不正确'))
          }
        } else {
          callback()
        }
      };

      return {
        rules: {
          image_uri: [{validator: validateRequire}],
          title: [{validator: validateRequire}],
          content: [{validator: validateRequire}],
          source_uri: [{validator: validateSourceUri, trigger: 'blur'}]
        },
        loading: false,
        labelWidth: '120px',
        postForm: {},
        fileList: [],
        contentsTree: [],
        imageUrl: ''
      }
    },
    created() {
      if (this.isEdit) {
      //从路由中获取参数、
        const fileName = this.$route.params && this.$route.params.fileName
        console.log("---------------:"+fileName);
        this.getBookData(fileName);
      }
    },
    methods: {

      // ------------------------------------------------ 功能函数-------------------------
      setData(data) {
        //变量解构赋值
        const {
          title,
          author,
          publisher,
          language,
          rootFile,
          cover,
          originalName,
          url,
          contents,
          contentsTree,
          fileName,
          coverPath,
          filePath,
          unzipPath
        } = data
        this.postForm = {
          title,
          author,
          publisher,
          language,
          rootFile,
          cover,
          url,
          originalName,
          contents,
          fileName,
          coverPath,
          filePath,
          unzipPath
        }
        this.fileList = [{name: originalName, url}]
        this.contentsTree = contentsTree
      },
      toDefault() {
        this.postForm = Object.assign({}, defaultForm)
        this.fileList = []
        this.contentsTree = []
      },
//---------------------------------------------------网络请求---------------------------------
      getBookData(data) {
        getBook(data).then(res=>{
          this.setData(res.data)
        })
      },
//---------------------------------------------------事件绑定---------------------------------

      onContentClick(data){
        const { text } = data
        if (text) {
          window.open(text)
        }
      },
      onUploadSuccess(data) {
        //上传成功之后设置渲染的数据
        this.setData(data)
      },
      onUploadRemove() {
        //初始化表单数据
        this.toDefault()
      },
      onSubmit() {
        //表单提交
        console.log(this.postForm)
        this.$refs.postForm.validate(validate => {
          if (validate) {
            this.loading = true;
            const book = Object.assign({}, this.postForm);
            delete book.contents
            if (!this.isEdit) {
              //新增书籍
              createBook(book).then(res => {
                console.log('createBook', res)
                this.loading = false;
                this.$notify({
                  title: '成功',
                  message: response.msg,
                  type: "success",
                  duration: 2000
                });
                this.toDefault();
              }).catch(() => {
                this.loading = false
              })
            } else {
              //编辑书籍
              updateBook(book).then(res => {
                console.log('createBook', res)
                this.loading = false;
                this.$notify({
                  title: '成功',
                  message: response.msg,
                  type: "success",
                  duration: 2000
                });
                this.toDefault();
              }).catch(() => {
                this.loading = false
              })
            }
          }
        })

      },

    },


  }
</script>

<style lang="scss" scoped>

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .preview-img {
        width: 200px;
        height: 270px;
      }

      .contents-wrapper {
        padding: 5px 0;
      }
    }
  }
</style>
