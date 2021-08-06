import React from 'react';
// import Lottie from 'react-lottie';
// import animationData from '../../lotties/human.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera, Clean, ReadResult } from "../../services/APIs/Camera";
import { weather } from "../../services/APIs/weather";
import socketIOClient from "socket.io-client";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { GetLanguage } from "../../services/APIs/Setting";
import { getResult } from "../../services/APIs/recognition";
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";
import './home.scss'
const axios = require('axios');
library.add(fas)

let word = require('../../word.json');
// const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//         preserveAspectRatio: "xMidYMid slice"
//     }
// };

let steam_open = false
let minutes = new Date().getMinutes();
let hours = new Date().getHours();
let days = new Date().getDay;
let temp = 38.5
let hour_set = 9
let min_set = 0
let face_valid = false
let name = "Bai toeyyy"
let status = "Student"
const ENDPOINT = "http://192.168.0.252:2323";

class Home extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            response: [],
            weather_info: [],
            language: 'TH',
            L1: "",
            L2: "",
            LogoStorage: true,
            nameSelected: true,
            nickname_status: true,
            group_status: true,
            welcome_word: null,
            LogoSelected: true,
            pm25_status: true,
            weather_status: true,
            t1: true,
            t2: true,
            temp: "",
            nickname: "",
            role_name: "",
            weather_res: "",
            pm25_res: "",
            checktime: false,
            temp: null,
            count: 0,
            detect: false,
            hour_set: 0,
            min_set: 0,
            ThermalHeightest: 0,
            location: "",
            loading: true,
            mask: null,

        }
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    componentDidMount() {
        steam_open = true
        Camera({ camera: 'detection' }) // Switch camera
            .then(_Camera => {
                console.log("_Camera", _Camera)
            })

            .catch(_CameraError => console.error(_CameraError))

        // Temp({ camera: 'detection' }) // Switch camera
        //     .then(data => {
        //         console.log("_Temp", data)
        //         this.setState({
        //             temp: data.data.Temp
        //         })
        //     })


        // weather({ data: 'pm' }) // Switch camera
        //     .then(data => {
        //         console.log("weather", data)
        //         this.setState({

        //             weather_info: data.data
        //         })

        //     })
        // ReadResult('')
        //     .then(res => {
        //         console.log("res", res)
        //     })


        GetLanguage() // Get language for display
            .then(_Edit => {
                console.log("lang",_Edit.data.data.msg[0].lang)
                if (_Edit.data.status) {
                    this.setState({
                        L1: localStorage.getItem('L1') != null ? localStorage.getItem('L1') : null,
                        L2: localStorage.getItem('L2') != null ? localStorage.getItem('L2') : null,
                        welcome_status: localStorage.getItem('welcome_status') != null ? (/true/i).test(localStorage.getItem('welcome_status')) : true,
                        nickname_status: localStorage.getItem('nickname_status') != null ? (/true/i).test(localStorage.getItem('nickname_status')) : true,
                        time_trick_status: localStorage.getItem('time_trick_status') != null ? (/true/i).test(localStorage.getItem('time_trick_status')) : true,
                        temp_status: localStorage.getItem('temp_status') != null ? (/true/i).test(localStorage.getItem('temp_status')) : true,
                        group_status: localStorage.getItem('group_status') != null ? (/true/i).test(localStorage.getItem('group_status')) : true,
                        t2: localStorage.getItem('t1') != null ? (/true/i).test(localStorage.getItem('t1')) : true,
                        t1: localStorage.getItem('t2') != null ? (/true/i).test(localStorage.getItem('t2')) : true,
                        welcome_word: localStorage.getItem('welcome_word') != null ? localStorage.getItem('welcome_word') : "",
                        hour_set: localStorage.getItem('TimeHH'),
                        min_set: localStorage.getItem('TimeMM'),
                        ThermalHeightest: localStorage.getItem('ThermalHeightest'),
                        pm25_status: localStorage.getItem('pm25_status') != null ? (/true/i).test(localStorage.getItem('pm25_status')) : true,
                        weather_status: localStorage.getItem('weather_status') != null ? (/true/i).test(localStorage.getItem('weather_status')) : true,
                        language: _Edit.data.data.msg[0].lang,
                    })
                    localStorage.setItem('lang', _Edit.data.data.msg[0].lang)
                }
            })
        setTimeout(() => {
            this.setState({
                loading: false,
                LogoStorage: localStorage.getItem('LogoLocation'),

            })
            console.log(this.state.LogoStorage, localStorage.getItem('LogoLocation'))
        }, 800);

        // const socket = socketIOClient(ENDPOINT);
        // socket.on("predict_face", data => {
        //     this.setState({
        //         response: data
        //     })
        // });
        this.loadresule()

    }


    loadresule() {
        let pred = require('../../pred.json');
        this.setState({
            nickname: pred['nickname'],
            role_name: pred['role_name'],
            weather_res: pred['weather_res'],
            pm25_res: pred['pm25_res'],
            temp: pred['temp'],
            count: pred['count'],
            location: pred['location_res'],
            detect: pred['detect'],
        })
        // Clean(null)
        setTimeout(() => {
            Clean("pred.json")
        }, 10000);
        let mask = require('../../mask.json');
        this.setState({
            mask: mask['msg'],
        })
        // Clean(null)
        // setTimeout(() => {
        //     Clean("mask.json")
        // }, 10000);
        console.log(pred)
    }

    Switchtosetting() { // action show button 
        var element = document.getElementById("setting");
        element.classList.toggle("show");
    }

    TimeValid() { // action show button 
        if (hours > this.state.hour_set) {
            return false
        } else if (hours == this.state.hour_set && minutes >= this.state.min_set) {
            return false
        }
        return true
    }

    getRes() { // action show button 
        getResult() // Get language for display
            .then(_Edit => {
                if (_Edit.data.status) {
                    console.log(_Edit.data)
                }
            })
    }

    pm25_color(num) {
        let colors = [25, 50, 100, 200]
        let means_th = ["ดีมาก", "ดี", "ปานกลาง", "เริ่มมีผลกระทบต่อสุขภาพ", "มีผลกระทบต่อสุขภาพ"]
        let means_en = ["Very good", "good", "moderate", "starting to affect health", "affect health"]
        for (let i = 0; i < colors.length; i++) {
            if (num <= colors[i]) {
                return (this.state.language == "TH" ? means_th[i] : means_en[i])
            }
        }
        return (this.state.language == "TH" ? means_th[means_th.length - 1] : means_en[means_en.length - 1])
    }


    render() {

        console.log("ffff", this.state.response)

        return (

            <div>
                <div className="size-web">

                    <div className="stream" onClick={() => { this.Switchtosetting() }}>
                        <div className="loading" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                            <RotateSpinner size={150} loading={this.state.loading} />
                        </div>

                        <div className="btn-tologin" id="setting">
                            <a href="/password" className="link-login"><FontAwesomeIcon icon={['fas', 'tools']} /></a>
                        </div>
                        <BarDate></BarDate>
                        <div className="name-official">

                            <div className="cov-ta">
                                <div className="logo">
                                    <div className="circle">
                                        <img src={localStorage.getItem("LogoLocation")} alt="" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="nameoff">
                                    <div className="name">{this.state.L1}</div><div className="name">{this.state.L2}</div>
                                </div>
                            </div>
                        </div>


                        <div className="box-img">
                            <img id="image" align="middle" className="img-fluid img-stream" src="http://192.168.0.252:3050/video_feed" />
                        </div>

                        {this.state.t1 ?
                            <div className="cov-lotties" style={{ position: 'absolute', top: '0px', width: '100%' }}>
                                <img src="/image/Human.png" alt="" className="img-fluid" />
                                {/* <Lottie
                                options={defaultOptions}
                                height={1920}
                                width={'100%'}
                            /> */}
                            </div> : null}
                        {this.state.t2 ?
                            <div className="cov-lotties" style={{ position: 'absolute', top: '500px', left: '215px', width: '70%' }}>
                                <img src="/image/brdetect.svg" alt="" className="img-fluid" />

                                {/* <Lottie
                        
                        options={defaultOptions}
                        height={1920}
                        width={'100%'}
                    /> */}
                            </div> : null}
                        <div className="result">
                            {
                                this.state.detect ?
                                    <div className="name-result">
                                        {this.state.welcome_status ? <p className="status-process">{this.state.welcome_word}</p> : null}

                                        {this.state.nickname_status ? <p className="name-user">{this.state.nickname}</p> : null}

                                        {this.state.group_status ? <p className="group">{this.state.role_name}</p> : null}

                                    </div>
                                    :
                                    null
                            }
                            {
                                this.state.detect ?

                                    <div className="row list-result">

                                        <div className="col-lg-6 time">
                                            <div className="box-time">
                                                <div className="cov-ta-time">
                                                    {this.TimeValid() ?
                                                        <div className="img-result">
                                                            <img src="/image/icon/timeg.svg" alt="" className="img-fluid" />
                                                        </div>
                                                        :
                                                        <div className="img-result">
                                                            <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
                                                        </div>
                                                    }
                                                    <div className="result-num">
                                                        <p className="num">{hours + "." + minutes + " " + word['oclock'][this.state.language]}</p>
                                                        <p className="status-time">{this.TimeValid() ? word['On time'][this.state.language] : word['Late'][this.state.language]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 temperature">
                                            <div className="box-tem">
                                                <div className="cov-ta-tem">
                                                    <div className="result-temper">
                                                        <p className="num">{this.state.temp}</p>
                                                        <p className="status-time">{this.state.temp < this.state.ThermalHeightest ? word['Scanning pass'][this.state.language] : word['Scanning not pass'][this.state.language]}</p>
                                                    </div>

                                                    <div className="img-tem">
                                                        {
                                                            this.state.temp < this.state.ThermalHeightest ?
                                                                <img src="/image/icon/temg.svg" alt="" className="img-fluid" /> :
                                                                <img src="/image/icon/temr.svg" alt="" className="img-fluid" />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : <div className="name-result">
                                        <p className="status-process">{word['Please stand in front of camara.'][this.state.language]}</p>
                                    </div>
                            }

                            <div className="row list-result">
                                {
                                    this.state.pm25_status && this.state.pm25_res != null ?
                                        <div className="col-lg-6 time">
                                            <div className="box-time">
                                                <div className="cov-ta-time">
                                                    <div className="img-result">
                                                        <img src="/image/icon/timeg.svg" alt="" className="img-fluid" />
                                                    </div>

                                                    <div className="result-num">
                                                        <p className="num"> {this.state.pm25_res}</p>
                                                        <p className="status-time">{this.pm25_color(this.state.pm25_res)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : null}
                                {
                                    this.state.weather_status && this.state.weather_res != null ?
                                        <div className="col-lg-6 temperature">
                                            <div className="box-tem">
                                                <div className="cov-ta-tem">
                                                    <div className="result-temper">
                                                        <p className="num">{this.state.weather_res}</p>
                                                        <p className="status-time">{this.state.location}</p>
                                                    </div>
                                                    <div className="img-tem">
                                                        {
                                                            this.state.temp < 37.5 ?
                                                                <img src="/image/icon/temg.svg" alt="" className="img-fluid" /> :
                                                                <img src="/image/icon/temr.svg" alt="" className="img-fluid" />
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        : null}
                                {
                                    this.state.detect && this.state.mask != null ?
                                        this.state.mask == "mask" ?
                                            <div className="name-result">
                                                <p className="status-process">{word['Mask'][this.state.language]}</p>
                                            </div>
                                            : <div className="name-result">
                                                <p className="status-process">{word['Unmask'][this.state.language]}</p>
                                            </div>
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Home