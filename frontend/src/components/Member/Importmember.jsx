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

library.add(fas)

const { Option } = Select;
let word = require('../../word.json');
class Importmember extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
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
                <div className="loading" style={{visibility: this.state.loading? "visible" : "hidden"}}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/memberlist" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <div className="select-file">
                                <div className="cov-box">
                                    <p className="txt">{word['Select file'][this.state.language]}</p>
                                    <div className="cov-btn-file">
                                        <button type="button" className="btn btn-secondary btn-list"><img src="/image/icon/import@2x.png" alt="" className="img-fluid icon-import" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cov-btn-add">
                            <button type="button" disabled className="btn btn-secondary btn-add">{word['Add'][this.state.language]}</button>
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
                                                            <label className="hinput">{word['Nickname'][this.state.language]}</label>
                                                            <input type="text" className="form-control" placeholder="Nickname" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="hinput">{word['Full Name'][this.state.language]}</label>
                                                            <input type="text" className="form-control full" placeholder="Name" />
                                                            <input type="text" className="form-control last" placeholder="Lastname" />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="hinput">{word['Report to'][this.state.language]}</label>
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
                                                            <label className="hinput">{word['Nickname'][this.state.language]}</label>
                                                            <input type="text" className="form-control" placeholder="Nickname" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="hinput">{word['Full Name'][this.state.language]}</label>
                                                            <input type="text" className="form-control full" placeholder="Name" />
                                                            <input type="text" className="form-control last" placeholder="Lastname" />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="hinput">{word['Report to'][this.state.language]}</label>
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