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
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";
import { Upload, message, Switch, Input } from 'antd';
import { saveImg, saveLogo } from "../../services/APIs/Header";
import { readCSV } from '../../services/APIs/Member';
import { RegisterUser } from "../../services/APIs/Register";

library.add(fas)

const { Option } = Select;
let word = require('../../word.json');
class Importmember extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            loading: true,
            data: null,


        }
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);

    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);
    }

    handleChange(info) {
        console.log(info.file.originFileObj)
        readCSV(info.file.originFileObj)
            .then(Data => {
                console.log(Data.data.data)
                if (Data.data.status) {
                    this.setState({
                        data: Data.data.data
                    })
                }
            })
    }


    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    onClick() {
        console.log('onClick');
        RegisterUser(this.state.data)
            .then(_Register => {

                if (_Register.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        // duration: 200,
                        style: {
                            marginTop: '5vh',
                        },
                    });

                    setTimeout(() => {
                        window.location.href = "/memberlist";
                    }, 800);

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        // duration: 200,
                        style: {
                            marginTop: '5vh',
                        },
                    });
                }

            })

            .catch(_RegisterError => console.error(_RegisterError))
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
                                <a href="/memberlist" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <div className="select-file">
                                <div className="cov-box">
                                    <p className="txt">{word['Select file'][this.state.language]}</p>
                                    <div className="cov-btn-file">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            onChange={this.handleChange}
                                        >

                                            <div className="cov-btn-img">
                                                <div className="box-img">
                                                    <div className="br-img">
                                                        {/* <FontAwesomeIcon className="icon-add" icon={['fas', 'plus']} /> */}
                                                        <img src="/image/icon/import@2x.png" alt="" className="img-fluid icon-import" />
                                                    </div>
                                                </div>

                                            </div>
                                        </Upload>
                                        {/* <button type="button" className="btn btn-secondary btn-list"><img src="/image/icon/import@2x.png" alt="" className="img-fluid icon-import" /></button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cov-btn-add">
                            {this.state.data != null ?
                                <button type="button" className="btn btn-secondary btn-add" onClick={this.onClick}>{word['Add'][this.state.language]}</button>
                                : null
                            }
                        </div>
                        <div className="list-member-add">
                            <div className="bs-example">
                                <div className="accordion" id="accordionExample">

                                    {this.state.data != null ? this.state.data.map((v, index) => (
                                        <div className="single-line">
                                            <Checkbox.Group style={{ width: '100%' }} onChange={(e) => { this.onChange(e) }}>
                                                <div className="card">
                                                    <div className="card-header" id="headingOne">
                                                        <div className="cov-part">
                                                            <div className="cov-checked">
                                                                <Checkbox className="input-check" value="A"></Checkbox>
                                                            </div>
                                                            <div className="cov-btn">
                                                                <button type="button" className="btn btn-link btn-toggle" data-toggle="collapse" data-target="#collapseOne">
                                                                    <p className="txt">{v.nickname}</p>
                                                                </button>
                                                            </div>
                                                            <div className="status">
                                                                <div className="color-green"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <div className="edit-profile">
                                                                <div className="form-group">
                                                                    <label className="hinput">{word['Nickname'][this.state.language]}</label>
                                                                    <input type="text" className="form-control" placeholder="Nickname" value={v.nickname} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="hinput">{word['Full Name'][this.state.language]}</label>
                                                                    <input type="text" className="form-control full" placeholder="Name" value={v.firstname} />
                                                                    <input type="text" className="form-control last" placeholder="Lastname" value={v.lastname} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label className="hinput">{word['Role'][this.state.language]}</label>
                                                                    <input type="text" className="form-control full" placeholder="Name" value={v.role} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="hinput">{word['Group'][this.state.language]}</label>
                                                                    <input type="text" className="form-control full" placeholder="Name" value={v.group} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label className="hinput">{word['Report to'][this.state.language]}</label>
                                                                    <input type="email" className="form-control email" placeholder="Email" value={v.email} />
                                                                    <input type="text" className="form-control phone" placeholder="Phone number" value={v.phone} />
                                                                    <input type="text" className="form-control line" placeholder="LineID" value={v.line} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                            </Checkbox.Group>
                                        </div>
                                    )) : null}

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