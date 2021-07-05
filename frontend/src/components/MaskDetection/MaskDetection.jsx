import React from 'react';
// import Lottie from 'react-lottie';
// import animationData from '../../lotties/human.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera } from "../../services/APIs/Camera";
import socketIOClient from "socket.io-client";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";

import './MaskDetection.scss'

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


class MaskDetection extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            response: [],
        }
    }

    componentDidMount() {
        steam_open = true
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


    Switchtosetting() { // action show button 
        var element = document.getElementById("setting");
        element.classList.toggle("show");
    }


    render() {

        console.log("ffff", this.state.response)

        return (
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
                        {console.log("+++++++++++")}
                        <div className="box-img">
                            <img id="image" align="middle" className="img-fluid img-stream" src="http://192.168.0.252:3050/video_feed" />

                        </div>
                        <div className="cov-lotties" style={{ position: 'absolute', top: '0px', width: '100%' }}>
                            <img src="/image/Human.png" alt="" className="img-fluid" />
                        </div>
                        <div className="result">
                            {
                                face_valid ?
                                    <div className="name-result">
                                        <p className="status-process">Pass.</p>
                                    </div>
                                    :
                                    <div className="name-result">
                                        <p className="status-process">Please wear a mask.</p>
                                    </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default MaskDetection