import React from 'react';
import { Radio, Select, Checkbox } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import './importmember.scss'
import { GetLanguage } from "../../services/APIs/Setting";
library.add(fas)

const { Option } = Select;


class Importmember extends React.Component {

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

    handleChange(value) {
        console.log(`selected ${value}`);
    }


    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }


    render() {





        return (
            <div>
                <div className="size-web">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/memberlist" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <div className="select-file">
                                <div className="cov-box">
                                    <p className="txt">{this.state.language == 'TH' ? 'เลือกไฟล์': 'Select file'}</p>
                                    <div className="cov-btn-file">
                                        <button type="button" className="btn btn-secondary btn-list"><img src="/image/icon/import@2x.png" alt="" className="img-fluid icon-import" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cov-btn-add">
                            <button type="button" disabled className="btn btn-secondary btn-add">{this.state.language == 'TH' ? 'เพิ่ม': 'Add'}</button>
                        </div>
                        <div className="list-member-add">
                            <div className="bs-example">
                                <div className="accordion" id="accordionExample">
                                    <Checkbox.Group style={{ width: '100%' }} onChange={(e) => { this.onChange(e) }}>
                                        <div className="card">
                                            <div className="card-header" id="headingOne">
                                                <div className="cov-part">
                                                    <div className="cov-checked">
                                                        <Checkbox className="input-check" value="A"></Checkbox>
                                                    </div>
                                                    <div className="cov-btn">
                                                        <button type="button" className="btn btn-link btn-toggle" data-toggle="collapse" data-target="#collapseOne">
                                                            <p className="txt">Baitoey</p>
                                                        </button>
                                                    </div>
                                                    <div className="status">
                                                        <div className="color-red"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="edit-profile">
                                                        <div className="form-group">
                                                            <label className="hinput">{this.state.language == 'TH' ? 'ชื่อเล่น': 'Nickname'}</label>
                                                            <input type="text" className="form-control" placeholder="Nickname" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="hinput">{this.state.language == 'TH' ? 'ชื่อเต็ม': 'Full Name'}</label>
                                                            <input type="text" className="form-control full" placeholder="Name" />
                                                            <input type="text" className="form-control last" placeholder="Lastname" />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="hinput">{this.state.language == 'TH' ? 'รายงานถึง': 'Report to'}</label>
                                                            <input type="email" className="form-control email" placeholder="Email" />
                                                            <input type="text" className="form-control phone" placeholder="Phone number" />
                                                            <input type="text" className="form-control line" placeholder="LineID" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="card-header" id="headingTwo">
                                                <div className="cov-part">
                                                    <div className="cov-checked">
                                                        <Checkbox className="input-check" value="b"></Checkbox>
                                                    </div>
                                                    <div className="cov-btn">
                                                        <button type="button" className="btn btn-link btn-toggle" data-toggle="collapse" data-target="#collapseTwo">
                                                            <p className="txt">Baitoey</p>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="edit-profile">
                                                        <div className="form-group">
                                                            <label className="hinput">{this.state.language == 'TH' ? 'ชื่อเล่น': 'Nickname'}</label>
                                                            <input type="text" className="form-control" placeholder="Nickname" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="hinput">{this.state.language == 'TH' ? 'ชื่อเต็ม': 'Full Name'}</label>
                                                            <input type="text" className="form-control full" placeholder="Name" />
                                                            <input type="text" className="form-control last" placeholder="Lastname" />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="hinput">{this.state.language == 'TH' ? 'รายงานถึง': 'Report to'}</label>
                                                            <input type="email" className="form-control email" placeholder="Email" />
                                                            <input type="text" className="form-control phone" placeholder="Phone number" />
                                                            <input type="text" className="form-control line" placeholder="LineID" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Checkbox.Group>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )

    }



}

export default Importmember