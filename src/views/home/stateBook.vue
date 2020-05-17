<template>
	<div class="allBook">
		<div class="box">
			<div class="header">
				<el-input v-model="input"  placeholder="请输入书名/作者"></el-input>
				<el-button class="searchBtn" type="primary" @click="searchBook()">搜索</el-button>
				<p>共搜索到{{totalNum}}条数据</p>
			</div>
			<div class="table">
			  <el-table :data="tableData.slice((paging.page-1)*paging.size,paging.page*paging.size)" stripe border class="elTable" style="width:96%">
			  	<el-table-column prop="id" label="图书编号" min-width="100"></el-table-column>
			    <el-table-column prop="name" label="书名" min-width="100"></el-table-column>
			    <el-table-column prop="actor" label="作者" min-width="100"></el-table-column>
			    <el-table-column prop="type" label="图书类别" min-width="100"></el-table-column>
			    <el-table-column prop="press" label="出版社" min-width="100"></el-table-column>
			    <el-table-column prop="time" label="出版时间" min-width="100"></el-table-column>
			    <el-table-column prop="state" label="图书状态"></el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                <el-button size="mini" type="primary"  @click="setstate(scope.$index, scope.row)" v-if="scope.row.state == '可借阅'">借阅</el-button>
                <el-button size="mini" type="success"  @click="haunstate(scope.$index, scope.row)" v-else-if="scope.row.state == '已借阅'">还书</el-button>
                </template>
			    </el-table-column>
			  </el-table>
			</div>
			<el-pagination
			  background
			  layout="total,prev, pager, next"
			  :page-size="paging.size"
			  :current-page.sync="paging.page"
			  :total="totalNum"
			  @size-change="handleSizeChange"
			  @current-change="currentChange">
			</el-pagination>
		</div>
        <!-- 借阅弹窗 -->
	<el-dialog title="借阅图书" :visible.sync="dialogVisible3" width="620px" center>
		  <div class="line">
		  	<div class="block">
		  		<span>图书编号：</span>
		  		<el-input v-model="jieParam.bookid" placeholder="请输入图书编号"></el-input>
		  	</div>
		  	<div class="block">
		  		<span>书&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
		  		<el-input v-model="jieParam.bookname" placeholder="请输入书名"></el-input>
		  	</div>
		  </div>
		 
		  <div class="line">
		  
		  	<div class="block">
		  		<span>借阅时间：</span>
		  		<el-date-picker
		  		  v-model="jieParam.booktime"
		  		  type="date"
		  		  placeholder="选择日期"
		  		  value-format="yyyy-MM-dd"
		  		  ></el-date-picker>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible3 = false">取 消</el-button>
		    <el-button type="primary" @click="stateSure()">确 定</el-button>
		  </span>
    </el-dialog>
    <!-- 还书 -->
    	<el-dialog title="归还图书" :visible.sync="dialogVisible2" width="620px" center>
		  <div class="line">
		  	<div class="block">
		  		<span>图书编号：</span>
		  		<el-input v-model="huanParam.bookid" placeholder="请输入图书编号"></el-input>
		  	</div>
		  	<div class="block">
		  		<span>书&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
		  		<el-input v-model="huanParam.bookname" placeholder="请输入书名"></el-input>
		  	</div>
		  </div>
		 
		  <div class="line">
		  
		  	<div class="block">
		  		<span>归还时间：</span>
		  		<el-date-picker
		  		  v-model="huanParam.booktime"
		  		  type="date"
		  		  placeholder="选择日期"
		  		  value-format="yyyy-MM-dd"
		  		  ></el-date-picker>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible2 = false">取 消</el-button>
		    <el-button type="primary" @click="huanSure()">确 定</el-button>
		  </span>
    </el-dialog>
	</div>
</template>

<script>
import Bus from '../../assets/js/bus.js'

