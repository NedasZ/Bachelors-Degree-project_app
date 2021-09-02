import {SQL} from "./DatabaseController";
import * as CommunicationController from './CommunicationController';



export const LoginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        var res;
        var userData;
        CommunicationController.LoginUser(email, password).then((json) => {
            res = json;
            if(res.error != null){
                resolve(res);
            }else{
                console.log(res);
                SQL.LoginUser(email,res.success.name,res.success.userid,res.success.token);
                
                userData = {
                    name: res.success.name,
                    userid: res.success.userid,
                    token: res.success.token            
                }

                //SQL.GetUser().then((value) => {console.log(value)});
                resolve(userData);
            }
        }).catch(e => console.log(e));
    
    
 });}


//not finished
export const RegisterUser = (name, email, password, c_password) => {
    return new Promise((resolve, reject) => {
        var res;
        
        var userData;
        CommunicationController.RegisterUser(name, email, password, c_password).then((json) => {
            res = json;
            if(res.error != null){
                resolve(res);
            }else{
                SQL.LoginUser(email,name,res.success.userid,res.success.token);
            
                userData = {
                    name: res.success.name,
                    userid: res.success.userid,
                    token: res.success.token            
                }
    
                SQL.GetUser().then((value) => {console.log(value)});
                resolve(userData);
            }
        }).catch(e => console.log(e));
    });

}

 export const LogoutUser = () => {
    SQL.LogoutUser();
 };
