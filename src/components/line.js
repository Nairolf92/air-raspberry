import React from 'react';
import {Line} from 'react-chartjs-2';
import { FaAngleLeft, FaAngleRight} from 'react-icons/fa'; 
import Axios from 'axios';

var dataAir = {}
// current date = new date toujours pour le calcul des jours
var currentDate = new Date()
// display date = pour la recherche json et affichage
var displayDate = currentDate.toLocaleDateString('fr-FR').slice(0,10);
// console.log("currentdate"+currentDate)
// console.log("displaydate"+displayDate)

export class LineCustom extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.goToPreviousDay = this.goToPreviousDay.bind(this, currentDate); 
    this.goToNextDay = this.goToNextDay.bind(this, currentDate); 
    this.state = {
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm2p5 : this.getArrayOfPM2p5(dataAir, displayDate),
      pm2p5BackgroundColor : '',
      pm10 : this.getArrayOfPM10(dataAir, displayDate),
      pm10BackgroundColor : '',
    };
    
    Axios.get('https://floriankelnerow.ski/air-raspberry-graph/data.json',{
    }).then( response => {
      dataAir = response.data;
      this.setState(state => ({
        currentDate : currentDate,
        displayDate : displayDate,
        arrayDate : this.getArrayOfDate(dataAir, displayDate),
        pm2p5 : this.getArrayOfPM2p5(dataAir, displayDate),
        pm2p5BackgroundColor : this.getArrayOfpm2p5BackgroundColor(dataAir),
        pm10 : this.getArrayOfPM10(dataAir, displayDate)
      }));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  goToPreviousDay(currentDate){
    //console.log("goToPreviousDay");
    currentDate.setDate(currentDate.getDate()-1);
    //console.log("currentDate : "+currentDate)
    let displayDate = currentDate.toLocaleDateString('fr-FR');
    //console.log("displayDate : "+displayDate)
    this.setState(state => ({
      currentDate : currentDate,
      displayDate : displayDate,
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm2p5 : this.getArrayOfPM2p5(dataAir, displayDate),
      pm10 : this.getArrayOfPM10(dataAir, displayDate)
    }));
    //console.log("this.state.currentDate : "+this.state.currentDate)
    //console.log("this.state.displayDate : "+this.state.displayDate)
    //console.log("END goToPreviousDay")
  }

  goToNextDay(currentDate){
    currentDate.setDate(currentDate.getDate()+1);
    let displayDate = currentDate.toLocaleDateString('fr-FR');
    this.setState(state => ({
      currentDate : currentDate,
      displayDate : displayDate,
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm2p5 : this.getArrayOfPM2p5(dataAir, displayDate),
      pm10 : this.getArrayOfPM10(dataAir, displayDate)
    }));
  }

  getArrayOfDate(dataAir, displayDate)
  {
    // ES6 format
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      if (value.datetime.substring(0, 10) === displayDate) {
        data.push(value.datetime)
      }
    });
    return data
  }

  getArrayOfPM2p5(dataAir, displayDate)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      if(value.datetime.substring(0,10) === displayDate)
        data.push(value.pm25)
    });
    return data
  }

  getArrayOfpm2p5BackgroundColor(dataAir)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      switch (true) {
        case value.pm25 < 55.0 :
          data.push("rgba(0,153,102,1)");
          break;
        default :
          console.log("default")
      }
    });
    return data
  }

  getArrayOfPM10(dataAir, displayDate)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      if(value.datetime.substring(0,10) === displayDate)
        data.push(value.pm10)
    });
    return data
  }

  render() {
    const data = {
      labels : this.state.arrayDate,
      datasets: [
        {
          label: 'PM 2,5',
          fill: true,
          lineTension: 0.1,
          backgroundColor: this.state.pm2p5BackgroundColor,
          borderColor: 'rgba(75,192,192,1)',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          data: this.state.pm2p5
        },
        {
          label: 'PM 10',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          data: this.state.pm10
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

        <Line data={data} />
      </div>
    );
  }
};

export default LineCustom;
