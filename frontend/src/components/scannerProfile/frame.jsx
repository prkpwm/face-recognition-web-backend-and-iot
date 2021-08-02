import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './frame.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";

library.add(fas)



// let word = {'':{'EN':'','TH':''},

//         }
let word = require('../../word.json');

class frame extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            t1: false,
            t2: true,
            language: "TH",
            loading: true
        }

    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                t1: localStorage.getItem('t1') != null ? (/true/i).test(localStorage.getItem('t1')) : false,
                t2: localStorage.getItem('t2') != null ? (/true/i).test(localStorage.getItem('t2')) : true,
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);

    }



    onChanget1(event) {
        console.log(event);
        this.setState({
            t1: event,

        })
        localStorage.setItem('t1', event)
    }

    onChanget2(event) {
        console.log(event);
        this.setState({
            t2: event,

        })
        localStorage.setItem('t2', event)
    }
    onChange(checked) {
        console.log(`switch to ${checked}`);
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
                            <h1 className="hd">{word['Frame'][this.state.language]}</h1>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="logo">

                                    <img src="/image/brdetect.svg" alt="" className="img-fluid" />

                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.t1} onChange={(e) => this.onChanget1(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="boxset">
                            <div className="cov-ta">
                                <div className="logo">

                                    <img src="/image/Human.png" alt="" className="img-fluid" />

                                </div>

                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.t2} onChange={(e) => this.onChanget2(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default frame