import React from 'react';
import Students from './Students';
import Leaderboard from './Leaderboard';
import Items from './Items';
import Auction from './Auction';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import ActionExit from 'material-ui/svg-icons/action/exit-to-app';
import ActionFace from 'material-ui/svg-icons/action/face';
import Drawer from 'material-ui/Drawer';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import FontIcon from 'material-ui/FontIcon';
import ReactDOM from 'react-dom';
import axios from 'axios';


//const host = "";
const host = "/StudentApp";


export default class Main extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
        	students: [],
        	leaderboard: [],
        	items: [],
        	auction: [],
			open: false,
			displayName:null,
			photoURL:null,
			email:null,
			connection:null,
			firstName:null,
			credits:null,
			lastName:null
        }
        this.getConnection = this.getConnection.bind(this);
    }


    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;

		axios.get(host+"/user.jsp").then(function(result){
					_this.setState({displayName:result.data.n});
					_this.setState({photoURL:result.data.i});
					_this.setState({email:result.data.e});
					_this.setState({credits:result.data.c});
					_this.getConnection();
					ReactDOM.findDOMNode(_this.refs.students).style.display='block';
		});

		ReactDOM.findDOMNode(this.refs.students).style.display='block';
    }

    // handle menu
    handleHamburgerMenuClick() {
		this.setState({open: !this.state.open})
	}

	routeHandler(event, menu, obj) {
		ReactDOM.findDOMNode(this.refs.students).style.display='none';
		ReactDOM.findDOMNode(this.refs.leaderboard).style.display='none';
		ReactDOM.findDOMNode(this.refs.items).style.display='none';
		ReactDOM.findDOMNode(this.refs.auction).style.display='none';
		if (menu==='studentsMenu') ReactDOM.findDOMNode(this.refs.students).style.display='block';
		if (menu==='leaderboardMenu') ReactDOM.findDOMNode(this.refs.leaderboard).style.display='block';
		if (menu==='itemsMenu') ReactDOM.findDOMNode(this.refs.items).style.display='block';
		if (menu==='auctionMenu') ReactDOM.findDOMNode(this.refs.auction).style.display='block';
		this.setState({open: false});
	}

	getConnection() {
		var _this = this;
		var loc = window.location, new_uri;

		if (loc.protocol === "https:") {
		    new_uri = "wss:";
		} else {
		    new_uri = "ws:";
		}
		new_uri += "//" + loc.host;
		new_uri += loc.pathname + "studentws";

        _this.state.connection = new WebSocket(new_uri)
        _this.state.connection.onopen = evt => {
    		this.state.connection.send(
    				"{\"msg\":\"hello\"}");
		}
		_this.state.connection.onmessage = evt => {
			var msg = JSON.parse(evt.data);
			if (msg.a==='students') {
				_this.setState({students: msg.items});
			} else if (msg.a==='leaderboard') {
				_this.setState({leaderboard: msg.items});
			} else if (msg.a==='items') {
				_this.setState({items: msg.items});
			} else if (msg.a==='auction') {
				_this.setState({auction: msg.items});
			} else {
				console.log('unknown r/t update : ',evt);
			}
		}
	}

    render() {
		var _this = this;

		let item;
			item = <Chip style={{ margin: 'auto' }} >
						<Avatar src={this.state.photoURL} size={40} />
						{this.state.displayName}
					</Chip>;

        const contentStyle = { display:'none', transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
        if (this.state.open) {
            contentStyle.marginLeft = 256;
        }

        return (
            <div>

                <AppBar title="Cactus Auction House"
                		onLeftIconButtonTouchTap={this.handleHamburgerMenuClick.bind(this)}
                		showMenuIconButton={true}
                		>
                	{item}
				</AppBar>


				<Drawer open={this.state.open} docked={false}>
					<AppBar title="Menu" showMenuIconButton={false}/>
					<Menu onChange={this.routeHandler.bind(this)} disableAutoFocus={true}>
						<MenuItem value="studentsMenu" leftIcon={<FontIcon className="material-icons" >supervisor_account</FontIcon>}>Students</MenuItem>
						<MenuItem value="leaderboardMenu" leftIcon={<FontIcon className="material-icons" >format_list_numbered</FontIcon>}>Leaderboard</MenuItem>
						<MenuItem value="itemsMenu" leftIcon={<FontIcon className="material-icons" >whatshot</FontIcon>}>Auction Items</MenuItem>
						<MenuItem value="auctionMenu" leftIcon={<FontIcon className="material-icons" >account_balance</FontIcon>}>Auction</MenuItem>
                    </Menu>
                </Drawer>

				<div ref="students" style={contentStyle}><Students connection={this.state.connection} students={this.state.students}/></div>
				<div ref="leaderboard" style={contentStyle}><Leaderboard connection={this.state.connection} leaderboard={this.state.leaderboard}/></div>
				<div ref="items" style={contentStyle}><Items connection={this.state.connection} items={this.state.items}/></div>
				<div ref="auction" style={contentStyle}>
					<Auction email={this.state.email} connection={this.state.connection} auction={this.state.auction}/>
				</div>

            </div>
        )
    }
}
