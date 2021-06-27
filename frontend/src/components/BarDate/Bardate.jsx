import React from 'react';

import './bardate.scss'



class BarDate extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
        }

    }


    render() {





        return (
            <div>
                <div className="bar">
                    <div className="cov-date">
                        <div className="date">
                            <p className="numdate">12/12/20</p>
                        </div>
                        <div className="time">
                            <div className="cov-right">
                                <img src="" alt="" className="img-fluid img-wifi"/>
                                <p className="numtime">9.09</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default BarDate