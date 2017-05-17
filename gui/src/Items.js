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
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Unsplash, { toJson } from 'unsplash-js';
import {Tabs, Tab} from 'material-ui/Tabs';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import {GridList, GridTile} from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

//const host = "";
const host = "/StudentApp";
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
            confirmDialogOpen:false,
            title:'Add Item',
            name:'',
            min_bid:'',
            buyout:'',
            owner:'',
            id:'',
			filterValue:'',
            doneTypingInterval: 200,
            typingTimer:null,
            imageSearchQuery:'',
            tileData: [],
            picture:'',
            thumb:'',
            currentTab:'GeneralTab',
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
		this.setState({min_bid:''});
		this.setState({buyout:''});
		this.setState({thumb:''});
		this.setState({picture:''});
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
                thumb:this.state.thumb,
                picture:this.state.img,
                owner:this.state.owner,
                img:this.state.picture,
                thumb:this.state.thumb,
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

	setPicture(tile) {
		this.setState({picture:tile.img});
		this.setState({thumb:tile.thumbnail});

		var newTileData = [];
		newTileData.push(tile);
		this.setState({tileData:newTileData});
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

		const gridList = {
		    width: 500,
		    height: 450,
		    overflowY: 'auto',
  		};


        return (
            <div>

            <Dialog title={this.state.title} modal={true} open={this.state.addDialogOpen} >
            	<Tabs>
            		<Tab icon={<MapsPersonPin />} label="General" >
						<TextField hintText="Name" floatingLabelText="Name" fullWidth={true} multiLine={true} id="name" defaultValue={this.state.name} onChange={this.handleInputChange}/><br />
						<TextField hintText="Minimum Bid" floatingLabelText="Minumum Bid" id="min_bid" type="number" defaultValue={this.state.min_bid} onChange={this.handleInputChange} /><br />
						<TextField hintText="Buyout" floatingLabelText="Buyout" id="buyout" type="number" defaultValue={this.state.buyout} onChange={this.handleInputChange} /><br />
						<TextField disabled={true} hintText="Owner" floatingLabelText="Owner" id="owner" defaultValue={this.state.owner} onChange={this.handleInputChange} /><br />
						<DatePicker hintText="Start Date" mode="landscape" floatingLabelText="Start Date" id="start_date" defaultDate={this.state.start_date} onChange={this.handleStartDateInputChange} /><br />
	                </Tab>
					<Tab icon={<ImagePhotoLibrary />} label="Picture" >
						<TextField hintText="Search" floatingLabelText="Search" fullWidth={true} multiLine={false} id="image_search" onKeyPress={this.handleImageKeyPress} onChange={this.handleImageSearchChange}/><br />

						<GridList cellHeight={180} style={gridList}>
						{this.state.tileData.map((tile) => (

							<GridTile key={tile.img} title={tile.title}
								subtitle={<span>by <a href={tile.author_link} target="_blank"><b>{tile.author}</b></a></span>}
								onClick={this.setPicture.bind(this, tile)} >
								<img src={tile.img} />
							</GridTile>

						))}
						</GridList>

	                </Tab>
            	</Tabs>
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
               	<TextField style={{padding: 15, margin: 15}} hintText="Item Filter" floatingLabelText="Item Filter" onChange={this.filter} />
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
		                            <TableRowColumn><Chip><Avatar src={item.thumb}/>{item.name}</Chip></TableRowColumn>
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