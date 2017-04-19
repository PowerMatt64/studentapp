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
import DatePicker from 'material-ui/DatePicker';



//const host = "";
const host = "http://localhost:8080";

export default class Items extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            addDialogOpen:false,
            confirmDialogOpen:false,
            title:'Add Item',
            name:'',
            min_bid:'',
            buyout:'',
            owner:'',
            id:'',
            start_date:new Date()
        }
    	this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleInputChange = this.handleInputChange.bind(this);
    	this.handleStartDateInputChange = this.handleStartDateInputChange.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.formatStartDate = this.formatStartDate.bind(this);
    }

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
    }

    // handle new item
	onAddHandler() {
		this.setState({title:'Add Item'});
		this.setState({name:''});
		this.setState({min_bid:''});
		this.setState({buyout:''});
		this.setState({owner:''});
		this.setState({start_date:new Date()});
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
		axios.post(host+"/item",{
				id:this.state.id,
				name:this.state.name,
				min_bid:this.state.min_bid,
                buyout:this.state.buyout,
                owner:this.state.owner,
                start_date:this.state.start_date
				}).then(function(result){
        });
	    this.setState({addDialogOpen: false});
    }
	handleConfirmSubmit(){
		var deleteURL = host+"/item?id="+this.state.id;
        axios.delete(deleteURL).then(function(result){});
        this.setState({confirmDialogOpen:false});
	}
	handleStartDateInputChange(e,d) {
		this.setState({start_date:d});
	}
	handleInputChange(e,d) {
        let value = e.target.value;
		if (e.target.id==="name") this.setState({name:value});
		if (e.target.id==="min_bid") this.setState({min_bid:value});
        if (e.target.id==="buyout") this.setState({buyout:value});
        if (e.target.id==="owner") this.setState({owner:value});
        
    }
	

    // handle row interaction
    handleCellClick(rowNum,columnNum) {
        var _this = this;
        if (columnNum===7) {
        	console.log(this.props.items[rowNum]);
        	this.setState({id:this.props.items[rowNum].id});
        	this.setState({name:this.props.items[rowNum].name});
        	this.setState({confirmDialogOpen:true});

        } else if (columnNum===6) {
        	this.setState({title:'Edit Item'});
        	this.setState({name:this.props.items[rowNum].name});
        	this.setState({min_bid:this.props.items[rowNum].min_bid});
        	this.setState({buyout:this.props.items[rowNum].buyout});
        	this.setState({owner:this.props.items[rowNum].owner});
        	this.setState({id:this.props.items[rowNum].id});
        	if (this.props.items[rowNum].start_date)
        		this.setState({start_date:new Date(this.props.items[rowNum].start_date)});
        	else
        		this.setState({start_date:new Date()});
        	this.setState({addDialogOpen: true});
        }
    }

    formatStartDate(d) {
    	var dateFormat = require('dateformat');
    	return dateFormat(d, "dddd, mmmm dS");	
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
				<TextField hintText="Name" fullWidth={true} multiLine={true} id="name" defaultValue={this.state.name} onChange={this.handleInputChange}/><br />
				<TextField hintText="Min. Bid" id="min_bid" type="number" defaultValue={this.state.min_bid} onChange={this.handleInputChange} /><br />
                <TextField hintText="Buyout" id="buyout" type="number" defaultValue={this.state.buyout} onChange={this.handleInputChange} /><br />
                <TextField disabled={true} hintText="Owner" id="owner" defaultValue={this.state.owner} onChange={this.handleInputChange} /><br />
                <DatePicker hintText="Start Date" mode="landscape" id="start_date" defaultDate={this.state.start_date} onChange={this.handleStartDateInputChange} /><br />
				<FlatButton label="Cancel" primary={true} onTouchTap={this.handleCancel}/>
				<FlatButton label="Submit" primary={false} onTouchTap={this.handleSubmit}/>
        	</Dialog>
				<Dialog
					title={'Are you sure you want to delete '+this.state.name+'?'}
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
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Min. Bid</TableHeaderColumn>
                        <TableHeaderColumn>Buyout</TableHeaderColumn>
                        <TableHeaderColumn>Owner</TableHeaderColumn>
                        <TableHeaderColumn>Start Date</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

               <TableBody stripedRows={false} displayRowCheckbox={false}>
				{this.props.items.map(function(item) {
					return(

                         <TableRow key={item.id}>
                            <TableRowColumn>{item.name}</TableRowColumn>
                            <TableRowColumn>{item.min_bid}</TableRowColumn>
                            <TableRowColumn>{item.buyout}</TableRowColumn>
                            <TableRowColumn>{item.owner}</TableRowColumn>
                            <TableRowColumn>{_this.formatStartDate(item.start_date)}</TableRowColumn>
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