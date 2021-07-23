import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { message } from 'antd';
import { CehckOldPassword, UpdatePassword } from "../../services/APIs/Setting";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './NetworkConnection.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { connectNetwork, getNetwork } from "../../services/APIs/NetworkConfig";
import {BarDate} from "../BarDate";
import { RotateSpinner } from "react-spinners-kit";
let word = require('../../word.json');

library.add(fas)

class SettingPassword extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            ssid: "",
            language: "TH",
            password:"",
            status_checkout_password:null,
            loading: true
        }

    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        this.setState({
            ssid: params.get('ssid')
        })


    }
    OnChangeOldPassword(e) { // check old password
        var value = e.target.value
        this.setState({
            password: e.target.value
        })

    }



    connectNet() {
        let info = {"ssid":this.state.ssid,"password":this.state.password}
        // console.log(info)
        connectNetwork(info)
            .then(_status => {
                if (_status.data.status) {
                    this.setState({
                        status_checkout_password: true,
                    })
                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });
        
                } else {
              
                    this.setState({
                        status_checkout_password: false,
                        
                    })
                    message.error({
                        content: word['Connection failed.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '5vh',
                        },
                    });

                }
            })
            .catch(_statusError => console.error(_statusError))

    }



    useQueryString = () => {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const payload = {
            ssid: params.get('ssid')
        }
        return payload;

    }
    render() {



        // console.log(this.state.status_checkold_password)

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
                                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Network Connection'][this.state.language]}</h1>
                        </div>
                        <div className="box-inputset">
                            <div className="box-old">
                                <div className="form-group">
                                    <label className="la-pass" htmlFor="Oldpass" >SSID </label>
                                    <input type="text" maxLength="64" value={this.state.ssid} placeholder={this.state.ssid} className="form-control input-data" id="Oldpass" />
                                </div>
                            </div>
                            <div className="box-old">
                                <div className="form-group">
                                    <label className="la-pass" htmlFor="Oldpass">{word['Password'][this.state.language]}</label>
                                    <input type="text" maxLength="64" onChange={(e) => { this.OnChangeOldPassword(e) }} value={this.state.password} className="form-control input-data" id="Oldpass" />
                                    <div className={"color-status " + (this.state.status_checkout_password == true ? "green" : this.state.status_checkout_password == false ? "red" : null)}></div>
                                </div>
                            </div>

                            <div className="cov-save">
                                <button className="btn btn-primary btn-save"  onClick={() => { this.connectNet() }}>{word['Connect'][this.state.language]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default SettingPassword