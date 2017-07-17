import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import uuid from 'uuid';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionEdit from 'material-ui/svg-icons/image/edit';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Unsplash, { toJson } from 'unsplash-js';
import {Tabs, Tab} from 'material-ui/Tabs';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import PhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import {GridList, GridTile} from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import * as firebase from 'firebase';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';

//const host = "";
const host = "/StudentApp";
const uuidv4 = require('uuid/v4');
const unsplash = new Unsplash({
  applicationId: "9e002592f3dfdce28a4578101cefa875f927053c5222d8d93ab33d47d81fafac",
  secret: "41042b92830f69b28ee6596de2b4e1d893891426254608f064e02178749dd2d8",
  callbackUrl: "http://nw.fourpirates.com/StudentApp/auth/unsplash/callback"
});

export default class Items extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            addDialogOpen:false,
            changeImageDialog:false,
            confirmDialogOpen:false,
            title:'Add Item',
            name:'',
            minBid:'',
            buyout:'',
            id:'',
			      filterValue:'',
            doneTypingInterval: 200,
            typingTimer:null,
            imageSearchQuery:'',
            tileData: [],
            img:'',
            thumb:'',
            endDateDisabled:false,
            endTimeDisabled:false,
            currentTab:'GeneralTab',
            endDate:new Date(),
            firstComeFirstServe:false
        }

        this.handleImgCancel = this.handleImgCancel.bind(this);
        this.handleImgSubmit = this.handleImgSubmit.bind(this);

        this.handleFCFSToggle = this.handleFCFSToggle.bind(this);



    	this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleInputChange = this.handleInputChange.bind(this);
    	this.handleEndDateInputChange = this.handleEndDateInputChange.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.formatEndDate = this.formatEndDate.bind(this);
        this.getEndDateForTable = this.getEndDateForTable.bind(this);
        this.formatBoolean = this.formatBoolean.bind(this);
    	this.filter = this.filter.bind(this);
    	this.performFilter = this.performFilter.bind(this);
    	this.handleImageSearchChange = this.handleImageSearchChange.bind(this);
    	this.handleImageKeyPress = this.handleImageKeyPress.bind(this);
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
			this.props.connection.send('{"for":"items","filter":"'+this.state.filterValue+'"}');
	}

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
    }

    // handle new item
	onAddHandler() {
		this.setState({title:'Add Item'});
		this.setState({name:''});
		this.setState({minBid:''});
		this.setState({buyout:''});
		this.setState({endDate:new Date()});
    this.setState({firstComeFirstServe:false});
		this.setState({id:uuidv4()});
 		this.setState({addDialogOpen: true});
	}

  handleImgSubmit() {

    firebase.database().ref('items/'+this.state.id).update({
              img:this.state.img
    });

    this.setState({changeImageDialog: false});
  }
  handleImgCancel() {
    this.setState({changeImageDialog: false});
  }

	handleCancel() {
	    this.setState({addDialogOpen: false});
	}
	handleConfirmCancel() {
	    this.setState({confirmDialogOpen: false});
	}
	handleSubmit(e) {
        var _this = this;
        if (!this.state.buyout) this.setState({buyout:0});
        if (!this.state.minBid) this.setState({minBid:0});
        var dateString = this.formatEndDate(Date());
        if (this.state.endDate) {
          dateString = this.formatEndDate(this.state.endDate);
        }

        firebase.database().ref('items/'+this.state.id).update({
                  id:this.state.id,
  				        name:this.state.name,
  				        minBid:this.state.minBid,
                  buyout:this.state.buyout,
                  firstComeFirstServe:this.state.firstComeFirstServe,
                  endDate:this.state.endDate
        });
	    this.setState({addDialogOpen: false});
  }
	handleConfirmSubmit(){

    var itemsRef = firebase.database().ref('items/'+this.state.id);
    itemsRef.remove();
    this.setState({confirmDialogOpen:false});
	}
	handleEndDateInputChange(e,d) {
		this.setState({endDate:d});
	}
	handleInputChange(e,d) {
      let value = e.target.value;
      if (e.target.id==="name") this.setState({name:value});
      if (e.target.id==="minBid") this.setState({minBid:value});
      if (e.target.id==="buyout") this.setState({buyout:value});
  }
	handleImageSearchChange(e,d) {
        let value = e.target.value;
        this.setState({imageSearchQuery:value});
	}
	handleImageKeyPress(event) {
	  if (event.charCode === 13) {
		event.preventDefault();

		this.setState({tileData:[]});

        unsplash.photos.searchPhotos(this.state.imageSearchQuery, [], 1, 15)
        	.then(toJson)
			.then(json => {

			var newTileData = [];
			var i = 0;
			for (i = 0;i<json.length; i++) {

				newTileData.push(
					{
						img:json[i].urls.small,
						thumbnail:json[i].urls.thumb,
						title:this.state.imageSearchQuery,
						author:json[i].user.name,
						author_link:json[i].user.links.html
					}
				);
			}
			this.setState({tileData:newTileData});
  		});

	  }
	}

  handleFCFSToggle(e,isInputChecked) {
    if (isInputChecked) {
      this.setState({endDateDisabled:true});
      this.setState({endTimeDisabled:true});
      this.setState({firstComeFirstServe:true});
    } else {
      this.setState({endDateDisabled:false});
      this.setState({endTimeDisabled:false});
      this.setState({firstComeFirstServe:false});
    }

  }

	setPicture(tile) {
		this.setState({img:tile.img});
		this.setState({thumb:tile.thumbnail});

		var newTileData = [];
		newTileData.push(tile);
		this.setState({tileData:newTileData});
	}

    // handle row interaction
    handleCellClick(rowNum,columnNum) {
        var _this = this;
        if (columnNum===9) {
        	console.log(this.props.items[rowNum]);
        	this.setState({id:this.props.items[rowNum].id});
        	this.setState({name:this.props.items[rowNum].name});
        	this.setState({confirmDialogOpen:true});
        } else if (columnNum===8) {
        	this.setState({id:this.props.items[rowNum].id});
        	this.setState({changeImageDialog: true});
        } else if (columnNum===7) {
        	this.setState({title:'Edit Item'});
        	this.setState({name:this.props.items[rowNum].name});
        	this.setState({minBid:this.props.items[rowNum].minBid});
        	this.setState({buyout:this.props.items[rowNum].buyout});
        	this.setState({id:this.props.items[rowNum].id});

          if (this.props.items[rowNum].endDate)
        		this.setState({endDate:new Date(this.props.items[rowNum].endDate)});
        	else
        		this.setState({endDate:new Date()});
          if (this.props.items[rowNum].firstComeFirstServe) {
            this.setState({firstComeFirstServe:this.props.items[rowNum].firstComeFirstServe},()=>{
              this.handleFCFSToggle(null,this.state.firstComeFirstServe);
            });
          } else {
            this.setState({firstComeFirstServe:false});
          }
        	this.setState({addDialogOpen: true});


        }
    }

    formatEndDate(d) {
    	var dateFormat = require('dateformat');
    	return dateFormat(d, "mmmm dd, yyyy 'at' h:MM:ss TT");
    }
    getEndDateForTable(d,fcfs) {
        if (fcfs)
          return "";
        else
          return this.formatEndDate(d);
    }
    formatBoolean(fcfs) {
      if (fcfs)
        return <Checkbox disabled={true} checked={true}/>;
      else
        return "";
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

		const gridList = {
		    width: 500,
		    height: 450,
		    overflowY: 'auto',
  		};
      const dialogContentStyle = {
        width: '100%',
        maxWidth: 'none',
      };

        return (
            <div>

            <Dialog modal={true} open={this.state.addDialogOpen} autoScrollBodyContent={true} >
              <AppBar title={this.state.title} showMenuIconButton={false}/>
              <table>
                <tbody>
                  <tr>
                    <td colSpan="2"><TextField hintText="Name" floatingLabelText="Name" fullWidth={true} multiLine={true} id="name" defaultValue={this.state.name} onChange={this.handleInputChange}/></td>
                  </tr>
                  <tr>
                    <td><TextField hintText="Minimum Bid" floatingLabelText="Minimum Bid" id="minBid" type="number" defaultValue={this.state.minBid} onChange={this.handleInputChange} /></td>
						        <td><TextField hintText="Buyout" floatingLabelText="Buyout" id="buyout" type="number" defaultValue={this.state.buyout} onChange={this.handleInputChange} /></td>
                  </tr>
                  <tr>
                    <td>
                      <Toggle label="First come, first serve" toggled={this.state.firstComeFirstServe} labelPosition="right" onToggle={this.handleFCFSToggle}/>
                    </td>
                  </tr>
                  <tr>
                    <td><DatePicker hintText="End Date" disabled={this.state.endDateDisabled} mode="landscape" floatingLabelText="End Date" id="endDate" defaultDate={this.state.endDate} onChange={this.handleEndDateInputChange} /></td>
                    <td><TimePicker hintText="End Time" disabled={this.state.endTimeDisabled} mode="landscape" floatingLabelText="End Time" id="endTime" defaultTime={this.state.endDate} onChange={this.handleEndDateInputChange} /></td>
                  </tr>
                  <tr>
                    <td>
                      <FlatButton label="Cancel" primary={true} onTouchTap={this.handleCancel}/>
            				  <FlatButton label="Submit" primary={false} onTouchTap={this.handleSubmit}/>
                    </td>
                  </tr>
                </tbody>
              </table>
        	</Dialog>

        <Dialog modal={true} open={this.state.changeImageDialog} autoScrollBodyContent={true}>
          <AppBar title={"Change Image"} showMenuIconButton={false}/>
          <TextField hintText="Search" floatingLabelText="Search For Image" fullWidth={true} multiLine={false} id="image_search" onKeyPress={this.handleImageKeyPress} onChange={this.handleImageSearchChange}/><br/>
          <GridList cellHeight={180} >
            {this.state.tileData.map((tile) => (

            <GridTile key={tile.img} title={tile.title}
                subtitle={<span>by <a href={tile.author_link + "?utm_source=NW Auction&utm_medium=referral&utm_campaign=api-credit"} target="_blank"><b>{tile.author}</b></a> / <a href="https://unsplash.com/" target="_blank"><b>Unsplash</b></a></span>}
                onClick={this.setPicture.bind(this, tile)} >
              <img src={tile.img} />
            </GridTile>

          ))}
          </GridList>
          <FlatButton label="Cancel" primary={true} onTouchTap={this.handleImgCancel}/>
          <FlatButton label="Submit" primary={false} onTouchTap={this.handleImgSubmit}/>
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
               	<TextField style={{padding: 15, margin: 15}} hintText="Item Filter" floatingLabelText="Item Filter" onChange={this.filter} />
	            <Table onCellClick={this.handleCellClick}>
	                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
	                        <TableRow>
	                        <TableHeaderColumn>Picture</TableHeaderColumn>
	                        <TableHeaderColumn>Name</TableHeaderColumn>
                  	      <TableHeaderColumn>Min. Bid</TableHeaderColumn>
	                        <TableHeaderColumn>Bid</TableHeaderColumn>
                          <TableHeaderColumn>Bidder</TableHeaderColumn>
                          <TableHeaderColumn>First</TableHeaderColumn>
	                        <TableHeaderColumn>End Date</TableHeaderColumn>
	                        <TableHeaderColumn>Edit</TableHeaderColumn>
	                        <TableHeaderColumn>Change Pic</TableHeaderColumn>
	                        <TableHeaderColumn>Remove</TableHeaderColumn>
        	              </TableRow>
	                    </TableHeader>

		               <TableBody stripedRows={false} displayRowCheckbox={false}>
						{this.props.items.map(function(item) {
							return(

		                         <TableRow key={item.id}>
		                            <TableRowColumn><Avatar src={item.img}/></TableRowColumn>
                                <TableRowColumn>{item.name}</TableRowColumn>
		                            <TableRowColumn>{item.minBid}</TableRowColumn>
		                            <TableRowColumn>{item.bid}</TableRowColumn>
                                <TableRowColumn>{item.bidder}</TableRowColumn>
                                <TableRowColumn>{_this.formatBoolean(item.firstComeFirstServe)}</TableRowColumn>
		                            <TableRowColumn>{_this.getEndDateForTable(item.endDate,item.firstComeFirstServe)}</TableRowColumn>
		                            <TableRowColumn><IconButton><ActionEdit /></IconButton></TableRowColumn>
                                <TableRowColumn><IconButton><PhotoLibrary /></IconButton></TableRowColumn>
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
