import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from 'antd';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Swal from "sweetalert2";
import { Getgroup, AddGroup, Editgroup, Deletegroup } from "../../services/APIs/Group";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'jquery/dist/jquery.slim.min.js';
import 'animate.css/animate.min.css';
import 'antd/dist/antd.css';
import './groupmanager.scss';

library.add(fas)


class GroupManager extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            name_group: "",
            listgroup: [],
            idgroupedit: "",
            name_group_edit: "",
            name_search: ""
        }

    }


    componentDidMount() {
        Getgroup() // API Get All Group
            .then(_Group => {

                if (_Group.data.status) {

                    // console.log("DATAGRoup", _Group.data.msg)
                    this.setState({
                        listgroup: _Group.data.msg
                    })

                }
            })

            .catch(_GroupError =>{
                window.location.href = "/password";
            })
    }


    Toggleclass() {  // toogle class search 
        var element = document.getElementById("animateSearch");
        element.classList.toggle("d-block");
        element.classList.toggle("animate__fadeInUpBig");
    }

    setEdit(value){   //set value modal edit
        this.setState({
            idgroupedit: value._id,
            name_group_edit: value.group
        })
    }


    OnchangeName(e) { //change group name add
        // console.log("Name",e.target.value)
        this.setState({
            name_group: e.target.value
        })
    }

    OnchangeEditName(e) { // chage group name edit
        // console.log("Name",e.target.value)
        this.setState({
            name_group_edit: e.target.value
        })
    }
    onChangeSearch(e){ // Search Group
        // console.log("Search",e.target)
        var value = e.target.value;
        var str = value.toLocaleLowerCase();
        const arrlist = [];
        
        Getgroup()
        .then(_Group => { 
                _Group.data.msg.filter(name => name.group.toLowerCase().includes(str)).map(filteredName => (
                    arrlist.push(filteredName)
                ))
            // console.log("ARR",arrlist)
            this.setState({
                listgroup: arrlist
            })
        })

        .catch(_GroupError => console.error(_GroupError))
        // this.setState({
        //     name_search: e.target.value
        // })
    }


    AddGroupName(){ //ADD GROUP
        var data = {
            name: this.state.name_group   
        }
        AddGroup(data)
        .then(_Add => {

            if (_Add.data.status) {

                message.success({
                    content: 'Done',
                    className: 'message-done',
                    // duration: 500,
                    style: {
                        marginTop: '2vh',
                    },
                });

                setTimeout(function () {
                    window.location.href = "/groupmanager";
                  }, 300);

            }else {
                message.error({
                    content: 'Please try again.',
                    className: 'message-alert',
                    // duration: 200,
                    style: {
                        marginTop: '2vh',
                    },
                });
            }
        })

        .catch(_AddError => console.error(_AddError))
    }


    EditGroupName(){ //ADD GROUP
        var data = {
            id: this.state.idgroupedit,
            name: this.state.name_group_edit  
        }
        Editgroup(data)
        .then(_Edit => {

            if (_Edit.data.status) {

                message.success({
                    content: 'Done',
                    className: 'message-done',
                    // duration: 500,
                    style: {
                        marginTop: '2vh',
                    },
                });

                setTimeout(function () {
                    window.location.href = "/groupmanager";
                  }, 300);

            }else {
                message.error({
                    content: 'Please try again.',
                    className: 'message-alert',
                    // duration: 200,
                    style: {
                        marginTop: '2vh',
                    },
                });
            }
        })

        .catch(_EditError => console.error(_EditError))
    }


    DeleteGroupName(){ //Delete Group 
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                popup: 'popup-delete',
              confirmButton: 'btn btn-success btn-confirm',
              cancelButton: 'btn btn-danger btn-cancel',
              title: 'txt-ask',
              text: 'des-txt'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: false
          }).then((result) => {
            // console.log("Respond",result)
            if (result.value) {
                var data = {
                    id: this.state.idgroupedit,
                }
                Deletegroup(data)
                .then(respond => {
                    if (respond.data.status) {
                        message.success({
                            content: 'Done',
                            className: 'message-done',
                            // duration: 500,
                            style: {
                                marginTop: '2vh',
                            },
                        });
        
                        setTimeout(function () {
                            window.location.href = "/groupmanager";
                          }, 300);
        
                    }else{
                        message.error({
                            content: 'Please try again.',
                            className: 'message-alert',
                            // duration: 200,
                            style: {
                                marginTop: '2vh',
                            },
                        });
                      }
                })
        
                .catch(_respondError => console.error(_respondError))
              
            } 
          })
    }

    // SearchGroup(){
    //     var value = this.state.name_search;
    //     var str = value.toLocaleLowerCase();
    //     const arrlist = [];
        
    //     Getgroup()
    //     .then(_Group => { 
    //             _Group.data.msg.filter(name => name.group.toLowerCase().includes(str)).map(filteredName => (
    //                 arrlist.push(filteredName)
    //             ))
    //         // console.log("ARR",arrlist)
    //         this.setState({
    //             listgroup: arrlist
    //         })
    //     })

    //     .catch(_GroupError => console.error(_GroupError))

            
    // }



    render() {
        return (
            <div>
                <div className="size-web group-page">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/membersetting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Group manager</h1>
                        </div>
                        <div className="cov-group-member">
                            <div className="boxadd">
                                <div className="btn-add">
                                    {/* Button trigger modal */}
                                    <button type="button" className="btn btn-primary btn-group" data-toggle="modal" data-target="#Modaladdgroup">New Group</button>


                                </div>
                                <div className="btn-search">
                                    <button type="button" onClick={() => { this.Toggleclass() }} className="btn btn-primary btn-icon">
                                        <FontAwesomeIcon icon={['fas', 'search']} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="list-member">
                            {this.state.listgroup ? this.state.listgroup.map(v => (
                                <div className="box-manage" key={v._id}>
                                    <div className="boxmenuname" >
                                        <a href={"/memberlist?id="+v._id} className="link-menu">
                                            <p className="name">{v.group}</p>
                                        </a>
                                    </div>
                                    <div className="btn-action">
                                        <button type="button" className="btn btn-primary btn-group" data-toggle="modal" onClick={()=>{this.setEdit(v)}} data-target="#Modaleditgroup">
                                            <FontAwesomeIcon icon={['fas', 'ellipsis-h']} />
                                        </button>
                                    </div>
                                </div>
                            )) : null}
                        </div>
                        <div id="animateSearch" className="animate__animated box-search">
                            <div className="input-group boxgroup">
                                <input type="search" placeholder="..." aria-describedby="button-addon1" onChange={(e)=>{this.onChangeSearch(e)}} className="form-control border-0 bg-light search-group" />
                                <div className="input-group-append">
                                    <button id="button-addon1" onClick={() => {this.SearchGroup()}} className="btn btn-link text-primary"><FontAwesomeIcon icon={['fas', 'search']} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Modal */}
                    <div className="modal fade" id="Modaladdgroup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true"><FontAwesomeIcon icon={['fas', 'less-than']} /></span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="boxcreate">
                                        <h3 className="hd">New group</h3>
                                        <input type="text" onChange={(e) => { this.OnchangeName(e) }} placeholder="Group name" className="form-control boxdata" />
                                    </div>
                                    <div className="btnaddgroup">
                                        <button type="button" onClick={()=>{this.AddGroupName()}} className="btn btn-primary btn-add-new">
                                            Add new group
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal */}
                    <div className="modal fade" id="Modaleditgroup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true"><FontAwesomeIcon icon={['fas', 'less-than']} /></span>
                                    </button>
                                    <button type="button" onClick={() => {this.DeleteGroupName()}} className="delete">
                                        <FontAwesomeIcon icon={['fas', 'trash']} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="boxcreate">
                                        <h3 className="hd">Edit group</h3>
                                        <input value={this.state.name_group_edit ? this.state.name_group_edit : ""} type="text" onChange={(e) => { this.OnchangeEditName(e) }} placeholder="Group name" className="form-control boxdata" />
                                    </div>
                                    <div className="btnaddgroup">
                                        <button onClick={()=>{this.EditGroupName()}} type="button" className="btn btn-primary btn-add-new">
                                            Edit group
                                    </button>
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

export default GroupManager