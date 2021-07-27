import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { GetCheckin, setTimeCheckIn, setOpenCheckIn, setMon, setTue, setWed, setThu, setFri, setSat, setSun } from "../../services/APIs/Setting";
import moment from 'moment';

import { Switch, TimePicker, Checkbox, message } from 'antd';
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";
import 'antd/dist/antd.css';
import './checkin.scss'
import { GetLanguage } from "../../services/APIs/Setting";

library.add(fas)


const format = 'HH:mm';

let word = require('../../word.json');

class Checkin extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: true,
            sun: true,
            time: moment().format(),
            open: true,
            loading: true
        }

    }




    componentDidMount() {
        this.setState({
            loading: true
        })
        GetCheckin() // display
            .then(_Mode => {


                if (_Mode.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading: false
                        })
                    }, 500);


                    this.setState({
                        mon: _Mode.data.msg[0].workingDayMo,
                        tue: _Mode.data.msg[0].workingDayTu,
                        wed: _Mode.data.msg[0].workingDayWed,
                        thu: _Mode.data.msg[0].workingDayThu,
                        fri: _Mode.data.msg[0].workingDayFri,
                        sat: _Mode.data.msg[0].workingDaySat,
                        sun: _Mode.data.msg[0].workingDaySun,
                        time: _Mode.data.msg[0].ontime,
                        open: _Mode.data.msg[0].checkinStatus
                    })

                }
            })

            .catch(_ModeError => {
                window.location.href = "/password";
            })
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);
    }

    onChangeOpenCheck(checked) { // status open-close checkin
        this.setState({
            open: checked
        })

        setOpenCheckIn(checked)
            .then(_StatusOpen => {
                if (_StatusOpen.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_StatusOpenError => console.error(_StatusOpenError))

    }

    TimeSelect(time) { // setting time checkin
        var time = time._d;
        var newtime = moment(time).toISOString();
        this.setState({
            time: newtime
        })

        // console.log(newtime)

        setTimeCheckIn(newtime)
            .then(_TimeOpen => {
                if (_TimeOpen.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_TimeOpenError => console.error(_TimeOpenError))

    }

    onChangeMon(checkedValues) { // set monday
        var setmon = checkedValues.target.checked
        this.setState({
            mon: setmon
        })

        setMon(setmon)
            .then(_SetMon => {
                if (_SetMon.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetMonError => console.error(_SetMonError))
    }
    onChangeTue(checkedValues) {  //set tueday
        var settue = checkedValues.target.checked
        this.setState({
            tue: settue
        })

        setTue(settue)
            .then(_SetTue => {
                if (_SetTue.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetTueError => console.error(_SetTueError))
    }
    onChangeWed(checkedValues) { // set wednesday
        var setwed = checkedValues.target.checked
        this.setState({
            wed: setwed
        })
        setWed(setwed)
            .then(_SetWed => {
                if (_SetWed.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetWedError => console.error(_SetWedError))
    }
    onChangeThu(checkedValues) { // set thursday
        var setthu = checkedValues.target.checked
        this.setState({
            thu: setthu
        })

        setThu(setthu)
            .then(_SetThu => {
                if (_SetThu.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetThuError => console.error(_SetThuError))
    }
    onChangeFri(checkedValues) { //set friday
        var setfri = checkedValues.target.checked
        this.setState({
            fri: setfri
        })
        setFri(setfri)
            .then(_SetFri => {
                if (_SetFri.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetFriError => console.error(_SetFriError))
    }
    onChangeSat(checkedValues) { // set saturday
        var setsat = checkedValues.target.checked
        this.setState({
            sat: setsat
        })
        setSat(setsat)
            .then(_SetSat => {
                if (_SetSat.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetSatError => console.error(_SetSatError))
    }
    onChangeSun(checkedValues) { //set sunday
        var setsun = checkedValues.target.checked
        this.setState({
            sun: setsun
        })
        setSun(setsun)
            .then(_SetSun => {
                if (_SetSun.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_SetSunError => console.error(_SetSunError))
    }

    render() {


        return (
            <div>
                <div className="size-web">
                    <div className="loading check-page" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <BarDate></BarDate>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd"> {word['Check in'][this.state.language]}</h1>
                        </div>
                        <div className="cov-switch">
                            <div className="dis-ta">
                                <div className="txt">
                                    <p className="check">{word['Check in'][this.state.language]}</p>
                                </div>
                                <div className="switchset">
                                    <Switch className="switcho" checked={this.state.open} onChange={(e) => this.onChangeOpenCheck(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="ontime" >
                            <p className="txt">{word['On time'][this.state.language]}</p>
                            <div className="time">
                                <TimePicker
                                    format={"HH:mm"}
                                    value={moment(this.state.time)}
                                    open={true}
                                    allowClear={false}
                                    popupClassName={'select-time'}
                                    showNow={false}
                                    onSelect={(t) => { this.TimeSelect(t) }}
                                    autoFocus={true}
                       
                                />
                               
                            </div>
                        </div>

                        <div className="onday">
                            <p className="txt">{word['Working day'][this.state.language]}</p>
                            <div className="select-day">
                                {/* <Checkbox.Group style={{ width: '100%' }} onChange={(e) => { this.onChangeDay(e) }}> */}
                                <div className="cov-tab">
                                    <div className="tab-select">
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeMon(e)} checked={this.state.mon}>{word['Mon'][this.state.language]}</Checkbox>
                                        </div>
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeTue(e)} checked={this.state.tue}>{word['Tue'][this.state.language]}</Checkbox>
                                        </div>
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeWed(e)} checked={this.state.wed}>{word['Wed'][this.state.language]}</Checkbox>
                                        </div>
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeThu(e)} checked={this.state.thu}>{word['Thu'][this.state.language]}</Checkbox>
                                        </div>
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeFri(e)} checked={this.state.fri}>{word['Fri'][this.state.language]}</Checkbox>
                                        </div>
                                    </div>
                                </div>
                                <div className="cov-tab">
                                    <div className="tab-select">
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeSat(e)} checked={this.state.sat}>{word['Sat'][this.state.language]}</Checkbox>
                                        </div>
                                        <div className="btn-day">
                                            <Checkbox className="check-box" onChange={(e) => this.onChangeSun(e)} checked={this.state.sun}>{word['Sun'][this.state.language]}</Checkbox>
                                        </div>

                                    </div>
                                </div>
                                {/* </Checkbox.Group> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Checkin