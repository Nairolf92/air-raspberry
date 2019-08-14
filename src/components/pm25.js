import React from 'react';
import {Bar} from 'react-chartjs-2';
import { FaAngleLeft, FaAngleRight} from 'react-icons/fa'; 
import Axios from 'axios';

var dataAir = {};
// current date = new date toujours pour le calcul des jours
var currentDate = new Date();
// display date = pour la recherche json et affichage
var displayDate = currentDate.toLocaleDateString('fr-FR').slice(0,10);
// console.log("currentdate"+currentDate)
// console.log("displaydate"+displayDate)

export class PM25 extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.goToPreviousDay = this.goToPreviousDay.bind(this, currentDate); 
    this.goToNextDay = this.goToNextDay.bind(this, currentDate); 
    this.state = {
      arrayDate : this.getArrayOfDate(dataAir, displayDate),
      pm2p5 : this.getArrayOfPM2p5(dataAir, displayDate),
      pm2p5BackgroundColor : '',
    };
    
    Axios.get('https://floriankelnerow.ski/raspberry-fine-particles/data.json',{
    }).then( response => {
      dataAir = response.data;
      this.setState(state => ({
        currentDate : currentDate,
        displayDate : displayDate,
        arrayDate : this.getArrayOfDate(dataAir, displayDate),
        pm2p5 : this.getArrayOfPM2p5(dataAir, displayDate),
        pm2p5BackgroundColor : this.getArrayOfpm2p5BackgroundColor(dataAir, displayDate),
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
      pm2p5BackgroundColor : this.getArrayOfpm2p5BackgroundColor(dataAir, displayDate)
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
      pm2p5BackgroundColor : this.getArrayOfpm2p5BackgroundColor(dataAir, displayDate)
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

  getArrayOfpm2p5BackgroundColor(dataAir, displayDate)
  {
    let data = [];
    Object.entries(dataAir).forEach(([key, value]) => {
      let pm2p5 = value.pm25;
      // console.log(pm2p5);
      if(value.datetime.substring(0,10) === displayDate) {
        if (pm2p5 <= 11.8){
          data.push("rgba(0,153,102,1)");
        } else if (pm2p5 <= 35.2 && pm2p5 >= 11.9){
          data.push("rgba(255,222,51,1)");
        } else if (pm2p5 <= 55.2 && pm2p5 >= 35.3){
          data.push("rgba(255,153,51,1)");
        } else if (pm2p5 <= 149.5 && pm2p5 >= 55.3){
          data.push("rgba(204,0,51,1)");
        } else if (pm2p5 <= 249.9 && pm2p5 >= 149.6){
          data.push("rgba(102,0,153,1)");
        } else if(pm2p5 > 250) {
          data.push("rgba(126,0,35,1)");
        }
      }
    });
    return data
  }

  render() {
    // console.log(this.state.pm2p5BackgroundColor);
    // console.log(this.state.pm2p5);
    const data = {
      labels : this.state.arrayDate,
      datasets: [{
          label: 'PM 2,5',
          data: this.state.pm2p5,
          backgroundColor : this.state.pm2p5BackgroundColor
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

export default PM25;
