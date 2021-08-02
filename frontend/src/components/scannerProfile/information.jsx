import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './information.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";

library.add(fas)



let word = require('../../word.json');

class information extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            loading: true,
            welcome_status: true,
            nickname_status: true,
            group_status: true,
            time_trick_status: true,
            temp_status: true,
            air_status: true,
            weather_status: true,
            pm25_status: true,
            weather_status: true,
            welcome_word: "",

        }

    }

    componentDidMount() {

        setTimeout(() => {
            this.setState({
                welcome_status: localStorage.getItem('welcome_status') != null ? (/true/i).test(localStorage.getItem('welcome_status')) : true,
                nickname_status: localStorage.getItem('nickname_status') != null ? (/true/i).test(localStorage.getItem('nickname_status')) : true,
                time_trick_status: localStorage.getItem('time_trick_status') != null ? (/true/i).test(localStorage.getItem('time_trick_status')) : true,
                temp_status: localStorage.getItem('temp_status') != null ? (/true/i).test(localStorage.getItem('temp_status')) : true,
                group_status: localStorage.getItem('group_status') != null ? (/true/i).test(localStorage.getItem('group_status')) : true,
                pm25_status: localStorage.getItem('pm25_status') != null ? (/true/i).test(localStorage.getItem('pm25_status')) : true,
                weather_status: localStorage.getItem('weather_status') != null ? (/true/i).test(localStorage.getItem('weather_status')) : true,
                welcome_word: localStorage.getItem('welcome_word') != null ? localStorage.getItem('welcome_word') : "",
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);

    }

    onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    onChangeWelcomeWord(event) {
        console.log(event.target.value);
        this.setState({
            welcome_word: event.target.value,

        })
        localStorage.setItem('welcome_word', event.target.value)
    }

    onChangeWelcomeStatus(event) {
        console.log(event);
        this.setState({
            welcome_status: event,

        })
        localStorage.setItem('welcome_status', event)
    }
    onChangeNicknameStatus(event) {
        console.log(event);
        this.setState({
            nickname_status: event,

        })
        localStorage.setItem('nickname_status', event)
    }
    onChangeTimeTrickStatus(event) {
        console.log(event);
        this.setState({
            time_trick_status: event,

        })
        localStorage.setItem('time_trick_status', event)
    }
    onChangeTempStatus(event) {
        console.log(event);
        this.setState({
            temp_status: event,

        })
        localStorage.setItem('temp_status', event)
    }
    onChangeGroupStatus(event) {
        console.log(event);
        this.setState({
            group_status: event,

        })
        localStorage.setItem('group_status', event)
    }

    onChangePM25Status(event) {
        console.log(event);
        this.setState({
            pm25_status: event,

        })
        localStorage.setItem('pm25_status', event)
    }

    onChangeWeatherStatus(event) {
        console.log(event);
        this.setState({
            weather_status: event,

        })
        localStorage.setItem('weather_status', event)
    }

    render() {


        return (
            <div>
                <div className="size-web">
                    <div className="loading" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <BarDate></BarDate>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/scannerProfile" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Information'][this.state.language]}</h1>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">{word['Welcome word'][this.state.language]}</p>
                                </div>
                            </div>
                            <div className="cov-ta">
                                <div className="box-new">
                                    <div className="form-group">
                                        <input type="text"
                                            className="form-control input-data" maxLength="64"
                                            value={this.state.welcome_word}
                                            onChange={(e) => { this.onChangeWelcomeWord(e) }} id="Newpass"
                                            placeholder={this.state.welcome_word}
                                        />
                                    </div>
                                </div>
                                <div className="btnac">
                                            <Switch className="switcho" checked={this.state.welcome_status} onChange={(e) => this.onChangeWelcomeWord(e)} />
                                        </div>
                            </div>
                        </div>

                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">{word['Nickname'][this.state.language]}</p>
                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.nickname_status} onChange={(e) => this.onChangeNicknameStatus(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">{word['Group'][this.state.language]}</p>
                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.group_status} onChange={(e) => this.onChangeGroupStatus(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">{word['Time Tracking'][this.state.language]}</p>
                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.time_trick_status} onChange={(e) => this.onChangeTimeTrickStatus(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">{word['Temperature'][this.state.language]}</p>
                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.temp_status} onChange={(e) => this.onChangeTempStatus(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">PM 2.5</p>
                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.pm25_status} onChange={(e) => this.onChangePM25Status(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="boxset ">
                            <div className="cov-ta">
                                <div className="btnac">
                                    <p className="txt-style">{word['Weather'][this.state.language]}</p>
                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.weather_status} onChange={(e) => this.onChangeWeatherStatus(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default information