export default{
	data(){
		return{
			input:'',
			tableData:[],
			searchResult:[],
			totalNum:0,
			paging:{
				size:10,
				page:1,
            },dialogVisible2:false,
            dialogVisible3:false,
            jieParam:{
				bookid:'',
				bookname:'',
				bookactor:'',
				booktype:'',
				bookpress:'',
				booktime:'',
            },
             huanParam:{
				bookid:'',
				bookname:'',
				bookactor:'',
				booktype:'',
				bookpress:'',
				booktime:'',
			},
			xiabiao:'',
		}
	},
	created(){
		
	},
	mounted(){
		this.refreshTable();
        // this.searchBook();
	},
	computed:{

	},
	methods:{
		//分页
		currentChange(val){
			this.paging.page = val;
		},
		handleSizeChange(size) {
            this.paging.size = size;
        },
		refreshTable(){
            let tableNew = JSON.parse(localStorage.getItem('bookInfo'));
			if(tableNew == null){
				return false;
			}else{
				this.tableData = tableNew;
				this.totalNum = tableNew.length;
			}
		},
		searchBook(){
			this.searchResult = [];
			this.totalNum = 0;
			for(let i=0;i<this.tableData.length;i++){
				if(this.tableData[i].name && this.tableData[i].name.indexOf(this.input)!=-1){
					this.searchResult.push(this.tableData[i]);
					this.totalNum++;
				}else if(this.tableData[i].actor &&  this.tableData[i].actor.indexOf(this.input)!=-1){
					this.searchResult.push(this.tableData[i]);
					this.totalNum++;
				}
			}
			return this.searchResult;
        },
        // 借阅按钮
	    setstate(index,row){
            this.dialogVisible3 = true;
            this.jieParam.bookid = row.id;
            this.jieParam.bookname = row.name;
            this.jieParam.bookactor = row.actor;
            this.jieParam.booktype = row.type;
            this.jieParam.bookpress = row.press;
            this.jieParam.booktime = row.time;
            this.jieParam.state = "已借阅";
            this.xiabiao = Number((this.paging.page-1)*this.paging.size + index);

	    },
	    // 借阅确定按钮
	    stateSure(){
            let s = {};
            s.id = this.jieParam.bookid;
            s.name = this.jieParam.bookname;
            s.actor = this.jieParam.bookactor;
            s.type = this.jieParam.booktype;
            s.press = this.jieParam.bookpress;
            s.time = this.jieParam.booktime;
            s.state = '已借阅';

            this.tableData.splice(this.xiabiao,1,s);
            localStorage.setItem('bookInfo',JSON.stringify(this.tableData));
            this.dialogVisible3 = false;
            this.refreshTable();
            this.$notify({
                title: '成功',
                message: '借阅图书成功！',
                type: 'success',
                duration:'1500'
            });
            this.refreshTable();
        },
         // 还书按钮
	    haunstate(index,row){
            this.dialogVisible2 = true;
            this.huanParam.bookid = row.id;
            this.huanParam.bookname = row.name;
            this.huanParam.bookactor = row.actor;
            this.huanParam.booktype = row.type;
            this.huanParam.bookpress = row.press;
            this.huanParam.booktime = row.time;
            this.huanParam.state = "可借阅";
            this.xiabiao = Number((this.paging.page-1)*this.paging.size + index);

	    },
	    // 还书确定按钮
	    huanSure(){
            let s = {};
            s.id = this.huanParam.bookid;
            s.name = this.huanParam.bookname;
            s.actor = this.huanParam.bookactor;
            s.type = this.huanParam.booktype;
            s.press = this.huanParam.bookpress;
            s.time = this.huanParam.booktime;
            s.state = '可借阅';

            this.tableData.splice(this.xiabiao,1,s);
            localStorage.setItem('bookInfo',JSON.stringify(this.tableData));
            this.dialogVisible2 = false;
            this.refreshTable();
            this.$notify({
                title: '成功',
                message: '归还图书成功！',
                type: 'success',
                duration:'1500'
            });
            this.refreshTable();
        },
    }
}
</script>

<style>
.allBook{
	.box{
		width: 100%;
		.header{
			width: 96%;
			margin: 0 auto;
			height: 72px;
			.searchBtn{
				float: left;
				margin: 15px 0px 0 0;
			}
			.el-input{
				width: 280px;
				float: left;
				margin: 15px 0px 0 0;
			}
			p{
				float: left;
				padding-left: 30px;
				line-height: 72px;
				color:red;
			}
		}
		.table{
			width: 100%;
			min-height: 540px;
			.el-table{
				margin: 0 auto;
				tr,th{
					text-align: center;
				}	
			}
		}
	}
}
</style>