import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionCredit from 'material-ui/svg-icons/content/add-circle';
import ActionEdit from 'material-ui/svg-icons/image/edit';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';


//const host = "";
const host = "/StudentApp";

export default class Students extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            addDialogOpen:false,
            confirmDialogOpen:false,
            addCreditDialogOpen:false,
            title:'Add Student',
            first_name:'',
            last_name:'',
            email:'',
            grade:'',
            credits:'',
            creditsadd:5,
			filterValue:'',
            id:'',
            doneTypingInterval: 200,
            typingTimer:null
        }
    	this.handleCancel = this.handleCancel.bind(this);
        this.handleCreditCancel = this.handleCreditCancel.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleCreditSubmit = this.handleCreditSubmit.bind(this);
    	this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.formatCredits = this.formatCredits.bind(this);
    	this.filter = this.filter.bind(this);
    	this.performFilter = this.performFilter.bind(this);
    }

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
    }
	filter(e) {

		let value = e.target.value;
		this.setState({filterValue:value});

		if (this.state.typingTimer!=null)
			clearTimeout(this.state.typingTimer);
		this.setState({typingTimer:setTimeout(this.performFilter, this.state.doneTypingInterval)});

	}

	performFilter() {
		clearTimeout(this.state.typingTimer);

		if (this.state.filterValue.length>1)
			this.props.connection.send('{"for":"students","filter":"'+this.state.filterValue+'"}');
	}

    formatCredits(c) {
    	if (!c) return 0;
    	var humanFormat = require('human-format');
    	return humanFormat(parseInt(c));
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
	handleCreditCancel() {
	    this.setState({addCreditDialogOpen: false});
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
	handleCreditSubmit(e) {
        var _this = this;
		axios.post(host+"/student",{
			id:this.state.id,
			first_name:this.state.first_name,
			last_name:this.state.last_name,
            email:this.state.email,
            grade:this.state.grade,
            credits:parseInt(this.state.credits) + parseInt(this.state.creditsadd)
			}).then(function(result){
        });
	    this.setState({addCreditDialogOpen: false});
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
        } else if (columnNum===8) {
        	this.setState({title:'Add Credits'});
        	this.setState({first_name:this.props.students[rowNum].first_name});
        	this.setState({last_name:this.props.students[rowNum].last_name});
        	this.setState({email:this.props.students[rowNum].email});
        	this.setState({grade:this.props.students[rowNum].grade});
        	this.setState({credits:this.props.students[rowNum].credits});
        	this.setState({id:this.props.students[rowNum].id});
        	this.setState({addCreditDialogOpen: true});
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
				<TextField hintText="First Name" floatingLabelText="First Name" id="first_name" defaultValue={this.state.first_name} onChange={this.handleInputChange}/><br />
				<TextField hintText="Last Name" floatingLabelText="Last Name" id="last_name" defaultValue={this.state.last_name} onChange={this.handleInputChange} /><br />
                <TextField hintText="Email" floatingLabelText="Email" id="email" defaultValue={this.state.email} onChange={this.handleInputChange} /><br />
                <TextField hintText="Grade" floatingLabelText="Grade" id="grade" defaultValue={this.state.grade} onChange={this.handleInputChange} /><br />
                <TextField hintText="Cactus Credits" floatingLabelText="Credits" id="credits" defaultValue={this.state.credits} onChange={this.handleInputChange} /><br />
				<FlatButton label="Cancel" primary={true} onTouchTap={this.handleCancel}/>
				<FlatButton label="Submit" primary={false} onTouchTap={this.handleSubmit}/>
        	</Dialog>
				<Dialog
		          title={'Add Credits'}
		          modal={true}

		          open={this.state.addCreditDialogOpen}
		        >

              <TextField hintText="Cactus Credits" id="credits" type="number" value={this.state.creditsadd} onChange={this.handleInputChange} /><br />
				<FlatButton label="Cancel" primary={true} onTouchTap={this.handleCreditCancel}/>
				<FlatButton label="Submit" primary={false} onTouchTap={this.handleCreditSubmit}/>
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

                <TextField style={{padding: 15, margin: 15}} hintText="Student Filter" floatingLabelText="Student Filter" onChange={this.filter} />

                <Table onCellClick={this.handleCellClick}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Grade</TableHeaderColumn>
                        <TableHeaderColumn>Credits</TableHeaderColumn>
                        <TableHeaderColumn>Last Login</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

               <TableBody stripedRows={false} displayRowCheckbox={false}>
				{_this.props.students.map(function(student) {
					return(

                         <TableRow key={student.id}>
                            <TableRowColumn>{student.displayName}</TableRowColumn>
                            <TableRowColumn>{student.email}</TableRowColumn>
                            <TableRowColumn>{student.grade}</TableRowColumn>
                            <TableRowColumn>{_this.formatCredits(student.credits)}</TableRowColumn>
                            <TableRowColumn>{student.lastLogin}</TableRowColumn>
                            <TableRowColumn><IconButton><ActionEdit /></IconButton></TableRowColumn>
							<TableRowColumn><IconButton><ActionDelete /></IconButton></TableRowColumn>
							<TableRowColumn><IconButton><ActionCredit /></IconButton></TableRowColumn>
                        </TableRow>


					);
				})}

                </TableBody>


                </Table>
            </div>
        )
    }
}
