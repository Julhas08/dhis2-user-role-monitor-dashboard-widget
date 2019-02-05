import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class UserInfoModal extends React.Component {
  state = {
    open: this.props.open,
    fetchOptions: this.props.fetchOptions,
    users: []
  };

  handleClickOpen = () => {
    this.setState({ open: this.props.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
        //console.log("this.props.baseURL: ",this.props.baseURL);
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
        getUserRole(this.props.baseURL+"api/userRoles/"+this.props.roleId, this.props.fetchOptions).then(resUserRole => {
          //console.log("Test..",resUserRole);
          let allUsers     = resUserRole.users;
          let i;  
          let usersArray = [];
            if(allUsers.length >=1 ){
              for (i in allUsers) {
                let userUniqueid = resUserRole.users[i].id;
                usersArray.push(userUniqueid);
              }
              
              getUsers(this.props.baseURL+"api/users.json?filter=id:in:["+usersArray+"]&fields=:all&paging=false", this.props.fetchOptions).then(responseUserInfo => {
                  let responseIndividualInfoString = responseUserInfo.users;
                  this.setState({
                    users: responseIndividualInfoString
                  });
                  console.log("responseIndividualInfoString: ",responseIndividualInfoString);
              });  

            }
          //console.log("allUsers: ", allUsers);          
        });
        //console.log("this.props.fetchOptions: ", this.props.fetchOptions);
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"All Users"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">           

              <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Full Name</TableCell>
                  <TableCell align="right">User UID</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Created Date</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.users.map(row => (
                  <TableRow key={row.id}>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.created}</TableCell>
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

export default UserInfoModal;