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


//const host = "";
const host = "/StudentApp";

export default class Leaderboard extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
           
        }
    	
    }



   
    
    render() {
    	var _this = this;
		
		


        return (
            <div>


            
               

                <Table onCellClick={this.handleCellClick}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                        <TableHeaderColumn>Position</TableHeaderColumn>
                        <TableHeaderColumn>First Name</TableHeaderColumn>
                        <TableHeaderColumn>Last Name</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Grade</TableHeaderColumn>
                        
                      </TableRow>
                    </TableHeader>

               <TableBody stripedRows={false} displayRowCheckbox={false}>
				{_this.props.leaderboard.map(function(leaderboardItem) {
					return(

                         <TableRow key={leaderboardItem.id}>
                         	<TableRowColumn>{leaderboardItem.place}</TableRowColumn>
                            <TableRowColumn>{leaderboardItem.first_name}</TableRowColumn>
                            <TableRowColumn>{leaderboardItem.last_name}</TableRowColumn>
                            <TableRowColumn>{leaderboardItem.email}</TableRowColumn>
                            <TableRowColumn>{leaderboardItem.grade}</TableRowColumn>
                            
                        </TableRow>


					);
				})}

                </TableBody>


                </Table>
            </div>
        )
    }
}