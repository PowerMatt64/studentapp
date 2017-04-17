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



//const host = "";
const host = "http://localhost:8080";
const googleLoginStyle = { backgroundColor: "#e0e0e0", border:0 };

export default class Main extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
			open: false,
			isLoggedIn: false,
			displayName:null,
			photoURL:null,
			email:null
        }
        this.responseGoogleSuccess = this.responseGoogleSuccess.bind(this);
        this.responseGoogleFail = this.responseGoogleFail.bind(this);
    }

    // handle realtime updates / component mount
    componentDidMount() {

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

	responseGoogleSuccess(response) {
		console.log(response.getBasicProfile());
		this.setState({isLoggedIn:true});
		this.setState({displayName:response.getBasicProfile().getName()});
		this.setState({photoURL:response.getBasicProfile().getImageUrl()});
		this.setState({email:response.getBasicProfile().getEmail()});
		ReactDOM.findDOMNode(this.refs.students).style.display='block';
	}
	responseGoogleFail(response) {
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
			item = <Chip style={{ margin: 'auto' }} onRequestDelete={this.responseGoogleFail}>
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

				<div ref="students" style={contentStyle}><Students/></div>
				<div ref="items" style={contentStyle}><Items/></div>

            </div>
        )
    }
}