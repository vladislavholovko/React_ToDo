import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


//ListTask =================================
class ListTask extends React.Component {
    constructor(props){
        super(props);
        this.state={
            input:'',
            list:[],
            search:[]
        };
        this.createTask = this.createTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.upTask = this.upTask.bind(this);
        this.taskSearch = this.taskSearch.bind(this);
        this.removeTaskSearch = this.removeTaskSearch.bind(this);
    };
//Search ===================================
    taskSearch (e) {
        var sValue = e.target.value;
        let newList = this.state.list;
        let sList = newList.filter(function (value) {
           let mTitle = value.title;
           return mTitle.indexOf(sValue) !== -1;
        });

        if (sValue === "") {
            this.setState({search: []});
        } else
            {
            this.setState({search: sList});
            }
    }



//Create new Task ==========================
    createTask(){
       if (document.getElementById("add-input").value === ''){
           alert("Введіть задачу");
       } else {
           let newList = this.state.list;
           let setTime = new Date();
           let nowTime = setTime.getHours() +':'+ setTime.getMinutes() +':'+ setTime.getSeconds();
           newList.push({
               title:this.state.input,
               time:nowTime
           });
           this.setState({list:newList});

           document.getElementById("add-input").value = "";
           localStorage.setItem('task', JSON.stringify(this.state.list));
       }
    };

    onChangeInput(e){
        this.setState({
            input:e.target.value
        });
    };

//Move up ==================================
    upTask(index) {
        let newList = this.state.list;

        if (index === 0) {
            alert("Елемент вже на початку списку");
        } else {
            let a = newList[index];
            newList[index] = newList[index - 1];
            newList[index - 1] = a;
            this.setState({list: newList});
            localStorage.setItem('task', JSON.stringify(this.state.list));
        }
    };

//Move down ================================
    downTask(index) {
        let newList = this.state.list;

        if (index >= newList.length-1) {
            alert("Елемент вже в кінці списку");
        } else {
            let a = newList[index];
            newList[index] = newList[index+1];
            newList[index+1] = a;
            this.setState({list:newList});
            localStorage.setItem('task', JSON.stringify(this.state.list));
        }
    };

    //Delete Task ==============================
    removeTask (index) {
        let newList = this.state.list;
        newList.splice(index,1);
        this.setState({list:newList});
        localStorage.setItem('task', JSON.stringify(this.state.list));
    };



    removeTaskSearch (index) {
        let newList = this.state.list;
        for (let i=0; i<this.state.list.length; i++){
            if (this.state.list[i] === index) {
                let index = newList.indexOf(this.state.list[i]);
                newList.splice(index,1);
                this.setState({search: []})
                document.getElementById("text-search").value = null;
                this.setState({list:newList});
                localStorage.setItem('task', JSON.stringify(this.state.list));
            }
        }
    };


    render () {

        let listView=this.state.list.map((value,index)=>{
            return(
                <li key={index} index={index} className="todo-item list-group-item m-1 rounded justify-content-around">
                    <label className="title mr-2 col-9">{value.title}</label>
                    <label className="mr-2 col-1">{ value.time}</label>
                    <button className="reorder-up mr-2" onClick={()=>this.upTask(index)}>&#x2191;</button>
                    <button className="reorder-down mr-2" onClick={()=>this.downTask(index)}>&#x2193;</button>
                    <button className="delete mr-2 col-1" onClick={()=>this.removeTask(index)}>&#x2718;</button>
                </li>
            )
        });


        let sView=this.state.search.map((value,index)=>{
            return(
                <li key={index} index={index} className="todo-item list-group-item m-1 rounded justify-content-around">
                    <label className="title mr-2 col-9">{value.title}</label>
                    <label className="mr-2 col-1">{ value.time}</label>
                    <button className="delete mr-2 col-1" onClick={()=>this.removeTaskSearch(value)}>&#x2718;</button>
                </li>
            )
        });


        return (
            <div>
                <nav className="navbar bg-dark font-italic" style={{borderWidth: 2, borderColor:'#2A2A2A'}}>
                    <a href="" className="nav-brand  text-danger  h1 ">To Do... </a>
                    <form className="form-inline">
                        <input id="text-search" className="form-control mr-2" type="search" placeholder="Пошук задачі" aria-label="Search" onChange={(e)=> this.taskSearch(e)} />
                    </form>
                </nav>
                <div>
                    <div id="myDIV" className="container-fluid bg-dark" style={{borderWidth: 2, borderColor: '#2A2A2A'}}>
                        <h1 className="text-center text-danger font-weight-bold mt-1 ">Додати задачу</h1><br/>
                        <form className="form-inline justify-content-md-center p-2" id="todo-form" onSubmit={(e)=>e.preventDefault()}>
                            <input id="add-input" type="text" className="form-control w-50" placeholder="Назва задачі" aria-label="Task"
                                   onChange={(e)=>this.onChangeInput(e)} />
                            <button id="add-button" className="btn ml-2" type="submit" onClick={this.createTask}>Додати</button>
                        </form>
                    </div>
                    <ul id="todo-list" className="list-group p-2 font-italic" >
                        {this.state.search.length === 0 ? listView : sView }
                    </ul>
                </div>
            </div>
        );
    };

    componentDidMount() {
        if (localStorage.getItem('task')!==null&&localStorage.getItem('task').length!==2){
            if 	(window.confirm('Існують збержені завдання відкрити їх?')){
                let newList = JSON.parse(localStorage.getItem('task'));
                let newTime = JSON.parse(localStorage.getItem('time'));
                this.setState({
                    list:newList, time: newTime
                });
            } else {
                alert("Дані будуть видалені");
                localStorage.clear();
            }
        }
    }
};


    class Container extends React.Component {
        render () {
            return (
                   <ListTask/>
            );
        }
};

ReactDOM.render(<Container/>, document.getElementById('contain'));

registerServiceWorker();
