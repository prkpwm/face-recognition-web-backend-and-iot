import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './checkupdate.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";

library.add(fas)


let word = require('../../word.json');

class Checkupdate extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            lasttime:"",
            loading: true
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
                        lasttime:localStorage.getItem("lasttime"),

                    })


                }
            })

            .catch(_EditError => {
                window.location.href = "/password";
            })
    }

    onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    onCheck() {

        this.setState({
            lasttime: ("0" + new Date().getDate()).slice(-2)+"/"+("0"+(new Date().getMonth()+1)).slice(-2)+"/"+(""+new Date().getFullYear()).slice(-2),

        })
        localStorage.setItem("lasttime",("0" + new Date().getDate()).slice(-2)+"/"+("0"+(new Date().getMonth()+1)).slice(-2)+"/"+(""+new Date().getFullYear()).slice(-2))
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
                                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Check for update'][this.state.language]}</h1>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">{word['Check for update'][this.state.language]}</p>
                                </div>
                                <div className="cov-save">
                                    <button className="btn btn-primary btn-save" onClick={() => { this.onCheck() }} >{word['Check'][this.state.language]}</button>
                                </div>
                            </div>

                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">{word['Scanner Ver.'][this.state.language]} <br />0</p>
                                </div>
                                <div className="btnac">
                                    <p className="lastup">{word['Last update'][this.state.language]} {this.state.lasttime}</p>
                                </div>
                            </div>
                        </div>
                        <div className="boxset">
                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">{word['Check for update'][this.state.language]}</p>
                                </div>
                                <div className="btnac">
                                    <Switch className="switcho" defaultChecked onChange={(e) => this.onChange(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Checkupdate