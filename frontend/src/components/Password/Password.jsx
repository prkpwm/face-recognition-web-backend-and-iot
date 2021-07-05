import React from 'react';
import { message } from 'antd';
import { Auth } from "../../services/APIs/Login";
import 'antd/dist/antd.css';
import './password.scss'
import { GetLanguage } from "../../services/APIs/Setting";


class Password extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            Password: "",
            language: 'TH',
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
    }

    Login(e) { // Login to setting
        // console.log('Pass',e.target.value);
        var value = e.target.value
        this.setState({
            Password: e.target.value
        })

        this.Checkpassword(value);
    }

    Checkpassword(password) {
        let Password = password;
        if (Password.length === 8) {
            Auth(password)
                .then(_Auth => {
                    // console.log("DATA", _Auth)
                    if (_Auth.data.status) {
                        localStorage.setItem('_Token', _Auth.data.token);
                        var lock = document.getElementById("lock");
                        var unlock = document.getElementById("unlock");

                        lock.classList.toggle("d-none");
                        unlock.classList.toggle("d-block");


                        setTimeout(function () {
                            window.location.href = "/menu";
                          }, 300);


                    } else {
                        message.error({
                            content: this.state.language == "TH" ? 'รหัสผ่านไม่ถูกต้อง':'Wrong password',
                            className: 'message-alert',
                            // duration: 200,
                            style: {
                                marginTop: '5vh',
                            },
                        });
                    }
                })

                .catch(_AuthError => console.error(_AuthError))
        }

    }


    render() {





        return (
            <div>
                <div className="size-web">
                    <div className="cov-unlock">
                        <div className="img-lock">
                        <img src="/image/Password/lock.gif" id="lock" alt="" className="img-fluid imgpass" />
                            {/* <img src="/image/Password/lock.png" id="lock" alt="" className="img-fluid imgpass" /> */}
                            <img src="/image/Password/unlock2.gif" id="unlock" alt="" className="img-fluid imgpass img-n" />
                            {/* <img src="/image/Password/unlock@2x.png" id="unlock" alt="" className="img-fluid imgpass img-n" /> */}

                        </div>
                        <div className="input-pass">
                            <div className="covbox">
                                <input type="password" onChange={(e) => { this.Login(e) }} className="form-control box-pass" maxLength="8" placeholder = {this.state.language == "TH" ? "รหัสผ่าน": "Password"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Password