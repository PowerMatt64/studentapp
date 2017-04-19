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
import GoogleLogin from 'react-google-login';
import cookie from "react-cookie";
import axios from 'axios';

//const host = "";
const host = "http://localhost:8080";
const googleLoginStyle = { backgroundColor: "#e0e0e0", border:0 };


export default class Main extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
        	students: [],
        	items: [],
			open: false,
			isLoggedIn: false,
			displayName:null,
			photoURL:null,
			email:null,
			connection:null,
			accessToken:null
        }
        this.responseGoogleSuccess = this.responseGoogleSuccess.bind(this);
        this.responseGoogleFail = this.responseGoogleFail.bind(this);
        this.getConnection = this.getConnection.bind(this);
        this.logout = this.logout.bind(this);
    }

    // handle realtime updates / component mount
    componentDidMount() {
        var _this = this;
		
		var accessToken = cookie.load("access_token");
		if (accessToken) {
			axios.get(host+"/auth?at="+accessToken).then(function(result){
				if (result.data.iv===true) {
					_this.setState({isLoggedIn:true});
					_this.setState({displayName:cookie.load("name")});
					_this.setState({photoURL:cookie.load("image")});
					_this.setState({email:cookie.load("email")});
					_this.getConnection(accessToken);
					ReactDOM.findDOMNode(_this.refs.students).style.display='block';
				}
			});
			
		}
		
		if (this.state.isLoggedIn) {
			// default to students view
			ReactDOM.findDOMNode(this.refs.students).style.display='block';
		}
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

	getConnection(access_token) {
		var _this = this;
		
		_this.setState({accessToken:access_token});
		
        _this.state.connection = new WebSocket('ws://localhost:8080/studentws')
        _this.state.connection.onopen = evt => {
    		this.state.connection.send("{\"access_token\":\""+access_token+"\"}");
		}
		_this.state.connection.onmessage = evt => {
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
	
	responseGoogleSuccess(response) {
		var _this = this;

		this.setState({isLoggedIn:true});
		this.setState({displayName:response.getBasicProfile().getName()});
		this.setState({photoURL:response.getBasicProfile().getImageUrl()});
		this.setState({email:response.getBasicProfile().getEmail()});
		ReactDOM.findDOMNode(this.refs.students).style.display='block';


		cookie.save("access_token", response.getAuthResponse().access_token, {path: "/"});
		cookie.save("email", response.getBasicProfile().getEmail(), {path: "/"});
		cookie.save("image", response.getBasicProfile().getImageUrl(), {path: "/"});
		cookie.save("name", response.getBasicProfile().getName(), {path: "/"});
        
		_this.getConnection(response.getAuthResponse().access_token);

	
	}
	responseGoogleFail(response) {
		var _this = this;
		console.log(response);
	}
	
	logout(a) {
		var _this = this;
		_this.state.connection.send("{\"logout\":\""+_this.state.accessToken+"\"}");
		
		this.setState({isLoggedIn:false});
		ReactDOM.findDOMNode(this.refs.students).style.display='none';
		ReactDOM.findDOMNode(this.refs.items).style.display='none';
	}

    render() {
		var _this = this;

		let item;
		if (!this.state.isLoggedIn) {
			item = <GoogleLogin
							clientId="992910613462-4ormj99m607mer33f6k7qlrckoof05c6.apps.googleusercontent.com"
							buttonText="Login"
							style={googleLoginStyle}
							onSuccess={this.responseGoogleSuccess}
							onFailure={this.responseGoogleFail} >
									<IconButton tooltip="Login"><ActionFace /></IconButton>
						</GoogleLogin>

					;
		} else {
			item = <Chip style={{ margin: 'auto' }} onRequestDelete={this.logout}>
						<Avatar src={this.state.photoURL} size={40} />
						{this.state.displayName}
					</Chip>;
		}

        const contentStyle = { display:'none', transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
        if (this.state.open) {
            contentStyle.marginLeft = 256;
        }

        return (
            <div>

                <AppBar title="Cactus Auction House"
                		onLeftIconButtonTouchTap={this.handleHamburgerMenuClick.bind(this)}
                		showMenuIconButton={this.state.isLoggedIn}
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