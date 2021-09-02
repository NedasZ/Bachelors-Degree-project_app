import React from 'react';

const webURL = 'http://polar-hollows-20638.herokuapp.com';

export const LoginUser = async (email, password) => {
    let success = await fetch(webURL.concat('/api/login'), {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    
    return await success.json();    
 };

 export const RegisterUser = async (name, email, password, c_password) => {
    let success = await fetch(webURL.concat('/api/register'), {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            c_password: c_password
        })
    });
    
    return await success.json();    
 };


 export const JoinEvent = async (eventName, token) => {
     //console.log(webURL.concat('/api/event/join/'.concat(eventName)));
     //console.log('Bearer '.concat(token));
    let success = await fetch(webURL.concat('/api/event/join/'.concat(eventName)), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Bearer '.concat(token),
        }
    });
    
    return await success.json();    
 };

 export const UserEvents = async (user_id, token) => {
    let success = await fetch(webURL.concat('/api/userEvents/').concat(user_id), {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Bearer '.concat(token),
        }
    });
    
    return await success.text();    
 };
 
 export const UserEventData = async (user_id,event_id, token) => {
    let success = await fetch(webURL.concat('/api/userEvents/').concat(user_id).concat('/').concat(event_id), {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Bearer '.concat(token),
        }
    });
    
    return await success.text();    
 };

 export const SendLocations = async (locations, userID, eventID, token) => {
   let success = await fetch(webURL.concat('/api/event/saveLocation'), {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Bearer '.concat(token),
        },
        body: JSON.stringify({
        event_id: eventID,
        user_id: userID,
        locations: JSON.stringify(locations)
    })
   });
   
   return await success.text();    
};  

export const GetEventData = async (eventID, token) => {
    let success = await fetch(webURL.concat('/api/event/'.concat(eventID)), {
         method: 'GET',
         headers: {
             'Accept': '*/*',
             'Content-Type': 'application/json',
             'Connection': 'keep-alive',
             'Authorization': 'Bearer '.concat(token),
         }   
    });
    
    return await success.text();    
 };

 export const EditUserRole = async (eventID, token, users) => {
    let success = await fetch(webURL.concat('/api/event/'.concat(eventID).concat('/users')), {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Bearer '.concat(token),
        },
        body: JSON.stringify({
            users: users,
        })
    });
    
    return await success.json();    
 };

 export const EndEvent = async (event_id,token) => {
    let success = await fetch(webURL.concat('/api/event/'.concat(event_id).concat('/end')), {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Bearer '.concat(token),
        }   
   });
   
   return await success.text();    
 }