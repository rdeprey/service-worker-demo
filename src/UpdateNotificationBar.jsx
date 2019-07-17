import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default class UpdateNotificationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.open
        });
    }

    onClose = () => {
        this.setState({
            open: false
        });
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                >
                    <SnackbarContent
                    message={
                        <span id="client-snackbar">{this.props.message.title}<br />{this.props.message.body}</span>
                    }
                    action={[
                        <IconButton key="close" color="inherit" onClick={this.onClose}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                    />
                </Snackbar>
            </div>
          );
    }
}