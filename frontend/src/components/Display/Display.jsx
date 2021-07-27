import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Slider, InputNumber, Upload, message, Button, Switch } from 'antd';
import 'antd/dist/antd.css';
import './display.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";
library.add(fas)
let word = require('../../word.json');


class Display extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language:"TH",
            loading: false

        }

    }
    componentDidMount() {
        this.setState({
            loading: true
        })

        GetLanguage() // Get language for display
            .then(_Edit => {


                if (_Edit.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading: false
                        })
                    }, 800);
                    this.setState({
                        language: _Edit.data.msg[0].lang,

                    })
                    localStorage.setItem('lang',_Edit.data.msg[0].lang) 


                }
            })

    }


    render() {


        return (
            <div>
                <div className="size-web">
                <div className="loading" style={{visibility: this.state.loading? "visible" : "hidden"}}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <BarDate></BarDate>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Display setting'][this.state.language]}</h1>
                        </div>
                        <div className="list-setting">
                            <div className="set-dis">
                                <div className="box-display">
                                    <div className="row list-exam">
                                        <div className="col-lg-4 left-dis">
                                            <div className="cov-example">
                                                <div className="boxex">
                                                    <div className="name-official">
                                                        <div className="cov-ta">
                                                            <div className="logo">
                                                                <div className="circle">
                                                                    <img src="/image/Logo/logo-office.png" alt="" className="img-fluid" />
                                                                </div>
                                                            </div>
                                                            <div className="nameoff">
                                                                <p className="name">Hogwarts School of Witchcraft and wizardry</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="scan">
                                                        <img src="/image/scanning_bar.png" alt="" className="img-fluid" />
                                                    </div>
                                                    <div className="cov-img-default">
                                                        <img src="/image/Human.png" alt="" className="img-fluid" />
                                                    </div>
                                                    <div className="result">
                                                        <div className="name-result">
                                                            <p className="status-process">{word['SUCCESS'][this.state.language]}</p>
                                                            <p className="name-user">Bai toeyyy</p>
                                                            <p className="group">Student</p>
                                                        </div>
                                                        <div className="row list-result">
                                                            <div className="col-lg-6 time">
                                                                <div className="box-time">
                                                                    <div className="cov-ta-time">
                                                                        <div className="img-result">
                                                                            <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
                                                                        </div>
                                                                        <div className="result-num">
                                                                            <p className="num">09.09</p>
                                                                            <p className="status-time">{word['Late'][this.state.language]}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 temperature">
                                                                <div className="box-tem">
                                                                    <div className="cov-ta-tem">
                                                                        <div className="result-temper">
                                                                            <p className="num">35.6</p>
                                                                            <p className="status-time">{word['Pass'][this.state.language]}</p>
                                                                        </div>
                                                                        <div className="img-tem">
                                                                            <img src="/image/icon/temg.svg" alt="" className="img-fluid" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8 right-dis">
                                            <div className="cov-link">
                                                <a href="/settingdisplay" className="link-set">{word['Display'][this.state.language]}</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row list-exam bt-set">
                                        <div className="col-lg-4 left-dis">
                                            <div className="cov-example">
                                                <div className="box-saver">
                                                    <img src="/image/saver.png" alt="" className="img-fluid"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8 right-dis">
                                            <div className="cov-link">
                                                <a href="" className="link-set">{word['Screen saver'][this.state.language]}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Display