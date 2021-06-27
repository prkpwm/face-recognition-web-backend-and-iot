import requests
	
port_manage = 2525
ip_address = '192.168.0.100'

def manage_process():
    url = 'http://{}:{}/manage_camera'.format(ip_address,2424)
    msg_send = {'camera':'register'}
    requests.post(url,msg_send)
    print('send success')

def manage_register():
    url = 'http://{}:{}/manage_camera'.format(ip_address,2424)
    msg_send = {'camera':'undetection'}
    requests.post(url,msg_send)
    print('send success')


def test_register():
    url = 'http://{}:{}/insert_register'.format(ip_address,2424)
    msg_send = {
            'nickname':'pepomomos',
            'gender':'male',
            'firstname':'alongkorns',
            'lastname':'wiangchais',
            'role':'Student',
            'email':'lelalomos@gmail.com',
            'phone':'0815957629',
            'line':'moslovefamily24',
            }
    data = requests.post(url,msg_send)
    data_response = data.json()
    print(data_response)
    print('send success')

def test_send():
    url = 'http://{}:{}/say'.format(ip_address,port_manage)
    msg_send = {'data_test':'lelalomos'}
    requests.post(url,msg_send)
    print('send success')

def test_get_member_list():
    url = 'http://{}:{}/getMemberList'.format(ip_address,port_manage)
    #msg_send = {'data_test':'lelalomos'}
    print(url)
    requests.post(url)
    print('send success')

def test_remove_member_list():
    url = 'http://{}:{}/removeMemberList'.format(ip_address,port_manage)
    msg_send = {'user_id':'1'}
    print(url)
    requests.post(url,msg_send)
    print('send success')

def test_update_member_list():
    url = 'http://192.168.0.100:1969/updateMemberlist'
    msg_send = {
            'user_id':'1',
            'nickname':'xxx',
            'gender':'female',
            'firstname':'xxx',
            'lastname':'xxxx',
            'role':'techer',
            'email':'xxxx@gmail.com',
            'phone':'0815957629',
            'line':'xxxxxxx'
            }
    print(url)
    data_res = requests.post(url,msg_send)
    res = data_res.json()
    print('update member list:',res)
    print('send success')

def test_select_member_group():
    url = 'http://192.168.0.100:1969/getMemberGroup'
    print(url)
    request_data = requests.get(url)
    data = request_data.json()
    print('select member group: {}'.format(data))
    print('send success')

def test_add_member_group():
    url = 'http://192.168.0.100:1969/addMemberGroup'
    msg_send = {'group_name':'Legendary'}
    print(url)
    requests.post(url,msg_send)
    print('send success')

def test_remove_member_group():
    url = 'http://192.168.0.100:1969/removeMemberGroup'
    msg_send = {'id':'5f7443119ff5cc7d2d7d8730'}
    print(url)
    requests.post(url,msg_send)
    print('send success')

def test_get_scanner_header():
    url = 'http://{}:{}/getScannerHeader'.format(ip_address,port_manage)
    print(url)
    request_data = requests.post(url)
    data = request_data.json()
    print('data scanner header: {}'.format(data))
    print('send success')

# wait test
def test_update_member_group():
    url = 'http://192.168.0.100:1969/updateMemberGroup'
    print(url)
    msg_send = {
            'id':'5f745f0e4930e8a4e3cb3be9',
            'group_name':'Nostale'
            }
    request_data = requests.post(url,msg_send)
    data = request_data.json()
    print('member group: {}'.format(data))
    print('send success')

#wait test
def test_update_scanner_header():
    url = 'http://{}:{}/updateScannerHeader'.format(ip_address,port_manage)
    print(url)
    msg_send = {
            'logo_header':False,
            'show_info':False
            }
    request_data = requests.post(url, msg_send)
    data = request_data.json()
    print('scanner header {}'.format(data))
    print('send success')

def test_get_information():
    url = 'http://{}:{}/getInformationSetting'.format(ip_address,port_manage)
    print(url)
    request_data = requests.post(url)
    data = request_data.json()
    print('get information: {}'.format(data))
    print('send success')

def test_update_information_setting():
    url = 'http://{}:{}/updateInformationSetting'.format(ip_address,port_manage)
    print(url)
    data = {
            'welcome_status':True,
            'nickname_status':True,
            'group_status':True,
            'checktime_status':True,
            'temp_status':True
            }
    request_data = requests.post(url,data)
    data = request_data.json()
    print('status update information setting: {}'.format(data))
    print('send success')

def test_update_frame_setting():
    url = 'http://192.168.0.100:1969/updateFrameSettingValue'
    print(url)
    data = {
            'rec_frame':False,
            'per_frame':False
            }
    request_data = requests.post(url,data)
    data= request_data.json()
    print('rec and per frame',data)
    print('success')

def test_select_scanner_header():
    url = 'http://192.168.0.100:1969/selectScannerHeader'
    print(url)
    request_data = requests.get(url)
    data = request_data.json()
    print('data:',data)
    print('success')

def test_update_value_information():
    url = 'http://192.168.0.100:1969/updateValueInformation'
    print(url)
    data = {
        'welcome_status':True,
        'nickname_status':True,
        'group_status':True,
        'checktime_status':True,
        'temp_status':True
    }
    request_data = requests.post(url,data)
    data = request_data.json()
    print('update value information:',data)
    print('success')

