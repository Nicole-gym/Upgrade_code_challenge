//mock date data
let datebase = [
  {
      "date":"10-04-2018",   //date
      "status":"full"       //isreserved or not
  },
  {
      "date":"10-05-2018",
      "status":"empty"
  },
  {
      "date":"10-06-2018",
      "status":"empty"
  },
  {
      "date":"10-07-2018",
      "status":"full"
  },
  {
      "date":"10-08-2018",
      "status":"full"
  },
  {
      "date":"10-09-2018",
      "status":"empty"
  },
  {
      "date":"10-10-2018",
      "status":"empty"
  },
  {
      "date":"10-11-2018",
      "status":"empty"
  },
  {
      "date":"11-02-2018",
      "status":"full"
  },
  {
      "date":"11-03-2018",
      "status":"full"
  },
  {
      "date":"11-04-2018",
      "status":"full"
  },
  {
      "date":"11-05-2018",
      "status":"empty"
  },
  {
      "date":"11-06-2018",
      "status":"empty"
  },
  {
      "date":"11-07-2018",
      "status":"empty"
  },
  {
      "date":"11-08-2018",
      "status":"empty"
  },
  {
      "date":"11-09-2018",
      "status":"empty"
  }
];

//mock reservation data
let reservationdb = [
  {
      "id":1,                         //unique booking identifier
      "email":"aa@aa.com",            //email
      "fullname":"Alice H",           //full name
      "arrivaldate":"10-04-2018",     //arrival date
      "leavingdate":"10-04-2018",     //leaving date
      "delete":false                  //reservation delete or not
  },
  {
      "id":2,
      "email":"bb@bb.com",
      "fullname":"Blice H",
      "arrivaldate":"10-07-2018",
      "leavingdate":"10-08-2018",
      "delete":false
  },
  {
      "id":3,
      "email":"cc@cc.com",
      "fullname":"Clice H",
      "arrivaldate":"11-02-2018",
      "leavingdate":"11-04-2018",
      "delete":false
  }
];


// user request the information of the availability of campsite
const getReservations = function(start, end) {
  var today = new Date();                       //today's date
  var dd = today.getDate()+1;                   //user can only order in advance at least one day
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10) {dd = '0'+dd}
  if(mm<10) {mm = '0'+mm}
  today = mm + '-' + dd + '-' + yyyy;
  var nowdate = new Date();
  nowdate.setMonth(nowdate.getMonth()+1);
  var y = nowdate.getFullYear();
  var m = nowdate.getMonth()+1;                 //user can only order in advance no more than one month
  var d = nowdate.getDate();
  if(d<10) {d = '0'+d}
  if(m<10) {m = '0'+m}
  var nextmonth = m+'-'+d+'-'+y;
  if (start && end) {                           //when user give the specific date
    if (start < today) {start = today}          //only give the user the choice one day after today and in a month
    if (end > nextmonth) {end = nextmonth}
    return new Promise((resolve, reject) => {
      resolve(datebase.filter(reservation => reservation.date >= start && reservation.date <= end));  //return reservation availabilty information
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve(datebase.filter(reservation => reservation.date >= today && reservation.date <= nextmonth));
    });
  }
}

// user can reserve range of days on campsite
const addReservation = function(newreservation) {
    return new Promise((resolve, reject) => {
      var nowdate = new Date(newreservation.arrivaldate);
      var validDate =new Date(nowdate.getTime() + 3*24*60*60*1000);           //calculate 3days later date
      var y = validDate.getFullYear();
      var m = validDate.getMonth()+1;
      var d = validDate.getDate();
      if(d<10) {d = '0'+d}
      if(m<10) {m = '0'+m}
      var nextmonth = m+'-'+d+'-'+y;
      if (newreservation.leavingdate >= nextmonth || newreservation.leavingdate < newreservation.arrivaldate) {
        reject('The date can be reserved only 3 days');                       //if departure date is more than 3days, reject
      } else {
        let dates = datebase.filter(reservation => reservation.date >= newreservation.arrivaldate && reservation.date <= newreservation.leavingdate);
        dates.map(date => datebase.find(datedata => datedata.date === date.date).status = "full")   //make the reservation dates unavailable
        newreservation.id = reservationdb[reservationdb.length-1].id + 1;      //give unique indentifier "id"
        reservationdb.push(newreservation);
        resolve(newreservation);
      }
    });
}


// user can look up the specific reservation
const getReservation = function(id) {
    return new Promise((resolve, reject) => {
      if (reservationdb.find(reservation => reservation.id === id).delete === true) {   //if deleted reject
        reject('reservation is not found');
      }else {
        resolve(reservationdb.find(reservation => reservation.id === id));              //return specific reservation
      }

    })
}


// user can modify the reservation
const updateReservation = function(id, newreservation) {
    return new Promise((resolve, reject) => {
      let reserv = reservationdb.find(reservation => reservation.id === id);            //find the specific data by id
      if (newreservation.delete === true){                                              //if user want to delete
        reserv.delete = true;                                                           //make the delete identifier true
        let dates = datebase.filter(reservation => reservation.date >= reserv.arrivaldate && reservation.date <= reserv.leavingdate);
        dates.map(date => datebase.find(datedata => datedata.date === date.date).status = "empty")      //make the reservation dates available
        resolve("delete successfully");
      } else {                                                                          //update specific reservation
        reserv.email = newreservation.email;
        reserv.fullname = newreservation.fullname;
        reserv.arrivaldate = newreservation.arrivaldate;
        reserv.leavingdate = newreservation.leavingdate;
        reserv.delete = newreservation.delete;
        resolve(reserv);
      }
    })
}


module.exports = {
  getReservations,
  addReservation,
  getReservation,
  updateReservation
}
