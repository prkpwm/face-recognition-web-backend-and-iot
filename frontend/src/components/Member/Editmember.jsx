import React from "react";
import { Radio, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import "antd/dist/antd.css";
import "antd/dist/antd.css";
import "./editmember.scss";
import { GetMemberListByID } from "../../services/APIs/Member"
import { GetLanguage } from "../../services/APIs/Setting";

library.add(fas);

const { Option } = Select;

class Editmember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.useQueryString().id,
      nickname: "",
      gender: "",
      firstname: "",
      lastname: "",
      role: "",
      email: "",
      phone: "",
      line: "",
      language: 'TH',
    };
  }

  componentDidMount() {
    let reiceve_id = this.useQueryString()
    console.log('pass id edit member:', reiceve_id['id'])

    //select data call 
    GetMemberListByID(reiceve_id['id']) // display all
      .then(memberByID => {
        console.log(memberByID.data.msg)
        if (memberByID.data.status) {

          setTimeout(() => {
            this.setState({
              loading_page: false
            })
          }, 800);


          this.setState({
            id: reiceve_id['id'],
            nickname: memberByID.data.msg[0].nickname,
            gender: memberByID.data.msg[0].gender,
            firstname: memberByID.data.msg[0].firstname,
            lastname: memberByID.data.msg[0].lastname,
            role: memberByID.data.msg[0].role,
            email: memberByID.data.msg[0].email,
            phone: memberByID.data.msg[0].phone,
            line: memberByID.data.msg[0].line
          })
        }
      })

      .catch(_DisplayError => {
        window.location.href = "/password";
      })
    GetLanguage() // Get language for display
      .then(_Edit => {
        if (_Edit.data.status) {
          this.setState({
            language: _Edit.data.msg[0].lang,
          })
        }
      })
  }

  handleChange(event) {
    //console.log(`selected ${value}`);
  }

  useQueryString = () => {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const payload = {
      id: params.get('id')
    }
    return payload;

  }

  render() {
    return (
      <div>
        <div className="size-web">
          <div className="cov-menu">
            <div className="hmenu">
              <div className="icon-back">
                <a href="/memberlist" className="link-back">
                  <FontAwesomeIcon icon={["fas", "less-than"]} />
                </a>
              </div>
              <h1 className="hd">{ this.state.language == 'TH' ? 'การตั้งค่าสมาชิก': 'Member setting'}</h1>
            </div>
            <div className="form-regis">
              <div className="box-general">
                <p className="hd-detail">{ this.state.language == 'TH' ? 'โปรไฟล์ทั่วไป': 'General profile'}</p>
                <div className="form-row">
                  <div className="col-lg-8 colname">
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.nickname ? this.state.nickname : ""}
                      placeholder="Nickname (show on display)"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="col-lg-4 colgender">
                    <div className="gender">
                      <Radio.Group
                        className="group-radio"
                        defaultValue="MALE"
                        buttonStyle="solid"
                      >
                        <Radio.Button className="vmale" value="MALE">
                          <div className="img-gender">
                            <img
                              src="/image/Gender/male.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </Radio.Button>
                        <Radio.Button className="vfemale" value="FEMALE">
                          <div className="img-gender">
                            <img
                              src="/image/Gender/female.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
                <div className="form-row boxname">
                  <div className="col-lg-6 colfirst">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-lg-6 collast">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="form-group boxselect">
                  <Select
                    className="tabselect"
                    placeholder="Select group"
                    defaultValue={null}
                    onChange={e => {
                      this.handleChange(e);
                    }}
                  >
                    <Option className="option-segroup" value="STUDENT">
                    { this.state.language == 'TH' ? 'นักเรียน': 'Student'}
                    </Option>
                    <Option className="option-segroup" value="TEACHER">
                    { this.state.language == 'TH' ? 'Teacher': 'Teacher'}
                    </Option>
                    <Option className="option-segroup" value="STUDENT2">
                    { this.state.language == 'TH' ? 'นักเรียน2': 'Student2'}
                    </Option>
                  </Select>
                </div>
              </div>
              <div className="box-address-report">
                <p className="hd-detail">{ this.state.language == 'TH' ? 'รายงานถึง': 'Report to'}</p>
                <div className="form-group boxemail">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
                <div className="form-group boxtel">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone number"
                  />
                </div>
                <div className="form-group boxline">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Line id"
                  />
                </div>
              </div>
              <div className="box-img">
                <img
                  id="image"
                  align="middle"
                  className="img-fluid video-regis"
                  src="http://192.168.0.252:3050/video_feed"
                />
                <div className="cov-btn">
                  <button
                    type="button"
                    className="btn btn-primary btn-save-video"
                  >
                    <img
                      src="/image/icon/btn-save.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </button>
                </div>
                <div className="cov-btn-save">
                  <button
                    type="button"
                    className="btn btn-primary btn-save-data"
                  >
                   { this.state.language == 'TH' ? 'บันทึก': 'Save'} 
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Editmember;