def test_select_display_setting():
    url = 'http://192.168.0.100:1969/selectDisplaySetting'
    print(url)
    request_data = requests.get(url)
    data = request_data.json()
    print('select display setting',data)
    print('success')

def test_select_member_setting():
    url = 'http://192.168.0.100:1969/selectMemberSetting'
    print(url)
    request_data = requests.get(url)
    data = request_data.json()
    print('select member setting',data)
    print('success')

def test_select_scanner_mode():
	url = 'http://192.168.0.100:1969/selectScannerMode'
	print(url)
	request_data = requests.get(url)
	data = request_data.json()
	print('select scanner mode',data)
	print('success')

def test_update_scanner_mode_face_recognition():
    url = 'http://192.168.0.100:1969/updateScannerModeFace'
    print(url)
    data = {
    "status_face_recognition":False,
    "threshold_face_recognition":0.50
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('update scanner mode face recognition',res_data)
    print('success')

def test_update_scanner_mode_thermal():
    url = 'http://192.168.0.100:1969/updateScannerModeThermal'
    print(url)
    data = {
        "status_thermal":False,
        "thermal_hight":38.0,
        "thermal_low":25
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('update scanner mode thermal',res_data)
    print('success')

def test_update_password():
    url = 'http://192.168.0.100:1969/updatePassword'
    print(url)
    data = {
        "password":"pepomomos"
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('update password',res_data)
    print('success')

def test_select_attendance():
    url = 'http://192.168.0.100:1969/selectAttendance'
    print(url)
    request_data = requests.get(url)
    res_data = request_data.json()
    print('select attendance',res_data)
    print('success')

def test_update_attendance():
    url= 'http://192.168.0.100:1969/updateAttendance'
    print(url)
    data = {
        "check_status":False,
        "ontime":16,
        "work_mo":False,
        "work_tu":False,
        "work_wed":False,
        "work_thu":False,
        "work_fri":False,
        "work_sat":True,
        "work_sun":True,
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('update attendance',res_data)
    print('success')
    
def test_select_member_by_group():
    url = 'http://192.168.0.100:1969/findMemberGroup'
    print(url)
    data = {
        "group_name":"Student"
    }
    request_data = requests.get(url,data)
    res_data = request_data.json()
    print('select member group: ',res_data)
    print('success')
    
def test_authen():
    url = 'http://192.168.0.100:1969/authentication' 
    print(url)
    data = {
        "password":"lelalomos"
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('auth',res_data)
    print('success')
    
def test_insert_pass():
    url = 'http://192.168.0.100:1969/insertPassword'
    print(url)
    data = {
        "password":"rootroot"
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('insert pass',res_data)
    print('success')
    
def test_select_all_display():
    url = 'http://192.168.0.100:1969/selectDisplayAllData'
    print(url)
    request_data = requests.get(url)
    res_data = request_data.json()
    print('select all data: ',res_data)
    print('success')

def test_select_member_list():
    url = 'http://192.168.0.100:1969/selectMemberlist'
    print(url)
    request_data = requests.get(url)
    res_data = request_data.json()
    print('select member list: ',res_data)
    print('success')
    
def test_delete_member_list():
    url = 'http://192.168.0.100:1969/removeMemberlist'
    print(url)
    data = {
        "id":"4"
    }
    request_data = requests.post(url,data)
    res_data = request_data.json()
    print('remove member list',res_data)
    print('success')

def test_select_frame_setting():
    url = 'http://192.168.0.100:1969/selectFrameSetting'
    print(url)
    request_data = requests.get(url)
    data_res = request_data.json()
    print('select frame setting: ',data_res)
    print('success')
    
def test_select_scanner_header():
    url = 'http://192.168.0.100:1969/selectScannerHeader'
    print(url)
    request_data = requests.get(url)
    data_res = request_data.json()
    print('select scanner header: ',data_res)
    print('success')
    
def test_update_scanner_header():
    url = 'http://192.168.0.100:1969/updateScannerHeader'
    print(url)
    data = {
        "logo_header":False,
        "show_info":False
    }
    request_data = requests.post(url,data)
    data_res = request_data.json()
    print('update scanner header: ',data_res)
    print('success')
    
def test_ip_server():
    url = 'http://192.168.0.253:1969/testDatabase'
    request_data = requests.post(url)
    data_res = request_data.json()
    print('test sent:',data_res)
    

if __name__ == '__main__':
    test_ip_server()
    #golang
    #test_update_scanner_header()
    #test_select_scanner_header()
    #test_select_frame_setting()
    #test_update_member_list() # w8 test
    #test_select_member_group()
    #test_remove_member_group()
    #test_add_member_group()
    #test_update_member_group()
    #test_delete_member_list()
    #test_select_member_list()
    #test_select_all_display()
    #test_authen()
    #test_insert_pass()
    #test_select_member_by_group()
    #test_update_attendance()
    #test_select_attendance()
    #test_update_password()
    #test_update_scanner_mode_thermal()
    #test_update_scanner_mode_face_recognition()
	#test_select_scanner_mode()
    #test_select_member_setting()
    #test_select_display_setting()
    #test_select_scanner_header()
    #test_update_value_information()
    #test_update_frame_setting()
    #python
    #test_update_information_setting()
    #test_get_information()
    #test_update_scanner_header()
    #test_get_scanner_header()
    #test_remove_member_list()
    #test_get_member_list()
    #manage_process()
    #manage_register()
    #test_register()
    #test_send()

