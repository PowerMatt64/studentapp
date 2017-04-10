import React from 'react';
import Students from './Students';
import Items from './Items';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ActionExit from 'material-ui/svg-icons/action/exit-to-app';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import FontIcon from 'material-ui/FontIcon';
import ReactDOM from 'react-dom';



//const host = "";
const host = "http://localhost:8080";

export default class Main extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
			open: false
        }
    }

    // handle realtime updates / component mount
    componentDidMount() {
		// default to students view
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

    render() {
		var _this = this;
        const contentStyle = { display:'none', transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
        if (this.state.open) {
            contentStyle.marginLeft = 256;
        }

        return (
            <div>

                <AppBar title="Cactus Auction House" onLeftIconButtonTouchTap={this.handleHamburgerMenuClick.bind(this)}
                			iconElementRight={<IconButton href="/logout" tooltip="Logout"><ActionExit /></IconButton>}/>


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