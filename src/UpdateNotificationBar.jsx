import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function UpdateNotificationBar(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Snackbar
                open={open}
            >
                <SnackbarContent
                message={
                    <span id="client-snackbar">{props.message.title}<br />{props.message.body}</span>
                }
                action={[
                    <IconButton key="close" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>,
                ]}
                />
            </Snackbar>
        </div>
        );
}