import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionBid from 'material-ui/svg-icons/action/thumb-up';
import ActionEdit from 'material-ui/svg-icons/image/edit';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import DatePicker from 'material-ui/DatePicker';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

const host = "/StudentApp";

export default class Auction extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            addDialogOpen:false,
            bidDialogOpen:false,
            title:'Add Item',
            name:'',
            min_bid:'',
            buyout:'',
            owner:'',
            id:'',
			filterValue:'',
            doneTypingInterval: 200,
            typingTimer:null,
            creditsToBid: 5,
            start_date:new Date()
        }
        this.handleBidCancel = this.handleBidCancel.bind(this);
        this.handleBidSubmit = this.handleBidSubmit.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.formatStartDate = this.formatStartDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    	this.filter = this.filter.bind(this);
    	this.performFilter = this.performFilter.bind(this);
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
			this.props.connection.send('{"for":"auction","filter":"'+this.state.filterValue+'"}');
	}

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
    }

	handleBidCancel() {
	    this.setState({bidDialogOpen: false});
	}
	handleBidSubmit(){
		//var deleteURL = host+"/item?id="+this.state.id;
        //axios.delete(deleteURL).then(function(result){});
        this.setState({bidDialogOpen:false});
	}


    // handle row interaction
    handleCellClick(rowNum,columnNum) {
        var _this = this;
        console.log(columnNum);
        if (columnNum===6) {
        	console.log(this.props.auction[rowNum]);
        	this.setState({id:this.props.auction[rowNum].id});
        	this.setState({name:this.props.auction[rowNum].name});
        	this.setState({bidDialogOpen:true});
        }
    }

    formatStartDate(d) {
    	var dateFormat = require('dateformat');
    	return dateFormat(d, "dddd, mmmm dS");
    }

    handleInputChange(e) {
        let value = e.target.value;
		if (e.target.id==="credits") this.setState({creditsToBid:value});
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
					title={'Are you sure you want to bid on '+this.state.name+'?'}
					modal={true}
					open={this.state.bidDialogOpen}
				>
	              <TextField hintText="How Many Credits" id="credits" type="number" value={this.state.creditsToBid} onChange={this.handleInputChange} /><br />
					<FlatButton label="No" primary={true} onTouchTap={this.handleBidCancel}/>
					<FlatButton label="Yes" primary={false} onTouchTap={this.handleBidSubmit}/>
				</Dialog>

                <FloatingActionButton style={fabStyle} onTouchTap={() => { this.onAddHandler(); }}><ContentAdd /></FloatingActionButton>
               	<TextField style={{padding: 15, margin: 15}} hintText="Item Filter" floatingLabelText="Item Filter" onChange={this.filter} />
	            <Table onCellClick={this.handleCellClick}>
	                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
	                        <TableRow>
	                        <TableHeaderColumn>Name</TableHeaderColumn>
	                        <TableHeaderColumn>Min. Bid</TableHeaderColumn>
	                        <TableHeaderColumn>Buyout</TableHeaderColumn>
	                        <TableHeaderColumn>Owner</TableHeaderColumn>
	                        <TableHeaderColumn>Current Bid</TableHeaderColumn>
	                        <TableHeaderColumn></TableHeaderColumn>
	                      </TableRow>
	                    </TableHeader>

		               <TableBody stripedRows={false} displayRowCheckbox={false}>
						{this.props.auction.map(function(item) {
							return(

		                         <TableRow key={item.id}>
		                            <TableRowColumn><Chip><Avatar src={item.thumb}/>{item.name}</Chip></TableRowColumn>
		                            <TableRowColumn>{item.min_bid}</TableRowColumn>
		                            <TableRowColumn>{item.buyout}</TableRowColumn>
		                            <TableRowColumn>{item.owner}</TableRowColumn>
		                            <TableRowColumn>{item.current_bid}</TableRowColumn>
		                            <TableRowColumn><IconButton><ActionBid /></IconButton></TableRowColumn>
		                        </TableRow>


							);
						})}

		                </TableBody>


	                </Table>
            </div>
        )
    }
}