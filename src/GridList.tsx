import React, { useEffect, useState } from 'react';
import PlaceHolder from './images/ice-cream.svg';
import './App.css';
import { bimap, fold, Either, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar, IconButton, Typography, Divider, createMuiTheme, ThemeProvider, useMediaQuery } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { from } from 'rxjs';

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'scroll',
        backgroundColor: theme.palette.background.paper,
        width: '100%'
    },
    gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '0.5em',
        marginBottom: '0.5em',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',

    },
    title: {
        color: 'white',
        margin: '0 0 0 0'
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    image: {
        height: '100%',
        width: '100%',
        objectFit: 'cover'

    },
    skeleton: {
        height: '100%'
    },
    section: {
        marginBottom: '3em'
    },
    divider: {
        marginBottom: '1em'
    },
    tile: {
        width: '150px',
        height: '150px'
    }
}));

export default function SingleLineGridList(icecreams: string[]) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {
                _.chunk(icecreams, 10).map((chunk, idx)=> (<Chunk key={idx} icecreams={chunk} />)  )
            }
        </div>
    );
}
interface ChunkProps {
    icecreams: string[];
}
function Chunk({icecreams}: ChunkProps) {
    const classes = useStyles();

    return (
        <div className={classes.gridList} >
            {icecreams.map((icecream) => (
                <GridListTile component="div" key={icecream} className={classes.tile}>
                    <IcecreamImage name={icecream}></IcecreamImage>
                    <GridListTileBar
                        title={icecream}
                        classes={{
                            root: classes.titleBar,
                            title: classes.title,
                        }}
                        actionIcon={null}
                    />
                </GridListTile>
            ))}
        </div>
    )
}

interface IcecreamImageProps {
    name: string
}
function IcecreamImage({ name }: IcecreamImageProps) {
    const classes = useStyles();

    const [src, setSrc] = useState<Either<null, string>>(left(null))//((<Skeleton variant="rect" className={classes.skeleton}></Skeleton>))
    useEffect(() => {
        const subscription = from(import('./images/' + name + '.jpg')).subscribe({
            next(x) {
                setSrc(right(x.default))
            },
            error(e) {
                setSrc(right(PlaceHolder))
            }
        });
        return () => {
            subscription.unsubscribe();
        }
    }, [])
    return pipe(src, fold(
        l => ((<Skeleton variant="rect" className={classes.skeleton}></Skeleton>)),
        r => (<img src={r} alt={name} className={classes.image} />)
    ))
}
