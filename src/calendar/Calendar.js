import React, {useState, useEffect} from "react"
import moment from "moment";
import "./calendar.css";

const Calendar = () => {
  const weekdayshort = moment.weekdaysShort();
  const [dateObject, setDateObject] = useState(moment());
  const [allMonths, setAllMonths] = useState(moment.months());
  const [selectedDay, setSelectedDay] = useState(0)
  const [showDateTable, setShowDateTable] = useState(true)
  const [showMonthTable, setShowMonthTable] = useState(false)
  const [showYearTable, setShowYearTable] = useState(false)
  
  let year = () => { 
    return dateObject.format('Y')
  }

  const daysInMonth = () => {
    return dateObject.daysInMonth();
  };


  const firstDayOfMonth = () => {
    let firstDay = moment(dateObject)
      .startOf("month")
      .format("d"); 
    return firstDay;
  };

    let weekdayshortname = weekdayshort.map(day => {
      return <th className=""key={day}>{day}</th>;
    });

    let blanks = [];
    for (let i = 0; i < firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{""}</td>);
    }

    const onDayClick = (e, d) => {
      setSelectedDay(d)
    }

    //HIGHLIGHT THE CURRENT DAY
    //1) Find the current day
    const currentDay = () => { return dateObject.format('D') }
    //2) Add a condition in the loop that creates <td> to change this tag to other style
    let daysInMonthTD = [];
    for (let d = 1; d <= daysInMonth(); d++) {
      let currentDayVar = d === currentDay() ? "today" : ""; 
      daysInMonthTD.push(
        <td key={d} className={`calendar-day ${currentDayVar}`}>
          <span
            onClick={e => onDayClick(e, d)}>
            {d}
          </span>
        </td>
      );
    }
    var totalSlots = [...blanks, ...daysInMonthTD];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    //CREATE A MONTH PICKER
    //1) Function that return the month from de dateObject state
    let month = () => ( dateObject.format("MMMM") )
    //2)Create the XML structure,styles it; and display the result of the funciton in it

    //Changing the Month
    //11)Create a function to change the month
    const setMonth = (month) => {
      const monthNumber = allMonths.indexOf(month) //Get the index "number" of the month clicked
      let copyDateObject = Object.assign({}, dateObject); //Copy the dateObject of the state
      copyDateObject = moment(copyDateObject).set("month", monthNumber); //Moment take this object and change 
                                                                         // the "month" property                                                                                                                                 
      setDateObject(copyDateObject) //Change the state with the new value of the month
      setShowMonthTable(!showMonthTable);
      setShowDateTable(!showDateTable);
    }

    const MonthList = ({data}) => {
    //3)Save the moment object in the state, and store all months
    //4)Function to handle the month <table>
      //4.1) Array to store the <td>´s that the function will create
      //4.2) Loop throw "allMonths" to create a <td> for each one and store it in the array
    let months = [];
    
    //12)Add the onClick to the <td>
      data.map( (month) => {
        months.push(
          <td 
            key={month}
            className="calendar-month"
            onClick={ e => setMonth(month)}>
            <span>{month}</span>
          </td>
        )
      })
    //5)Create a list of cells that contains the month name
      let cells = [];
    //6)Define rows to store <td> while going throw rows
      let rows = [];
    //7)Loop throw each item of months, finally we get an array "rows", with "row" inside and "cells" inside it.
      months.forEach( (row, i) => {
        if( i % 3 !== 0 || i === 0){
          cells.push(row)
        } else{
          rows.push(cells)
          cells = []
          cells.push(row)
        } 
      });
      rows.push(cells)
    //8)Loop throw rows and create a <tr> for each one "rows in the screen"
      let monthListTR = () => {
        return rows.map( (row, i) => <tr key={i}>{row}</tr>)
      }

    //9)Create HTML structure with all styles that "MonthList" function will return
      return (
        <table className="calendar-month">
          <thead>
            <tr>
              <th colSpan="4">Select Month</th>
            </tr>
          </thead>
          <tbody>{monthListTR()}</tbody>
        </table>
      )
    //10)Render the function in the parent component "Calendar"    
    }


    
    const showMonth = () => {
      if(showYearTable === true){
        setShowYearTable(false)
          if(showDateTable === true){
            setShowDateTable(!showDateTable)
          }
      }else{
        if(showMonthTable === false){
          setShowDateTable(!showDateTable)
          console.log("showMonthTable is FALSE", showDateTable)
          setShowMonthTable(true)
        }
        else if(showMonthTable === true)
          setShowMonthTable(false)
          setShowDateTable(true)
        } 
    }

    const setYear = (year) => {
      let copyDateObject = Object.assign({}, dateObject);
      copyDateObject = moment(copyDateObject).set("year", year)
      setDateObject(copyDateObject);
      setShowYearTable(!showYearTable);
      setShowMonthTable(!showDateTable);
    }

    let getDates = (startDate, stopDate) => {
      let dateArray = [];
      let currentDate = moment(startDate);
      let stopingDate = moment(stopDate);
      while (currentDate < stopingDate) {
        dateArray.push(moment(currentDate).format('YYYY'))
        currentDate = moment(currentDate).add(1, "year")
      }
      return dateArray
    }


    const YearTable = (props) => {
      let years = []
      let nextten = moment()  //Crear instancia del objeto moment
                    .set('year', props) //Devolveme el año actual
                    .add('year', 12) //Devolveme los 12 años proximos
                    .format('Y');  //En el formato '2021'

      let twelveyears = getDates(props, nextten);

      twelveyears.map( (data) => {
        years.push(
          <td
            key={data}
            className="calendar-month"
            onClick={e => setYear(data)}>
            <span>{data}</span>
          </td>
        )
      })

      let rows = [];
      let cells = [];

      years.forEach( (row, i) => {
        if( i % 3 !== 0 || i === 0){
          cells.push(row);
        }else {
          rows.push(cells);
          cells = [];
          cells.push(row)
        }
      });
      rows.push(cells)

      let yearListTR = rows.map((row, i) => (<tr key={i}>{row}</tr>));

      return (
        <table className="calendar-month">
          <thead>
            <tr>
              <th colSpan="4">Select Year</th>
            </tr>
          </thead>
          <tbody>{yearListTR}</tbody>
        </table>
      )
    }

    const handleShowYearTable = (e) => {
      if(showMonthTable === true){
        setShowYearTable(false)
      }else if(showDateTable === true){
        setShowDateTable(false)
      }
        setShowYearTable(true)
    }

    let onNext = () => {
      let copyDateObject = Object.assign({}, dateObject);
      let currentView = "";
      if(showYearTable === true){
        currentView = "year"
      }else if(showMonthTable === true){
        currentView = "month"
      }
      copyDateObject = moment(copyDateObject).add(1, currentView)
      setDateObject(copyDateObject)
    }

    let onPrev = () => {
      let copyDateObject = Object.assign({}, dateObject);
      let currentView = "";
      if(showYearTable === true){
        currentView = "year"
      }else if(showMonthTable === true){
        currentView = "month"
      }
      copyDateObject = moment(copyDateObject).subtract(1, currentView)
      setDateObject(copyDateObject)
    }

    return (  
      <div className="tail-datetime-calendar">
          <div className="calendar-navi">
          <span 
              className="calendar-button button-prev"
              onClick={e => onPrev()}></span>
            <span 
              data-tail-navi="switch" 
              className="calendar-label"
              onClick={ e => {showMonth()} }>
              {month()}
            </span>
            <span 
              className="calendar-label"
              onClick={e => handleShowYearTable()}>
              {year()}
            </span>
            <span 
              className="calendar-button button-next"
              onClick={e => {onNext()}}></span>  
          </div>
          <div className="calendar-date">
            {showYearTable && <YearTable props={year()}/>}
            {showMonthTable && (<MonthList data={moment.months()}/>)}
          </div>
         { showDateTable && (
            <div className="calendar-date">
              <table className="calendar-day">
                <thead>
                  <tr>{weekdayshortname}</tr>
                </thead>
                <tbody>{daysinmonth}</tbody>
              </table>
            </div>
         )}
      </div>    
     
    );
} 

export default Calendar