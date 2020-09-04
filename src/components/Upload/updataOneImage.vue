<template>
    <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="uploadImage"
            :show-file-list="false"
            :on-success="uploadAvatar">
        <img v-if="dialogImageUrl" :src=dialogImageUrl class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

</template>

<script>
    export default {
        name: "updataOneImage",
        props:{
            imageUrl:{
                type:String,
                default:''
            },
        },
        data(){
            return {
                uploadImage:'',
                dialogImageUrl: undefined,
                oBul:false
            }
        },
        created() {
            this.uploadImage = `${this.baseURL}/api/upload/image`
            this.dialogImageUrl = this.imageUrl === '' ? this.dialogImageUrl : this.imageUrl
        },

        computed: {
            headers() {
                return {
                }
            }
        },
        methods:{
            uploadAvatar: function(res) {
                if(res.code === 0){
                    this.dialogImageUrl = res.data.path
                    this.$emit('updateImage',res.data.path)
                }else{
                    this.$message.error('图片上传失败,请联系管理员')
                }
            },
        },

    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
    }
    .avatar {
        width: 148px;
        height: 148px;
        display: block;
    }

</style>
