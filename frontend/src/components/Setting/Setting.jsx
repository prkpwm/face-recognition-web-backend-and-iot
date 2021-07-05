import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './setting.scss'


library.add(fas)

class Setting extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
        }

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
                            <h1 className="hd">Setting</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/scanner" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/scanner.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">Scanner mode</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/display" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/display.svg" alt="" className="img-fluid imgsetting img-b" />
                                        </div>
                                        <p className="name">Display</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/sound" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/sound.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">Sound</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/language" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/language.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">Language</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/check" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/checkin.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">Check in</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/report" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/icon/report.svg" alt="" className="img-fluid imgsetting" />
                                        </div>
                                        <p className="name">Report</p>
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