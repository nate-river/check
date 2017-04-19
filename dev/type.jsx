const React=require('react');
const ReactDOM=require('react-dom');
var $=require('jquery');


class Panel extends React.Component{


	render(){
		return(
			<div>
				{this.props.children}
			</div>
        )
    }
}

class Media extends React.Component{
	constructor(props){
		super(props);
		this.state={
			showChildren:false
		}
		this.add=this.add.bind(this)
		this.change=this.change.bind(this)
		this.d=this.d.bind(this)
		this.toggle=this.toggle.bind(this)
	}
	add(){
		this.props.x(this.props.id);
	}
	change(e){
		this.props.c(e.target.value,this.props.id);
	}
	d(){
		this.props.d(this.props.id);
	}
	toggle(){
		if(this.state.showChildren)
		{
			this.setState({
				showChildren:false
			})
		}
		else{
			this.setState({
				showChildren:true
			})
		}
	}

	render(){

		return(
			<div className="media">
			  <div className="media-left">
				{
					this.state.showChildren?
						(<span onClick={this.toggle} className="suo  icon-caret-down"></span>)
					:
						(<span onClick={this.toggle} className="suo  icon-caret-right"></span>)
				}

              </div>
			<div className="media-body">
				<h4 className="media-heading">
					<input type="text"
						   defaultValue={this.props.head?this.props.head:"添加阶段"}
						   onChange={this.change}
						   className="form-control"/>
					<button type="button" className="add btn btn-info" onClick={this.add}>
						<span className="icon-plus"></span>
					</button>
					<button type="button" className="delete btn btn-danger" onClick={this.d}>
						<span className="icon-plus icon-remove"></span>
					</button>
			    </h4>
				<div style={{display:this.state.showChildren?'block':'none'}}>
					   {this.props.children}
				</div>

			</div>
        </div>
      )
   }
}


class App extends React.Component{
	constructor(props){
		super(props)
		this.state={
			cats:[]
		}
		this.add=this.add.bind(this)
		this.update=this.update.bind(this)
		this.delete=this.delete.bind(this)

	}
	componentDidMount(){
		$.ajax({
			url:'/admin/showStage',
			type:'get',
			success:(function(data){
				this.setState({cats:data})
			}).bind(this)
		})
	}

	add(id){

		$.ajax({
			url:'/admin/addStage',
			type:'post',
			data:{name:'',id:id},
			success:(function(insertId){
				this.setState(function(prev){
					var item={
						id:insertId,
						name:'',
						s_id:id
					}
					prev.cats.unshift(item)
					return{cats:prev.cats}

				})

			}).bind(this)
		})
	}

	update(value,id){

		$.ajax({
			url:'/admin/updateStage',
			type:'post',
			data:{name:value,id:id}
		})
		this.setState(function(prev){
			prev.cats.forEach((v,i)=>{
				if(v.id==id)
				{
					prev.cats[i].name=value
				}
				return{cats:prev.cats}
			})

		})
	}

	delete(id) {
		var r = {};
		function L(cats, id) {
			cats.forEach(function (v) {
				if (v.s_id === id) {
					r[v.id] = true;
					L(cats, v.id)
				}
			})
		}
		L(this.state.cats, id);

		r[id] = true;
		if(Object.keys(r).length>1){
			alert("The element has a subclass , cannot be deleted");
		}
		else{
			$.ajax({
				url: '/admin/deleteStage',
				type: 'post',
				data: {ids: Object.keys(r).join(',')}
			});
			this.setState(function (prev) {
				var arr = prev.cats.filter(function (v) {
					return !r[v.id];
				});
				return {
					cats: arr
				}
			})
		}



	}

	render(){

		var cats=this.state.cats;
		var self=this;
		function findByParentId(arr,id){
			return arr.filter(function(v){
				return v.s_id===id
			})
		}
		function V(pid){
			var tmp=findByParentId(cats,pid);

			if(tmp.length){
				return tmp.map(function(v){

					return(

						<Media key={v.id}
				               head={v.name}
							   x={self.add}
						       c={self.update}
					           d={self.delete}
				               id={v.id}>
						    {V(v.id)}
						</Media>
                      )
                })
			}else{
				return null;
			}
         }

		var views=V(0);
		return(
			<div>
				<Panel title="KNOWLEDGE POINT">
				     {views}
				</Panel>
			</div>
          )
		}
}


ReactDOM.render(<App/>,document.querySelector('.container'))









