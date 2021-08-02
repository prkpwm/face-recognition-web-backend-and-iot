import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera } from "../../services/APIs/Camera";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './menu.scss'
import { GetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";

library.add(fas)
let word = require('../../word.json');
class Menu extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: localStorage.getItem('lang'),
            loading: true
        }

    }

    componentDidMount() {
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
                    
                    <div className="loading" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <BarDate></BarDate>
                    <div className="cov-menu">
                    
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            {console.log(this.state.language)}
                            <h1 className="hd">{word['Main Menu'][this.state.language]}</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/membersetting" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/member.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{word['Member Setting'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/setting" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/setting.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{word['Setting'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/NetworkConfig" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/wifi.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{word['Network configuration'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/checkupdate" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/update.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{word['Check for update'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/settingpassword" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/password.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{word['Password Setting'][this.state.language]}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/about" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/gw.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{word['About us'][this.state.language]}</p>
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

export default Menu