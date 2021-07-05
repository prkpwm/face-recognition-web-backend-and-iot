import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Camera} from "../../services/APIs/Camera";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './menu.scss'
import { GetLanguage} from "../../services/APIs/Setting";


library.add(fas)

class Menu extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language:"TH"
        }

    }

    componentDidMount(){ 
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
        console.log(this.state.language)
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
                            {console.log(this.state.language)}
                            <h1 className="hd"> {this.state.language == "TH" ? "เมนูหลัก" : "Main Menu" }</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/membersetting" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/member.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == "TH" ? "การตั้งค่าสมาชิก" : "Member Setting" }</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/setting" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/setting.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == "TH" ? "การตั้งค่า" : "Setting" }</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/wifi.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == "TH" ? "การกำหนดค่าเครือข่าย" : "Network configuration" }</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/checkupdate" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/update.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == "TH" ? "อัพเดทระบบ" : "Check for update" }</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/settingpassword" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/password.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == "TH" ? "การตั้งรหัสผ่าน" : "Password Setting" }</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/about" className="pagemenu">
                                        <div className="img-icon">
                                            <img src="/image/icon/gw.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == "TH" ? "เกี่ยวกับเรา" : "About us" }</p>
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