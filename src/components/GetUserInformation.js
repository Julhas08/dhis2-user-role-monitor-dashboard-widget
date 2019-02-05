import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import UsersInfoModal from './UsersInfoModal';
// Diaglo box
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Loader
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// Delete 
import DeleteForeverIcon from '@material-ui/icons/Delete';
import EditOutlined from '@material-ui/icons/EditOutlined';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
   button: {
    margin: theme.spacing.unit,
  },
  placeholder: {
    height: 40,
  },
  input: {
    display: 'none',
  },
  icon: {
    cursor: 'pointer',
  } 
});
const baseURL = "https://play.dhis2.org/2.31dev/";
const fetchOptions = {
			  headers: {
			    Accept: 'application/json',
			    'Content-Type': 'application/json',
          Authorization: "Basic " + btoa("admin:district")   		    
			  }
			};
//const modal = document.querySelector('.modal');			
class GetUserInformation extends Component{
	constructor(){
		super();
		this.state = {
			dataRoles: [],
      open: false,
      users: [],
      loading: false,
      query: 'idle',
      superuser: "",
      memberSince: "",			
		}
	}
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  handleClickModalOpen = (roleId) => {

    this.setState({ open: true });
    this.setState(state => ({
      loading: !state.loading,
    }))
    // user Role information
    function getUserRole(URL,fetchOptions){      
      return new Promise( (resolve, reject) => {
        fetch(URL,fetchOptions) 
          .then(r => resolve(r.json()))
          .catch(err => reject(err));
        });              
           
    }
    function getUsers(URL,fetchOptions){      
      return new Promise( (resolve, reject) => {
        fetch(URL,fetchOptions) 
          .then(r => resolve(r.json()))
          .catch(err => reject(err));
        });              
           
    }
   getUserRole( baseURL+"api/userRoles/"+roleId, fetchOptions).then(resUserRole => {
          console.log("Test..",resUserRole);
          let allUsers     = resUserRole.users;
          let i;  
          let usersArray = [];
          
            if(allUsers.length >=1) {
              for (i in allUsers) {
                let userUniqueid = resUserRole.users[i].id;
                usersArray.push(userUniqueid);
              }
              
              getUsers(baseURL+"api/users.json?filter=id:in:["+usersArray+"]&fields=:all&paging=false", fetchOptions).then(responseUserInfo => {
                  let responseIndividualInfoString = responseUserInfo.users;
                  //console.log("responseUserInfo.users: ", responseUserInfo.users.username);
                  var d = new Date();
                  /*console.log("responseUserInfo.created: ",responseUserInfo.created);
                  d.setDate(d.getDate() - responseIndividualInfoString.created);
                  let memberSince = d.toLocaleString();*/
                  
                  this.setState({
                    users: responseIndividualInfoString,
                    memberSince: d.getDate()
                  });
                  this.setState(state => ({
                    loading: false,
                  }));
                  console.log("responseIndividualInfoString: ", responseIndividualInfoString);
              });  

            }
           
        });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
	render(){
      const { loading, query } = this.state;
      const { classes } = styles;
      let i=1;
      let j=1;
        function getAllRoles(URL){      
          return new Promise( (resolve, reject) => {
            fetch(URL,fetchOptions) 
              .then(r => resolve(r.json()))
              .catch(err => reject(err));
            });              
               
        }
        getAllRoles(baseURL+"api/userRoles.json?fields=:all&paging=false").then(resp => {
          this.setState({
              dataRoles: resp.userRoles
            });      	
        });
    
        console.log("Super user", this.state.dataRoles);
		return(

			<div> 
      
	      <Paper >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/N</TableCell>
                <TableCell>Role name</TableCell>
                <TableCell>Role UID</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>View Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.dataRoles.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell>{row.displayName}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  
                  <TableCell>{row.created}</TableCell>
                  <TableCell> 
                    <Button id={row.id} onClick={()=>this.handleClickModalOpen(row.id)} variant="contained" color="primary" className={styles.button}>
                      View Users
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth = {'md'}
        >
          <DialogTitle id="alert-dialog-title">{"All Users"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">           
            <Fade
              in={loading}
              style={{
                transitionDelay: loading ? '800ms' : '0ms',
              }}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Usename</TableCell>
                  <TableCell>User UID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Member Since</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Last Password Updated</TableCell>
                  <TableCell>Last Checked Interpretation</TableCell>
                  <TableCell>Update</TableCell>
                  <TableCell>Delete</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.users.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{j++}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.userCredentials.username}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.created}</TableCell>
                    <TableCell>{ (row.created)-(this.state.memberSince) }</TableCell>
                    <TableCell>{row.userCredentials.lastLogin}</TableCell>
                    <TableCell>{row.userCredentials.lastUpdated}</TableCell>
                    <TableCell>{row.userCredentials.passwordLastUpdated}</TableCell>
                    <TableCell>{row.lastCheckedInterpretations}</TableCell>
                    
                    <TableCell><a href={baseURL+"dhis-web-user/index.html#/users/edit/"+row.id} target="_blank"><EditOutlined /></a></TableCell>
                    <TableCell><DeleteForeverIcon className={styles.icon} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>	
			</div> 
		);
	}

}


GetUserInformation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GetUserInformation);