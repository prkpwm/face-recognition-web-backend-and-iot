import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './checkupdate.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";


library.add(fas)



// let word = {'':{'EN':'','TH':''},

//         }

let word = {'Check for update':{'EN':'Check for update','TH':'ตรวจสอบสำหรับการปรับปรุง'},
            'Check':{'EN':'Check','TH':'ตรวจสอบ'},
            'Scanner Ver.':{'EN':'Scanner Ver.','TH':'เวอร์ชั่นสแกนเนอร์'},
            'Last update':{'EN':'Last update','TH':'การปรับปรุงครั้งล่าสุด'},

        }

class Checkupdate extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language:"TH",
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


    render() {





        return (
            <div>
                <div className="size-web">
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
                                <div className="btnac">
                                    <button type="button" className="btn btn-secondary btn-check">{word['Check'][this.state.language]}</button>
                                </div>
                            </div>

                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">{word['Scanner Ver.'][this.state.language]} 0</p>
                                </div>
                                <div className="btnac">
                                    <p className="lastup">{word['Last update'][this.state.language]} 00/00/0000</p>
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