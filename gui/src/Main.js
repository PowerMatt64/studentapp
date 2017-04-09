import React from 'react';
import Students from './Students';
import AppBar from 'material-ui/AppBar';


//const host = "";
const host = "http://localhost:8080";

export default class Main extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
        }
    }

    // handle realtime updates / component mount
    componentDidMount() {
    }

    render() {

        return (
            <div>

                <AppBar title="Simple Student App" />
				<Students />

            </div>
        )
    }
}