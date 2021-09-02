import React from 'react';
import {SQL} from "./DatabaseController";
import * as CommunicationController from './CommunicationController';
import * as TaskManager from "expo-task-manager";
import * as Location from 'expo-location';


export const JoinEvent = (eventName, user) => {
    return new Promise((resolve, reject) => {
        var res;
        //console.log(eventName);
        //console.log(user.data.token);
        
        CommunicationController.JoinEvent(eventName, user.data.token).then((json) => {
            res = json;
            if(res.error != null){
                resolve(res);
            }else{
                SQL.JoinEvent(res.eventData.id,res.eventData.name,res.eventData.description,JSON.stringify(res.eventData.map), res.eventData.created_at, res.user[0].pivot.role, res.eventData.updated_at, res.eventData.status);
            
                //SQL.GetEvent().then((value) => {console.log(value)});
                if(typeof res.eventData != "undefined")
                {
                    eventData = res.eventData;
                    eventData.role = res.user[0].pivot.role;
                    resolve(eventData);
                }
                else{
                    eventData = {
                        error: "Event not found! Check event name.",
                    }
                    resolve(eventData);
                }
            }
        }).catch(e => console.log(e));
 });}

export const LeaveEvent = () => {
    return new Promise((resolve, reject) => {
        
        //check data upload time
        //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        // When safe to delete data
        SQL.ClearEventData();
        SQL.ClearLocationData();
        
        //Check if DB is cleared
        //SQL.GetEvent().then((value) => {console.log(value)});
        
        resolve();

        }).catch(e => console.log(e));
    
}

export const UserEvents = (user_id, token) => {
    return new Promise((resolve, reject) => {
        CommunicationController.UserEvents(user_id, token).then((json) => {
            resolve(json);
        }).catch(e => console.log(e));
    });
}

export const UserEventData = (user_id,event_id, token) => {
    return new Promise((resolve, reject) => {
        CommunicationController.UserEventData(user_id,event_id, token).then((json) => {
            resolve(json);
        }).catch(e => console.log(e));
    });
}

export const EndEvent = (event_id, token) => {
    return new Promise((resolve, reject) => {
        CommunicationController.EndEvent(event_id, token).then((json) => {
            resolve(json);
        }).catch(e => console.log(e));
    });
}

 export const LogoutUser = () => {
    SQL.LogoutUser();
 };


 export const ProcessLocation = async (location, toSend, userId, token) => {
    
    var dblocation = JSON.stringify(location);
    //console.log(dblocation);
    SQL.SaveLocation(dblocation);

    var eventData = await SQL.GetEvent();
    
    let lastLocID = eventData[0].lastLocationSent;
    return new Promise((resolve, reject) => {
        if(toSend){
            SQL.GetLocations(lastLocID).then((loc) => {
                //console.log(loc);
                SQL.SetLastLocation(loc[0].id);
                CommunicationController.SendLocations(loc, userId, eventData[0].id,token).then((json) => {    
                    //console.log(json);
                }).catch(e => console.log(e));

                resolve();
            }).catch(e => console.log(e));
        }
        else{
            resolve();
        }
    });
 }

 export const GetEventData = async (user_id, token) => {
    
    var eventData = await SQL.GetEvent();
    //console.log(eventData);
    
    return new Promise((resolve, reject) => {
        //var eventchanged = false;
        var role = eventData[0].role;
        CommunicationController.GetEventData(eventData[0].id,token).then((json) => {    
            //console.log(json);
            
            json=JSON.parse(json);
            
            //Reikia update padaryti ant zemelapio.
            //eventchanged = true;
            for(var i=0 ; i< json.users.length; i++)
            {
                if(json.users[i].id == user_id){
                    role = json.users[i].role;
                }
            }

            SQL.UpdateEvent(json.eventData.name, json.eventData.description, eventData[0].map, json.eventData.updated_at,role,json.eventData.status );
            //SQL.GetEvent().then((value) => {console.log(value)});
            resolve(json, true, role);
        }).catch(e => console.log(e));
    });
 }

 export const EditUserRole = async (token, user, role) => {
    var eventData = await SQL.GetEvent();
    var r = +role;
    var users = [{
        id: user.id,
        role: r,
    }];
    
    return new Promise((resolve, reject) => {

        CommunicationController.EditUserRole(eventData[0].id,token, users).then((json) => {    
            //console.log(json);
            resolve(json);
        }).catch(e => console.log(e));
    });
 }
