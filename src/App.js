import React, { Component } from 'react';
import { PM25 } from "./components/pm25";
import { PM10 } from "./components/pm10";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="row">
                    <div className="col-lg-6">
                        <PM25/>
                    </div>
                    <div className="col-lg-6">
                        <PM10/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;