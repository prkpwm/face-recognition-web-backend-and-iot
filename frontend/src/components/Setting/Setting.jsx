import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './setting.scss'
import { GetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";
library.add(fas)
let word = require('../../word.json');
class Setting extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            loading: true

        }

    }
    componentDidMount(){
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);
    }


    render() {





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
                            <h1 className="hd">{word['Setting'][this.state.language]}</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/scanner" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/scanner.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">{word['Scanner mode'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/scannerProfile" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/scanner.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">{word['Scanner Profile'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/display" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/display.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">{word['Display'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/sound" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/sound.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">{word['Sound'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/language" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/language.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">{word['Language'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/check" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/checkin.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">{word['Check in'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/report" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/report.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">{word['Report'][this.state.language]}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Setting