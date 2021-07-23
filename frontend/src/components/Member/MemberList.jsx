import React from 'react';
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import $ from 'jquery'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'jquery/dist/jquery.slim.min.js';
import 'animate.css/animate.min.css';
import './memberlist.scss'
import { Getgroup, FindMemberByIDGroup } from "../../services/APIs/Group";
import { GetMemList } from '../../services/APIs/Member';
import { GetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";
library.add(fas)
let word = require('../../word.json');

class MemberList extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            listgroup: [],
            list_data: "",
            id: this.useQueryString().id,
            language: 'TH',
            loading: true
        }

    }


    componentDidMount() {
        let reiceve_id = this.useQueryString()
        console.log('pass id anoter:', reiceve_id['id'])

        Getgroup({ id: this.state.id })
            .then(res => {
                console.log('res :', res);
                if (res.data.status) {
                    // console.log("DATAGRoup", res.data.msg)
                    this.setState({
                        listgroup: res.data.msg
                    })
                }
            })
            .catch(_GroupError => {
                window.location.href = "/password";
            })
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);

        $(document).ready(function () {
            $('.cov-group').click(function () {
                console.log("hhhh");
                $('.cov-group').removeClass('active');
                $(this).addClass('active');
            });
        });

        console.log('recieve id: ', reiceve_id['id'])
        if (reiceve_id['id'] !== null) {
            console.log('get member list by id')
            FindMemberByIDGroup(reiceve_id['id'])
                .then(res => {
                    if (res.data.status) {
                        // console.log("DATAGRoup", res.data.msg)
                        this.setState({
                            list_data: res.data.msg
                        })
                        // console.log(this.state.listbyID)
                    }
                })
                .catch(_GroupError => {
                    window.location.href = "/password";
                    // console.log(_GroupError)
                })
        } else {
            console.log('get member list')
            GetMemList()
                .then(res => {
                    if (res.data.status) {
                        this.setState({
                            list_data: res.data.msg
                        })
                    }
                })
                .catch(_GroupError => {
                    window.location.href = "/password";
                    // console.log(_GroupError)
                })
        }
    }


    Toggleclass() {
        var element = document.getElementById("animateSearch");
        element.classList.toggle("d-block");
        element.classList.toggle("animate__fadeInUpBig");
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
        // console.log('this.state.id: ', this.state.id);
        // console.log('list_data:',this.state.list_data)s
        // console.log('data mm:',this.state.list_data)
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
                                <a href="/membersetting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Member List'][this.state.language]}</h1>
                        </div>
                        <div className="box-display">
                            <div className="cov-btnaction">
                                <div className="lbtn">
                                    <button type="button" onClick={() => { window.location.href = "/register"; }} className="btn btn-secondary btn-list"><img src="/image/icon/plus@2x.png" alt="" className="img-fluid icon-plus" /></button>
                                    <button type="button" onClick={() => { window.location.href = "/importfile"; }} className="btn btn-secondary btn-list"><img src="/image/icon/import@2x.png" alt="" className="img-fluid icon-import" /></button>
                                    <button type="button" className="btn btn-secondary btn-list"><img src="/image/icon/select@2x.png" alt="" className="img-fluid icon-select" /></button>
                                </div>
                                <div className="rbtn">
                                    <button type="button" className="btn btn-secondary btn-list" onClick={() => { this.Toggleclass() }}><FontAwesomeIcon className="btn-search" icon={['fas', 'search']} /></button>
                                </div>
                            </div>
                            <p className="hd-group">{word['Group type'][this.state.language]}</p>
                            <div className="slide-member">
                                <Slider
                                    // asNavFor={this.state.nav1}
                                    // ref={slider => (this.slider2 = slider)}
                                    slidesToShow={3}
                                    swipeToSlide={true}
                                    focusOnSelect={true}
                                    centerMode={true}
                                    centerPadding={"60px"}
                                    arrows={false}
                                    variableWidth={false}
                                    swipeToSlide={true}
                                    infinite={true}
                                    className="slide-name"
                                >

                                    <div>
                                        <div className="cov-group active">
                                            <div className="namegroup">
                                                <p className="name">All</p>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.listgroup ? this.state.listgroup.map(v => (
                                        <div key={v._id}>
                                            <div className="cov-group">
                                                <div className="namegroup">
                                                    <p className="name">{v.group}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : null}

                                </Slider>
                                <div className="detail-slide">
                                    <div className="slidebottom">
                                        <div className="cov-list-name">
                                            {this.state.list_data ? this.state.list_data.map((v, index) => (
                                                <div className="list-name" key={v.user_id} onClick={() => { window.location.href = "/editmember?id=" + v.user_id }}>
                                                    <div className="ta-list">
                                                        <div className="code">
                                                            <p className="num">{index}</p>
                                                        </div>
                                                        <div className="name">
                                                            <p className="txt">{v.nickname}</p>
                                                        </div>
                                                        <div className="group">
                                                            <p className="txt">{v.mm[0].group_name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : null}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div id="animateSearch" className="animate__animated box-search">
                                <div className="input-group boxgroup">
                                    <input type="search" placeholder="..." aria-describedby="button-addon1" className="form-control border-0 bg-light search-group" />
                                    <div className="input-group-append">
                                        <button id="button-addon1" type="submit" className="btn btn-link text-primary"><FontAwesomeIcon icon={['fas', 'search']} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default MemberList