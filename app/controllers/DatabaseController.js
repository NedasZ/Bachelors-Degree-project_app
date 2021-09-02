import * as SQLite from 'expo-sqlite';
import React, { createContext, useContext, useState } from 'react';
//tables
const locationsTable = "locations";
const userTable = "user";
const liveEventTable = "LiveEvent";

const db = SQLite.openDatabase("O_APP");

// INITIALISE ALL TYPES OF STATE YOUR APP

//state of user context


export const UserContext = createContext();
// OUR STORE CONTAINS TWO VALUES
// STATE, WHICH HOLDS ALL SAVED DATA, AND
// DISPATCH, WHICH OFFERS A METHOD TO UPDATE OUR STATE
export const ContextProvider = ({ children }) => {

  const [data, setData] = useState({
    name: 'user',
    userid: 0,
    token: 0
  });
  return (
    <UserContext.Provider value={ {data,setData }}>{children}</UserContext.Provider>
  );
};


//
export class SQL {
  static InitDatabase() {
    // db.transaction(tx => {      
    //   tx.executeSql(
    //     `drop table ${userTable};`
    //   );
    // });
    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists ${userTable} (id integer primary key not null, token text, date text, email text, name text, userid integer);`
      );
    });
    // db.transaction(tx => {      
    //   tx.executeSql(
    //     `drop table ${liveEventTable};`
    //   );
    // });
    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists ${liveEventTable} (id integer primary key not null, name text, description text, map text, updated_at text, created_at text, role integer, lastLocationSent integer, status integer);`
      );
    });

//  db.transaction(tx => {      
//       tx.executeSql(
//         `drop table ${locationsTable};`
//       );
//     });
    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists ${locationsTable} (id integer primary key not null, location text, saved_at text);`
      );
    });


    return this.GetUser();
  }

  static LoginUser = (email,name,userid,token) => {
    db.transaction(
      tx => {
        tx.executeSql(`insert into ${userTable} (token, date, email, name, userid) values (?,?,?,?,?)`, [
          token,
          new Date().toUTCString(),
          email,
          name,
          userid
        ]);
      },
      null,
      null
    );

  };
  static JoinEvent = (id,name,description,map,created_at,role,updated_at,isLive) => {
    db.transaction(
      tx => {
        tx.executeSql(`insert into ${liveEventTable} (id, name, description, map, updated_at, created_at, role, lastLocationSent, status) values (?,?,?,?,?,?,?,?,?)`, [
          id,
          name,
          description,
          map,
          updated_at,
          created_at,
          role,
          0,
          isLive
        ]);
      },
      (error) => {console.log("event save failed"), console.log(error)},
      null
    );
  };



  static ClearEventData = () => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from ${liveEventTable}`);
      },
      null,
      null
    );

  };
  static SaveLocation = (location) => {
    db.transaction(
      tx => {
        tx.executeSql(`insert into ${locationsTable} (location, saved_at) values (?,?)`, [
          location,
          new Date().toUTCString(),
        ]);
      },
      (error) => {console.log("location save failed"), console.log(error)},
      null
    );
  };
  static ClearLocationData = () => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from ${locationsTable}`);
      },
      null,
      null
    );

  };

  static LogoutUser = () => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from ${userTable}`);
      },
      null,
      null
    );

  };
  static GetUser = () => {
    return new Promise((resolve, reject) => {
      db.transaction(async tx => {
        await tx.executeSql(
          `select * from ${userTable} order by id DESC`,
          null,
          (_, { rows: { _array } }) => {
            resolve(_array);
          }
        );
      });
    });
  };
  static GetEvent = () => {
    return new Promise((resolve, reject) => {
      db.transaction(async tx => {
        await tx.executeSql(
          `select * from ${liveEventTable} order by id DESC`,
          null,
          (_, { rows: { _array } }) => {
            resolve(_array);
          }
        );
      });
    });
  };
  static GetLocations = (lastSentLocationID) => {
    return new Promise((resolve, reject) => {
      db.transaction(async tx => {
        await tx.executeSql(
          `select * from ${locationsTable} WHERE id > ${lastSentLocationID} order by id DESC`,
          null,
          (_, { rows: { _array } }) => {
            resolve(_array);
          }
        );
      });
    });
  };

  static SetLastLocation = (lastLocID) => {
    db.transaction(
      tx => {
        tx.executeSql(`UPDATE ${liveEventTable} SET lastLocationSent = ?`, [
          lastLocID,
        ]);
      },
      (error) => {console.log("last Location ID save failed"), console.log(error)},
      null
    );
  };

  static UpdateEvent = (name, description, map, updated_at,role, isLive) => {
    db.transaction(
      tx => {
        tx.executeSql(`UPDATE ${liveEventTable} SET name = ?, description = ?, map = ?, updated_at = ?, role = ?, status = ?`, [
          name,
          description,
          map,
          updated_at,
          role,
          isLive
        ]);
      },
      (error) => {console.log("event update failed"), console.log(error)},
      null
    );
  };





}

export default { UserContext, SQL, ContextProvider};