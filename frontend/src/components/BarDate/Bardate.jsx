import React from 'react';
import './bardate.scss'



class BarDate extends React.Component {

    render() {

        return (
            <div className="bar">
                <div className="cov-date">
                    
                    <div className="date">
                        <p className="numdate">{("0" + new Date().getDate()).slice(-2)}/{("0"+(new Date().getMonth()+1)).slice(-2)}/{(""+new Date().getFullYear()).slice(-2)}</p>
                    </div>
                    <div className="time">
                        <div className="cov-right">
                            <img src="/image/icon/wifi.svg" alt="" className="img-fluid img-wifi" style={{height: "40px",width: "40px"}}  />
                            <p className="numtime"> {("0" + new Date().getHours()).slice(-2)}:{("0" + new Date().getMinutes()).slice(-2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BarDate