import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './about.scss';
import { RotateSpinner } from "react-spinners-kit";
import { GetLanguage } from "../../services/APIs/Setting";
import { BarDate } from "../BarDate";
let word = require('../../word.json');

class About extends Component {
  constructor(props) {

    super(props)
    this.state = {
      language: 'TH',
      loading: false,

    }

  }

  componentDidMount() {
    this.setState({
      loading: true
    })
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
                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
              </div>
              <h1 className="hd">{word['About us'][this.state.language]}</h1>
            </div>
            <div className="img-logo">
              <img className="img-fluid logogw" src="/image/Logo/Logogw.svg" />
            </div>
            <div className="intro">
              <p className="txt">{word['GridWhiz Descripter'][this.state.language]}</p>
            </div>
            <div className="hmenu mcontact">
              <h1 className="hd">{word['Contact us'][this.state.language]}</h1>
            </div>
            <div className="intro">
              <p className="nameoffice">{word['GridWhiz Headquarters'][this.state.language]}</p>
              <p className="txt address">{word['GridWhiz Address'][this.state.language]}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default About;