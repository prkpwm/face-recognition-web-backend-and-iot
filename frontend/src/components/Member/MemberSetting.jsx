import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { GetLanguage } from "../../services/APIs/Setting";

import './membersetting.scss'

library.add(fas)


class MemberSetting extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
        }

    }
    componentDidMount() {
        GetLanguage() // Get language for display
            .then(_Edit => {
                if (_Edit.data.status) {
                    this.setState({
                        language: _Edit.data.msg[0].lang,
                    })
                }
            })
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
                            <h1 className="hd">{this.state.language == 'TH' ? 'การตั้งค่าสมาชิก': 'Member setting'}</h1>
                        </div>
                        <div className="cov-list-menu">
                            <div className="box-menu">
                                <div className="boxmenuname">
                                    <a href="/groupmanager" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/Member/group.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == 'TH' ? 'การจัดการกลุ่ม': 'Group manager'}</p>
                                    </a>
                                </div>
                                <div className="boxmenuname">
                                    <a href="/memberlist" className="link-menu">
                                        <div className="img-icon">
                                            <img src="/image/Member/memberlist.svg" alt="" className="img-fluid img-menu" />
                                        </div>
                                        <p className="name">{this.state.language == 'TH' ? 'รายชื่อสมาชิก': 'Member list'}</p>
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

export default MemberSetting