import React from 'react';
import {Bar} from 'react-chartjs-2';
import { FaAngleLeft, FaAngleRight} from 'react-icons/fa';
import Axios from 'axios';

var dataAir = {};
var currentDate = new Date();
var displayDate = currentDate.toLocaleDateString('fr-FR').slice(0,10);

export class PM10 extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.goToPreviousDay = this.goToPreviousDay.bind(this, currentDate);
    this.goToNextDay = this.goToNextDay.bind(this, currentDate);
    this.state = {
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm10 : this.getArrayOfpm10(dataAir, displayDate),
      pm10BackgroundColor : '',
    };

    Axios.get('https://floriankelnerow.ski/air-raspberry-graph/data.json',{
    }).then( response => {
      dataAir = response.data;
      this.setState(state => ({
        currentDate : currentDate,
        displayDate : displayDate,
        arrayDate : this.getArrayOfDate(dataAir, displayDate),
        pm10 : this.getArrayOfpm10(dataAir, displayDate),
        pm10BackgroundColor : this.getArrayOfpm10BackgroundColor(dataAir, displayDate),
      }));
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  goToPreviousDay(currentDate){
    currentDate.setDate(currentDate.getDate()-1);
    let displayDate = currentDate.toLocaleDateString('fr-FR');
    this.setState(state => ({
      currentDate : currentDate,
      displayDate : displayDate,
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm10 : this.getArrayOfpm10(dataAir, displayDate),
      pm10BackgroundColor : this.getArrayOfpm10BackgroundColor(dataAir, displayDate)
    }));
  }

  goToNextDay(currentDate){
    currentDate.setDate(currentDate.getDate()+1);
    let displayDate = currentDate.toLocaleDateString('fr-FR');
    this.setState(state => ({
      currentDate : currentDate,
      displayDate : displayDate,
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm10 : this.getArrayOfpm10(dataAir, displayDate),
      pm10BackgroundColor : this.getArrayOfpm10BackgroundColor(dataAir, displayDate)
    }));
  }

  getArrayOfDate(dataAir, displayDate)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      if (value.datetime.substring(0, 10) === displayDate) {
        data.push(value.datetime)
      }
    });
    return data
  }

  getArrayOfpm10(dataAir, displayDate)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      if(value.datetime.substring(0,10) === displayDate)
        data.push(value.pm10)
    });
    return data
  }

  getArrayOfpm10BackgroundColor(dataAir, displayDate)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      let pm10 = value.pm10;
      if(value.datetime.substring(0,10) === displayDate) {
        if (pm10 <= 54.4){
          data.push("rgba(0,153,102,1)");
        } else if (pm10 <= 153.9 && pm10 >= 55){
          data.push("rgba(255,222,51,1)");
        } else if (pm10 <= 253.9 && pm10 >= 154){
          data.push("rgba(255,153,51,1)");
        } else if (pm10 <= 353.9 && pm10 >= 254){
          data.push("rgba(204,0,51,1)");
        } else if (pm10 <= 354 && pm10 >= 149.6){
          data.push("rgba(102,0,153,1)");
        } else if(pm10 > 424.7) {
          data.push("rgba(126,0,35,1)");
        }
      }
    });
    return data
  }

  render() {
    const data = {
      labels : this.state.arrayDate,
      datasets: [{
        label: 'PM 10',
        data: this.state.pm10,
        backgroundColor : this.state.pm10BackgroundColor
        }
      ]
    };

    return (
        <div>
        <span className="changeDate">
          <FaAngleLeft size='3em' onClick={this.goToPreviousDay}/>
          <h2>{this.state.displayDate}</h2>
          <FaAngleRight size='3em' onClick={this.goToNextDay}/>
        </span>
          <Bar data={data} />
        </div>
    );
  }
}

export default PM10;
