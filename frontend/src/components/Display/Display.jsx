import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Slider, InputNumber, Upload, message, Button, Switch } from 'antd';
import 'antd/dist/antd.css';
import './display.scss'


library.add(fas)



class Display extends React.Component {

    constructor(props) {

        super(props)
        this.state = {


        }

    }



    render() {


        return (
            <div>
                <div className="size-web">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Display setting</h1>
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
                                                            <p className="status-process">SUCCESS</p>
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
                                                                            <p className="status-time">มาสาย</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 temperature">
                                                                <div className="box-tem">
                                                                    <div className="cov-ta-tem">
                                                                        <div className="result-temper">
                                                                            <p className="num">35.6</p>
                                                                            <p className="status-time">อุณหภูมิผ่านเกณฑ์</p>
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
                                                <a href="/settingdisplay" className="link-set">Display</a>
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
                                                <a href="" className="link-set">Screen saver</a>
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