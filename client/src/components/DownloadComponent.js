import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


import download from '../actions/download';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        padding: theme.spacing(1)
    },
    contentHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    cover: {
        width: '100%',
        height: '100%'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    green: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[700],
        },
    },
    red: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
          backgroundColor: red[700],
        },
    },
}));

const DownloadComponent = ({meta, token, removeComponent}) => {

    let { title, thumbnail, description } = meta;
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const onDownloadClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { response, error } = await download(token);
        setLoading(false);

        if(error) {
            console.log(error);
            return;
        }

        const filename = title + '.mp3';

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: 'audio/mp3' });
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        removeComponent();
    }

    return(
        <Card className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <img
                        className={classes.cover}
                        src={thumbnail}
                        title={title}
                        alt="thumbnail"
                    />
                </Grid>
                <Grid item xs={8}>
                    <div className={classes.details}>
                        <div className={classes.content}>
                            <div className={classes.contentHeader}>
                                <Typography component="h6" variant="h6" noWrap>
                                    {title}
                                </Typography>
                                <Button
                                    variant="contained" 
                                    className={classes.red}
                                    size="small"
                                    onClick={removeComponent}
                                >
                                    Close
                                </Button>
                            </div>
                            <Typography variant="subtitle2" color="textSecondary">
                                {description}
                            </Typography>
                        </div>
                        {
                            !meta.error ? 
                            <div className={classes.controls}>
                                <Button 
                                    variant="contained" 
                                    className={classes.green}
                                    onClick={onDownloadClick}
                                    id="download-button"
                                    size="small"
                                >
                                    { loading ? 'Downloading...' : 'Download' }
                                </Button>
                            </div> : null
                        }
                    </div>
                </Grid>
            </Grid>
            
        </Card>
    );
};

export default DownloadComponent;