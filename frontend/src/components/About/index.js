import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './about.scss';

class About extends Component {
  render() {
    return (
      <div>
        <div className="size-web">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">About us</h1>
                        </div>
                        <div className="img-logo">
                          <img className="img-fluid logogw" src="/image/Logo/Logogw.svg"/>
                        </div>
                        <div className="intro">
                          <p className="txt">GridWhiz เป็น บริษัท ที่รับปรึกษาวางระบบและ ปรับใช้เทคโนโลยีเพื่อการบริหารงานและ งานระบบไฟฟ้าให้กับองค์กรต่างๆ</p>
                        </div>
                        <div className="hmenu mcontact">
                            <h1 className="hd">Contact us</h1>
                        </div>
                        <div className="intro">
                          <p className="nameoffice">GridWhiz (Thailand) Co. Ltd. (Headquarters)</p>
                          <p className="txt address">184/185 Forum Tower 28th Fl. Ratchadapisek Rd. Huai Khwang, Bangkok 10310 Tel: +66 2061 9519 Fax: +66 2061 9519 Hot-line Support Tel: +66 9 7185 0083</p>
                        </div>
                    </div>
                </div>
      </div>
    )
  }
}

export default About;