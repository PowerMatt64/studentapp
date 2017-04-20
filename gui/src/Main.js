import React from 'react';
import Students from './Students';
import Items from './Items';
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
const host = "http://localhost:8080/StudentApp";


export default class Main extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
        	students: [],
        	items: [],
			open: false,
			displayName:null,
			photoURL:null,
			email:null,
			connection:null,
			firstName:null,
			lastName:null
        }
        this.getConnection = this.getConnection.bind(this);
    }
	

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
		
			axios.get(host+"/user.jsp").then(function(result){
				console.log(result.data);
					_this.setState({displayName:result.data.n});
					_this.setState({photoURL:result.data.i});
					_this.setState({email:result.data.e});
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
		ReactDOM.findDOMNode(this.refs.items).style.display='none';
		if (menu==='studentsMenu') ReactDOM.findDOMNode(this.refs.students).style.display='block';
		if (menu==='itemsMenu') ReactDOM.findDOMNode(this.refs.items).style.display='block';
		this.setState({open: false});
	}

	getConnection() {
		var _this = this;
		
        _this.state.connection = new WebSocket('ws://localhost:8080/StudentApp/studentws')
        _this.state.connection.onopen = evt => {
    		this.state.connection.send(
    				"{\"msg\":\"hello\"}");
		}
		_this.state.connection.onmessage = evt => {
			console.log("R/T Received",evt);
			var msg = JSON.parse(evt.data);
			if (msg.a==='students') {
				_this.setState({students: msg.items});
			} if (msg.a==='items') {
				_this.setState({items: msg.items});
			} else {
				console.log('r/t update');
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
					<Menu onChange={this.routeHandler.bind(this)}>
						<MenuItem value="studentsMenu" leftIcon={<FontIcon className="material-icons" >supervisor_account</FontIcon>}>Students</MenuItem>
						<MenuItem value="itemsMenu" leftIcon={<FontIcon className="material-icons" >whatshot</FontIcon>}>Auction Items</MenuItem>
                    </Menu>
                </Drawer>

				<div ref="students" style={contentStyle}><Students students={this.state.students}/></div>
				<div ref="items" style={contentStyle}><Items items={this.state.items}/></div>

            </div>
        )
    }
}
