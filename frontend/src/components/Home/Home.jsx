import React from 'react';
// import Lottie from 'react-lottie';
// import animationData from '../../lotties/human.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera } from "../../services/APIs/Camera";
import socketIOClient from "socket.io-client";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";

import './home.scss'

library.add(fas)


// const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//         preserveAspectRatio: "xMidYMid slice"
//     }
// };



const ENDPOINT = "http://192.168.0.252:2323";


class Home extends React.Component {

    constructor(props) {

        super(props)
        this.state = {

            response: [],
        }

    }

    componentDidMount() {
        Camera({ camera: 'detection' }) // Switch camera
            .then(_Camera => {
                console.log("DATA", _Camera)


            })

            .catch(_CameraError => console.error(_CameraError))


        const socket = socketIOClient(ENDPOINT);
        socket.on("predict_face", data => {
            this.setState({
                response: data
            })
        });


    }

    Switchtosetting(){ // action show button 
        var element = document.getElementById("setting");
        element.classList.toggle("show");
    }


    render() {


        console.log("ffff", this.state.response)


        return (
            <div>
                <div className="size-web">
                    <div className="stream" onClick={() => {this.Switchtosetting()}}>
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
        )

    }



}

export default Home