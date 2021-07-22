import React from 'react';
import { Radio, Select, message } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Camera } from "../../services/APIs/Camera";
import { RegisterUser } from "../../services/APIs/Register";
import { getGroup } from "../../services/APIs/Member";
import socketIOClient from "socket.io-client";
import { ImpulseSpinner } from "react-spinners-kit";
import { GetLanguage } from "../../services/APIs/Setting";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import './register.scss'
import { RotateSpinner } from "react-spinners-kit";

library.add(fas)

const { Option } = Select;
let word = require('../../word.json');

const Btnshow = "http://192.168.0.252:2626";

class Register extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            Nickname: null,
            Gender: "MALE",
            FirstName: null,
            LastName: null,
            Group: null,
            Email: null,
            Phone: null,
            Line: null,
            getGroup: [],
            showbtn: true,
            load: false,
            loading: true,
            btnsave: false



        }

    }

    componentDidMount() {
        Camera({ camera: 'undetection' })
            .then(_Camera => {
                console.log("DATA", _Camera.data)



            })

            .catch(_CameraError => console.error(_CameraError))

        getGroup()
            .then(_Group => {

                console.log(_Group.data)

                if (_Group.status == 200) {
                    this.setState({
                        getGroup: _Group.data.msg
                    })
                }



            })

            .catch(_GroupError => console.error(_GroupError))
            setTimeout(() => {
                this.setState({
                    language: localStorage.getItem('lang'),
                    loading: false
                })
            }, 800);

        const socket = socketIOClient(Btnshow);
        socket.on("register", data => {

            // console.log('nnn',data)
            if (data.wait) {
                this.setState({
                    load: true
                })
            }
            if (data.done) {
                this.setState({
                    showbtn: true,
                    load: false,
                    btnsave: true
                })
            }

        });
    }


    handleChange(value) {
        console.log(`selected ${value}`);
        this.setState({
            Group: value
        })
    }

    OnchageNickname(e) {
        this.setState({
            Nickname: e.target.value
        })
    }

    onChangeGender(e) {
        // console.log('radio checked', e.target.value);
        this.setState({
            Gender: e.target.value,
        })
    }


    OnchageName(e) {
        this.setState({
            FirstName: e.target.value
        })
    }


    OnchageLastname(e) {
        this.setState({
            LastName: e.target.value
        })
    }

    OnchagePhone(e) {
        this.setState({
            Phone: e.target.value
        })
    }

    OnchageEmail(e) {
        this.setState({
            Email: e.target.value
        })
    }

    OnchageLine(e) {
        this.setState({
            Line: e.target.value
        })
    }

    Savevideo() {
        Camera({ camera: 'register' })
            .then(_Camera => {
                // console.log("DATARegis",_Camera)
                if (_Camera.data.status) {
                    this.setState({
                        showbtn: false
                    })
                }

            })

            .catch(_CameraError => console.error(_CameraError))
    }


    Saveprofile() {
        var Data = {
            nickname: this.state.Nickname,
            gender: this.state.Gender,
            firstname: this.state.FirstName,
            lastname: this.state.LastName,
            role: this.state.Group,
            email: this.state.Email,
            phone: this.state.Phone,
            line: this.state.Line
        }



        RegisterUser(Data)
            .then(_Register => {

                if (_Register.data.status) {

                    message.success({
                       content: word['Done'][this.state.language],
                        className: 'message-done',
                        // duration: 200,
                        style: {
                            marginTop: '5vh',
                        },
                    });

                    setTimeout(() => {
                        window.location.href = "/memberlist";
                    }, 800);

                } else {
                    message.error({
                       content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        // duration: 200,
                        style: {
                            marginTop: '5vh',
                        },
                    });
                }

            })

            .catch(_RegisterError => console.error(_RegisterError))
    }


    render() {





        return (
            <div>
                <div className="size-web">
                <div className="loading" style={{visibility: this.state.loading? "visible" : "hidden"}}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/memberlist" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Register'][this.state.language]}</h1>
                        </div>
                        <div className="form-regis">
                            <div className="box-general">
                                <p className="hd-detail">{word['General profile'][this.state.language]}</p>
                                <div className="form-row">
                                    <div className="col-lg-8 colname">
                                        <input type="text" onChange={(e) => { this.OnchageNickname(e) }} className="form-control" placeholder={word['Member List'][this.state.language]}/>
                                    </div>
                                    <div className="col-lg-4 colgender">
                                        <div className="gender">
                                            <Radio.Group className="group-radio" onChange={(e) => { this.onChangeGender(e) }} value={this.state.Gender} defaultValue={this.state.Gender} buttonStyle="solid">
                                                <Radio.Button className="vmale" value="Male">
                                                    <div className="img-gender">
                                                        <FontAwesomeIcon className="mars" icon={['fas', 'mars']} />
                                                        {/* <img src="/image/Gender/male.svg" alt="" className="img-fluid" /> */}
                                                    </div>
                                                </Radio.Button>
                                                <Radio.Button className="vfemale" value="FEMALE">
                                                    <div className="img-gender">
                                                        <FontAwesomeIcon className="venus" icon={['fas', 'venus']} />
                                                        {/* <img src="/image/Gender/female.svg" alt="" className="img-fluid" /> */}
                                                    </div>
                                                </Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row boxname">
                                    <div className="col-lg-6 colfirst">
                                        <input type="text" onChange={(e) => { this.OnchageName(e) }} className="form-control" placeholder={word['Name'][this.state.language]} />
                                    </div>
                                    <div className="col-lg-6 collast">
                                        <input type="text" onChange={(e) => { this.OnchageLastname(e) }} className="form-control" placeholder={word['Last name'][this.state.language]} />
                                    </div>
                                </div>
                                <div className="form-group boxselect">
                                    <Select className="tabselect" placeholder={this.state.language == 'TH' ? '': "Select group"} defaultValue={null} value={this.state.Group} onChange={(e) => { this.handleChange(e) }}>

                                        {(this.state.getGroup ? this.state.getGroup.map((v) => (
                                            // console.log(v)
                                            <Option className="option-segroup" key={v._id} value={v._id}>{v.group}</Option>
                                        )) : "")}
                                    </Select>
                                </div>
                            </div>
                            <div className="box-address-report">
                                <p className="hd-detail">{word['Member List'][this.state.language]}{this.state.language == 'TH' ? 'รายงานถึง': 'Report to'}</p>
                                <div className="form-group boxemail">
                                    <input type="email" onChange={(e) => { this.OnchageEmail(e) }} className="form-control" placeholder={word['Email'][this.state.language]}/>
                                </div>
                                <div className="form-group boxtel">
                                    <input type="number" maxLength="10" onChange={(e) => { this.OnchagePhone(e) }} className="form-control" placeholder={word['Phone number'][this.state.language]} pattern="[0-9]{10}" />
                                </div>
                                <div className="form-group boxline">
                                    <input type="text" onChange={(e) => { this.OnchageLine(e) }} className="form-control" placeholder={word['Line id'][this.state.language]} />
                                </div>
                            </div>
                            <div className="box-img">
                                <img id="image" align="middle" className="img-fluid video-regis" src="http://192.168.0.252:3050/video_feed" />
                                <div className="cov-btn">
                                    <div className={'load' + ' ' + (this.state.load ? 'show' : ' ')}>
                                        <ImpulseSpinner />
                                    </div>
                                    <button type="button" onClick={() => { this.Savevideo() }} className={'btn btn-primary btn-save-video' + ' ' + (this.state.showbtn ? 'show' : '')}>
                                        <img src="/image/icon/btn-save.svg" alt="" className="img-fluid" />
                                    </button>
                                </div>
                                <div className={'cov-btn-save' + ' ' + (this.state.btnsave ? 'show' : ' ')}>
                                    <button onClick={() => { this.Saveprofile() }} type="button" className="btn btn-primary btn-save-data">
                                    {word['Save'][this.state.language]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            // Change Port 
        )

    }



}

export default Register