import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera} from "../../services/APIs/Camera";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './menu.scss'


library.add(fas)

class Menu extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
        }

    }

    componentDidMount(){ 
        Camera({camera: 'undetection'}) // switch camera
        .then(_Camera => {
            console.log("DATA",_Camera.data)
     
        })
    }


    render() {





        return (
            <div>
                <div className="size-web">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Main Menu</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/membersetting" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/member.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">Member Setting</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/setting" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/setting.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">Setting</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/wifi.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">Network configuration</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/checkupdate" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/update.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">Check for update</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/settingpassword" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/password.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">Password Setting</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/about" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/gw.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">About us</p>
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