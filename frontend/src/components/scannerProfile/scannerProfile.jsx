import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './scannerProfile.scss'
import { GetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";
library.add(fas)
let word = require('../../word.json');
class scannerProfile extends React.Component {

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
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Scanner Profile'][this.state.language]}</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/scannerHeader" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/scanner.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">{word['Scanner Header'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/information" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/scanner.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">{word['Information'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/frame" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/display.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">{word['Frame'][this.state.language]}</p>
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

export default scannerProfile