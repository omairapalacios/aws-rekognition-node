import React from 'react'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

import { FileUpload } from '../components/FileUpload'

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '56.25%'
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  },
  container: {
    marginBottom: theme.spacing(10)
  }
}))

const SelectYourPictures = () => {
  const classes = useStyles({})

  return (
    <Container className={classes.container} maxWidth="md">
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Typography color="primary" component="h1" variant="h4" align="center" gutterBottom>
            My SMART BUCKET app
          </Typography>
          <Typography component="h5" variant="h5" gutterBottom>
            Start by uploading images to your Rekognition collection
          </Typography>
          <FileUpload />
        </Paper>
      </main>
    </Container>
  )
}

export default SelectYourPictures