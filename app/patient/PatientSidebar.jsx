
import { Meteor } from 'meteor/meteor';
import React, { memo, useState, useEffect, useCallback } from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Session } from 'meteor/session';

import { withStyles } from '@material-ui/core/styles';

import { get } from 'lodash';
import { Link, NavLink } from "react-router-dom";

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemLink from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';

import { GoGraph } from 'react-icons/go';
import { GiPieChart } from 'react-icons/gi';
import { IoIosGitNetwork } from 'react-icons/io';
import { FiSun} from 'react-icons/fi';
import { GiCrossedAirFlows} from 'react-icons/gi';
import { IoMdGrid} from 'react-icons/io';
import { FiBarChart2} from 'react-icons/fi';
import { GiLifeBar } from 'react-icons/gi';
import { IoIosBarcode } from 'react-icons/io';
import { IoMdLogOut } from 'react-icons/io';
import { IoIosDocument} from 'react-icons/io';

const drawerWidth = 240;

const styles = theme => ({
  header: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  canvas: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingLeft: '73px'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: '#fafafa'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#fafafa'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
    backgroundColor: '#fafafa'
  },
  drawerIcons: {
    fontSize: '120%',
    paddingLeft: '8px',
    paddingRight: '2px'
  },
  drawerText: {
    textDecoration: 'none !important'
  },
  hide: {
    display: 'none',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  }
});




// export class PatientSidebar extends React.Component {
//   getMeteorData() {
//     let data = {
//       style: {
//         position: 'fixed',
//         top: '0px',
//         width: '100%',
//         display: 'flex',
//         alignItems: 'center',
//         padding: '0 2.4rem',
//         opacity: Session.get('globalOpacity')
//       },
//       listItem: {
//         display: 'inline-block',
//         position: 'relative'
//       },
//       indexRoute: '/'
//     };

//     return data;
//   }

//   handleLogout() {
//     console.log("handleLogout.bind(this)", props);
//     Meteor.logout();
//     if(props.history){
//       props.history.replace('/signin')
//     }
//   }


//   render () {
    
    
//   }
// }
// ReactMixin(PatientSidebar.prototype, ReactMeteorData);


export function PatientSidebar(props){

  console.log('PatientSidebar.props', props)


  function openPage(url){
    console.log('PatientSidebar.openPage()', url)
    props.history.replace(url)
  }
  function handleLogout(){
    console.log('handleLogout')
  }
  
  //----------------------------------------------------------------------
  // Dynamic Modules
  // Pick up any dynamic routes that are specified in packages, and include them
  let dynamicModules = [];
  Object.keys(Package).forEach(function(packageName){
    if(Package[packageName].SidebarElements){
      // we try to build up a route from what's specified in the package
      Package[packageName].SidebarElements.forEach(function(element){
        dynamicModules.push(element);      
      });    
    }
  }); 

  console.log('dynamicModules', dynamicModules);

  //----------------------------------------------------------------------
  // FHIR Resources
    
    var fhirResources = [];
    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.FhirResources')){
      if(!['iPhone'].includes(window.navigator.platform)){
        
        fhirResources.push(
          <ListItem id='fhirResourcesItem' key='fhirResourcesItem' button onClick={function(){ openPage('/fhir-resources-index'); }} >
            <ListItemIcon >
              <IoIosDocument className={props.classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary='FHIR Resources' className={props.classes.drawerText}  />
          </ListItem>
        );

        fhirResources.push(<Divider key='hra' />);
      }
    }

    //----------------------------------------------------------------------
    // Dynamic Modules  

    var dynamicElements = [];

    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.DynamicModules')){
      dynamicModules.map(function(element, index){ 

        // the excludes array will hide routes
        if(!get(Meteor, 'settings.public.defaults.sidebar.hidden', []).includes(element.to)){
          dynamicElements.push(
            <ListItem key={index} button onClick={function(){ openPage(element.to); }} >
              <ListItemIcon style={{paddingLeft: '10px'}}>
                { element.icon }
              </ListItemIcon>
              <ListItemText primary={element.primaryText} className={props.classes.drawerText}  />
            </ListItem>
          );
        }
      });
      dynamicElements.push(<Divider key="dynamic-modules-hr" />);
    }


    return(
      <div id='patientSidebar'>

          <div id='patientDynamicElements'>
           { dynamicElements }   
          </div>

          <Divider />

          { fhirResources }         
          <Divider />
        
          <ListItem id='themingItem' key='themingItem' button onClick={function(){ openPage('/theming'); }} >
            <ListItemIcon >
              <IoIosDocument className={props.classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Theming" className={props.classes.drawerText}  />
          </ListItem>

          <ListItem id='aboutItem' key='aboutItem' button  >
            <ListItemIcon >
              <IoIosDocument className={props.classes.drawerIcons} onClick={function(){ openPage('/about'); }} />
            </ListItemIcon>
            <ListItemText primary="About" className={props.classes.drawerText}  />
          </ListItem>

          <ListItem id='privacyItem' key='privacyItem' button onClick={function(){ openPage('/privacy'); }} >
            <ListItemIcon >
              <IoIosDocument className={props.classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Privacy" className={props.classes.drawerText}  />
          </ListItem>

          <ListItem id='termsItem' key='termsItem' button onClick={function(){ openPage('/terms-and-conditions'); }} >
            <ListItemIcon >
              <IoIosDocument className={props.classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Terms and Conditions" className={props.classes.drawerText}  />
          </ListItem>

          <ListItem id='logoutMenuItem' key='logoutMenuItem' button onClick={function(){ openPage('/signin'); }} >
            <ListItemIcon >
              <IoMdLogOut className={props.classes.drawerIcons} />
            </ListItemIcon>
            <ListItemText primary="Logout" className={props.classes.drawerText} onClick={function(){ handleLogout(); }} />
          </ListItem>

      </div>
    );
}

export default withStyles(styles, { withTheme: true })(PatientSidebar);