import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionEdit from 'material-ui/svg-icons/image/edit';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';


//const host = "";
const host = "http://localhost:8080";

export default class Students extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            addDialogOpen:false,
            confirmDialogOpen:false,
            title:'Add Student',
            first_name:'',
            last_name:'',
            email:'',
            grade:'',
            credits:'',
            id:''
        }
    	this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.formatCredits = this.formatCredits.bind(this);
    }

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
    }
    formatCredits(c) {
    	var humanFormat = require('human-format');
    	return humanFormat(c);
    }

    // handle new student
	onAddHandler() {
		this.setState({title:'Add Student'});
		this.setState({first_name:''});
		this.setState({last_name:''});
		this.setState({email:''});
		this.setState({grade:''});
		this.setState({credits:''});
		this.setState({id:'-1'});
 		this.setState({addDialogOpen: true});
	}
	handleCancel() {
	    this.setState({addDialogOpen: false});
	}
	handleConfirmCancel() {
	    this.setState({confirmDialogOpen: false});
	}
	handleSubmit(e) {
        var _this = this;
		axios.post(host+"/student",{
				id:this.state.id,
				first_name:this.state.first_name,
				last_name:this.state.last_name,
                email:this.state.email,
                grade:this.state.grade,
                credits:this.state.credits
				}).then(function(result){
        });
	    this.setState({addDialogOpen: false});
    }
	handleConfirmSubmit(){
		var deleteURL = host+"/student?id="+this.state.id;
        axios.delete(deleteURL).then(function(result){});
        this.setState({confirmDialogOpen:false});
	}
	handleInputChange(e) {
        let value = e.target.value;
		if (e.target.id==="first_name") this.setState({first_name:value});
		if (e.target.id==="last_name") this.setState({last_name:value});
        if (e.target.id==="email") this.setState({email:value});
        if (e.target.id==="grade") this.setState({grade:value});
        if (e.target.id==="credits") this.setState({credits:value});
    }
	

    // handle row interaction
    handleCellClick(rowNum,columnNum) {
        var _this = this;
        if (columnNum===7) {
        	this.setState({id:this.props.students[rowNum].id});
        	this.setState({first_name:this.props.students[rowNum].first_name});
        	this.setState({confirmDialogOpen:true});

        } else if (columnNum===6) {
        	this.setState({title:'Edit Student'});
        	this.setState({first_name:this.props.students[rowNum].first_name});
        	this.setState({last_name:this.props.students[rowNum].last_name});
        	this.setState({email:this.props.students[rowNum].email});
        	this.setState({grade:this.props.students[rowNum].grade});
        	this.setState({credits:this.props.students[rowNum].credits});
        	this.setState({id:this.props.students[rowNum].id});
        	this.setState({addDialogOpen: true});
        }
    }
    
    render() {
    	var _this = this;
		const fabStyle = {
		    margin: 0,
		    top: 'auto',
		    right: 20,
		    bottom: 20,
		    left: 'auto',
		    position: 'fixed',
		};


        return (
            <div>


            <Dialog
		          title={this.state.title}
		          modal={true}

		          open={this.state.addDialogOpen}
		        >
				<TextField hintText="First Name" id="first_name" defaultValue={this.state.first_name} onChange={this.handleInputChange}/><br />
				<TextField hintText="Last Name" id="last_name" defaultValue={this.state.last_name} onChange={this.handleInputChange} /><br />
                <TextField hintText="Email" id="email" defaultValue={this.state.email} onChange={this.handleInputChange} /><br />
                <TextField hintText="Grade" id="grade" defaultValue={this.state.grade} onChange={this.handleInputChange} /><br />
                <TextField hintText="Cactus Credits" id="credits" defaultValue={this.state.credits} onChange={this.handleInputChange} /><br />
				<FlatButton label="Cancel" primary={true} onTouchTap={this.handleCancel}/>
				<FlatButton label="Submit" primary={false} onTouchTap={this.handleSubmit}/>
        	</Dialog>
				<Dialog
					title={'Are you sure you want to delete '+this.state.first_name+' from the list?'}
					modal={true}

					open={this.state.confirmDialogOpen}
				>
				<FlatButton label="Cancel" primary={true} onTouchTap={this.handleConfirmCancel}/>
				<FlatButton label="Submit" primary={false} onTouchTap={this.handleConfirmSubmit}/>
				</Dialog>

                <FloatingActionButton style={fabStyle} onTouchTap={() => { this.onAddHandler(); }}><ContentAdd /></FloatingActionButton>

                <Table onCellClick={this.handleCellClick}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                        <TableHeaderColumn>First Name</TableHeaderColumn>
                        <TableHeaderColumn>Last Name</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Grade</TableHeaderColumn>
                        <TableHeaderColumn>Credits</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

               <TableBody stripedRows={false} displayRowCheckbox={false}>
				{_this.props.students.map(function(student) {
					return(

                         <TableRow key={student.id}>
                            <TableRowColumn>{student.first_name}</TableRowColumn>
                            <TableRowColumn>{student.last_name}</TableRowColumn>
                            <TableRowColumn>{student.email}</TableRowColumn>
                            <TableRowColumn>{student.grade}</TableRowColumn>
                            <TableRowColumn>{_this.formatCredits(student.credits)}</TableRowColumn>
                            <TableRowColumn><IconButton><ActionEdit /></IconButton></TableRowColumn>
							<TableRowColumn><IconButton><ActionDelete /></IconButton></TableRowColumn>
                        </TableRow>


					);
				})}

                </TableBody>


                </Table>
            </div>
        )
    }
}