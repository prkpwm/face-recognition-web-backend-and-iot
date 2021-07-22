import React from 'react';

import './bardate.scss'



class BarDate extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            d:new Date(),
        }

    }


    render() {

        return (
            <div>
                <div className="bar">
                    <div className="cov-date">
                        <div className="date">
                            <p className="numdate">{this.state.d.getDate} /{this.state.d.getMonth}/{this.state.d.setFullYear}</p>
                        </div>
                        <div className="time">
                            <div className="cov-right">
                                <img src="" alt="" className="img-fluid img-wifi"/>
                                <p className="numtime">{this.state.d.getHours}:{this.state.d.getMinutes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default BarDate