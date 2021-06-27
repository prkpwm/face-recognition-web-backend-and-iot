// src/routes.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Switch, Route, Redirect } from "react-router";

import About from './components/About';
import NotFound from './components/NotFound';
import {Home} from './components/Home';
import {Menu} from './components/Menu';
import {Password} from './components/Password';
import {MemberSetting, GroupManager, MemberList, Register, Editmember, Importmember} from './components/Member';
import {Setting, Sound, Report, Checkin} from './components/Setting';
import {Language} from './components/Language';
import {Scanner} from './components/Scanner';
import {Checkupdate} from './components/Checkupdate';
import {SettingPassword} from './components/SettingPassword';
import {Display, Views} from './components/Display';




export default () => {
  return (
      <BrowserRouter>
                  <Switch>
                      <Route exact path={'/'} component={Home} />
                     
                      <Route exact path={'/password'} component={Password} />
                      {localStorage.getItem('_Token') ? (

                      <Switch>
                      <Route exact path={'/menu'} component={Menu} />
                      <Route exact path={'/membersetting'} component={MemberSetting} />
                      <Route exact path={'/groupmanager'} component={GroupManager} />
                      <Route exact path={'/memberlist'} component={MemberList} />
                      <Route exact path={'/register'} component={Register} />
                      <Route exact path={'/editmember'} component={Editmember} />
                      <Route exact path={'/importfile'} component={Importmember} />
                      <Route exact path={'/about'} component={About} />
                      <Route exact path={'/setting'} component={Setting} />
                      <Route exact path={'/language'} component={Language} />
                      <Route exact path={'/scanner'} component={Scanner} />
                      <Route exact path={'/checkupdate'} component={Checkupdate} />
                      <Route exact path={'/settingpassword'} component={SettingPassword} />
                      <Route exact path={'/sound'} component={Sound} />
                      <Route exact path={'/display'} component={Display} />
                      <Route exact path={'/settingdisplay'} component={Views} />
                      <Route exact path={'/report'} component={Report} />
                      <Route exact path={'/check'} component={Checkin} />
                      <Route component={NotFound} />
                      </Switch>
                      ) : (<Redirect to={'/password'} />)}
                  </Switch>
      </BrowserRouter>
  )

}
