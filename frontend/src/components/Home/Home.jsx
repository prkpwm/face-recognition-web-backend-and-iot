import React from 'react';
// import Lottie from 'react-lottie';
// import animationData from '../../lotties/human.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera } from "../../services/APIs/Camera";
import { weather } from "../../services/APIs/weather";
import socketIOClient from "socket.io-client";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { GetLanguage } from "../../services/APIs/Setting";

import './home.scss'
const axios = require('axios');
library.add(fas)


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
        }

    }

    componentDidMount() {
        steam_open = true
        Camera({ camera: 'detection' }) // Switch camera
            .then(_Camera => {
                console.log("DATA", _Camera)
            })

            .catch(_CameraError => console.error(_CameraError))

        weather({ data: 'pm' }) // Switch camera
            .then(data => {
                console.log("DATA", data)
                this.setState({
                    weather_info: data
                })

                console.log(this.state.weather_info.data.position.split(",")[1])
            })
            .catch(_CameraError => console.error(_CameraError))
        GetLanguage() // Get language for display
            .then(_Edit => {
                if (_Edit.data.status) {
                    this.setState({
                        language: _Edit.data.msg[0].lang,
                    })
                }
            })
        // const socket = socketIOClient(ENDPOINT);
        // socket.on("predict_face", data => {
        //     this.setState({
        //         response: data
        //     })
        // });

    }
    TimeValid() { // action show button 
        if (hours > hour_set) {
            return true
        } else if (hours == hour_set && minutes >= min_set) {
            return true
        }
        return false
    }

    Switchtosetting() { // action show button 
        var element = document.getElementById("setting");
        element.classList.toggle("show");
    }

    pm25_color(num) {
        let colors = [25, 50, 100, 200]
        let means_th = ["ดีมาก", "ดี", "ปานกลาง", "เริ่มมีผลกระทบต่อสุขภาพ", "มีผลกระทบต่อสุขภาพ"]
        let means_en = ["Very good", "good", "moderate", "starting to affect health", "affect health"]
        for (let i = 0; i < colors.length; i++) {
            if (num <= colors[i]) {
                return (this.state.language=="TH" ? means_th[i] :means_en[i]) 
            }
        }
        return (this.state.language=="TH" ? means_th[means_th.length - 1] :means_en[means_en.length - 1]) 
    }


    render() {

        console.log("ffff", this.state.response)

        return (
            // <div>
            //     <div className="size-web">
            //         <div className="stream" onClick={() => { this.Switchtosetting() }}>
            //             <div className="btn-tologin" id="setting">
            //                 <a href="/password" className="link-login"><FontAwesomeIcon icon={['fas', 'tools']} /></a>
            //             </div>
            //             <div className="name-official">
            //                 <div className="cov-ta">
            //                     <div className="logo">
            //                         <div className="circle">
            //                             <img src="/image/Logo/logo-office.png" alt="" className="img-fluid" />
            //                         </div>
            //                     </div>
            //                     <div className="nameoff">
            //                         <p className="name">Hogwarts School of Witchcraft and wizardry</p>
            //                     </div>
            //                 </div>
            //             </div>
            //             {console.log("+++++++++++")}
            //             <div className="box-img">
            //                 {/* <video id="video" align="middle" className="img-fluid img-stream"  src="http://192.168.0.252:3050/video_feed" autoplay="autoplay" /> */}
            //                 <img id="image" align="middle" className="img-fluid img-stream" src="http://192.168.0.252:3050/video_feed" />

            //             </div>
            //             <div className="cov-lotties" style={{ position: 'absolute', top: '0px', width: '100%' }}>
            //                 <img src="/image/Human.png" alt="" className="img-fluid" />
            //                 {/* <Lottie

            //                     options={defaultOptions}
            //                     height={1920}
            //                     width={'100%'}
            //                 /> */}
            //             </div>
            //             <div className="result">
            //                 {
            //                     face_valid ?
            //                         <div className="name-result">
            //                             <p className="status-process">SUCCESS</p>
            //                             <p className="name-user">{name}</p>
            //                             <p className="group">{status}</p>
            //                         </div>
            //                         :
            //                         <div className="name-result">
            //                             <p className="status-process">Please stand in front of camara.</p>
            //                         </div>
            //                 }
            //                 {
            //                     this.state.weather_info.length != 0 ?
            //                         <div className="row list-result">
            //                             <div className="col-lg-6 time">
            //                                 <div className="box-time">
            //                                     <div className="cov-ta-time">
            //                                         <div className="img-result">
            //                                             <img src="/image/icon/timeg.svg" alt="" className="img-fluid" />
            //                                         </div>

            //                                         <div className="result-num">
            //                                             <p className="status-time">PM 2.5 {this.state.weather_info.data.pm25}</p>
            //                                         </div>
            //                                     </div>
            //                                 </div>
            //                             </div>
            //                         </div> :
            //                         null
            //                 }


            //                 {
            //                     this.state.weather_info.length != 0 ?
            //                         <div className="col-lg-6 temperature">
            //                             <div className="box-tem">
            //                                 <div className="cov-ta-tem">
            //                                     <div className="result-temper">
            //                                         <p className="num">{this.state.weather_info.data.weather}</p>
            //                                         <p className="status-time">{this.state.weather_info.data.weather}</p>
            //                                     </div>

            //                                     <div className="img-tem">
            //                                         {
            //                                             temp < 37.5 ?
            //                                                 <img src="/image/icon/temg.svg" alt="" className="img-fluid" /> :
            //                                                 <img src="/image/icon/temr.svg" alt="" className="img-fluid" />
            //                                         }
            //                                     </div>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                         :
            //                         null
            //                 }


            //                 {
            //                     face_valid ?
            // <div className="row list-result">
            //     <div className="col-lg-6 time">
            //         <div className="box-time">
            //             <div className="cov-ta-time">
            //                 {this.TimeValid() ?
            //                     <div className="img-result">
            //                         <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
            //                     </div>
            //                     :
            //                     <div className="img-result">
            //                         <img src="/image/icon/timeg.svg" alt="" className="img-fluid" />
            //                     </div>
            //                 }
            //                 <div className="result-num">
            //                     <p className="num">{hours + "." + minutes + " น."}</p>
            //                     <p className="status-time">{hours < 9 ? "มาตรงเวลา" : "มาสาย"}</p>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
            //                         :
            //                         null
            //                 }

            //                 {
            //                     face_valid ?
            // <div className="col-lg-6 temperature">
            //     <div className="box-tem">
            //         <div className="cov-ta-tem">
            //             <div className="result-temper">
            //                 <p className="num">{temp}</p>
            //                 <p className="status-time">{temp < 37.5 ? "อุณหภูมิผ่านเกณฑ์" : "อุณหภูมิไม่ผ่านเกณฑ์"}</p>
            //             </div>

            //             <div className="img-tem">
            //                 {
            //                     temp < 37.5 ?
            //                         <img src="/image/icon/temg.svg" alt="" className="img-fluid" /> :
            //                         <img src="/image/icon/temr.svg" alt="" className="img-fluid" />
            //                 }
            //             </div>
            //         </div>
            //     </div>
            // </div>
            //                         :
            //                         null
            //                 }

            //             </div>
            //         </div>
            //     </div>
            // </div>
            <div>
                <div className="size-web">
                    <div className="stream" onClick={() => { this.Switchtosetting() }}>
                        <div className="btn-tologin" id="setting">
                            <a href="/password" className="link-login"><FontAwesomeIcon icon={['fas', 'tools']} /></a>
                        </div>
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

                        <div className="box-img">

                            <img id="image" align="middle" className="img-fluid img-stream" src="http://192.168.0.252:3050/video_feed" />

                        </div>
                        <div className="cov-lotties" style={{ position: 'absolute', top: '0px', width: '100%' }}>
                            <img src="/image/Human.png" alt="" className="img-fluid" />
                            {/* <Lottie
                            
                            options={defaultOptions}
                            height={1920}
                            width={'100%'}
                        /> */}
                        </div>
                        {
                            face_valid ?
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
                                </div> :
                                <div className="result">
                                    {
                                        face_valid ?

                                            <div className="row list-result">

                                                <div className="col-lg-6 time">
                                                    <div className="box-time">
                                                        <div className="cov-ta-time">
                                                            {this.TimeValid() ?
                                                                <div className="img-result">
                                                                    <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
                                                                </div>
                                                                :
                                                                <div className="img-result">
                                                                    <img src="/image/icon/timeg.svg" alt="" className="img-fluid" />
                                                                </div>
                                                            }
                                                            <div className="result-num">
                                                                <p className="num">{hours + "." + minutes + " น."}</p>
                                                                <p className="status-time">{hours < 9 ? "มาตรงเวลา" : "มาสาย"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 temperature">
                                                    <div className="box-tem">
                                                        <div className="cov-ta-tem">
                                                            <div className="result-temper">
                                                                <p className="num">{temp}</p>
                                                                <p className="status-time">{temp < 37.5 ? "อุณหภูมิผ่านเกณฑ์" : "อุณหภูมิไม่ผ่านเกณฑ์"}</p>
                                                            </div>

                                                            <div className="img-tem">
                                                                {
                                                                    temp < 37.5 ?
                                                                        <img src="/image/icon/temg.svg" alt="" className="img-fluid" /> :
                                                                        <img src="/image/icon/temr.svg" alt="" className="img-fluid" />
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : <div className="name-result">
                                                <p className="status-process">{this.state.language == "TH" ? "กรุณายืนอยู่หน้ากล้อง": "Please stand in front of camara."}</p>
                                            </div>
                                    }

                                    {
                                        this.state.weather_info.length != 0 ?
                                            <div className="row list-result">

                                                <div className="col-lg-6 time">
                                                    <div className="box-time">
                                                        <div className="cov-ta-time">
                                                            <div className="img-result">
                                                                <img src="/image/icon/timeg.svg" alt="" className="img-fluid" />
                                                            </div>

                                                            <div className="result-num">
                                                                <p className="num"> {this.state.weather_info.data.pm25}</p>
                                                                <p className="status-time">{this.pm25_color(this.state.weather_info.data.pm25)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 temperature">
                                                    <div className="box-tem">
                                                        <div className="cov-ta-tem">
                                                            <div className="result-temper">
                                                                <p className="num">{this.state.weather_info.data.weather}</p>
                                                                <p className="status-time">{this.state.weather_info.data.position.split(",")[1]}</p>
                                                            </div>

                                                            <div className="img-tem">
                                                                {
                                                                    temp < 37.5 ?
                                                                        <img src="/image/icon/temg.svg" alt="" className="img-fluid" /> :
                                                                        <img src="/image/icon/temr.svg" alt="" className="img-fluid" />
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : null}
                                </div>

                        }



                    </div>
                </div>
            </div>
        )

    }



}

export default Home