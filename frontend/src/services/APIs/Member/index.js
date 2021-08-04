import axios from 'axios'


const getGroup = () => {
    
    return axios.get("http://192.168.0.253:1969/private/api/v1/getMemberGroup", {
    
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('_Token')
            }
        })

}

const GetMemList = () =>{
    return axios.get("http://192.168.0.253:1969/private/api/v1/selectMemberlist", {
    
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('_Token')
            }
        })
}


// removeMemberlist
const removeMemberlist = (Data)=>{
    console.log('data', Data)
    let formData = new FormData()
    formData.set('id', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/removeMemberlist", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const EditMemberList = (Data)=>{
    console.log('data img-->', Data)
    let formData = new FormData()
    formData.set('user_id', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/selectMemberByID", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const GetMemberListByID = (Data)=>{
    console.log('data img-->', Data)
    let formData = new FormData()
    formData.set('user_id', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/selectMemberByID", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const readCSV = (Data)=>{
    let formData = new FormData()
    console.log(Data)
    formData.append(
        "file",
        Data,
        Data.name
    );
    return axios.post("http://192.168.0.252:2424/readCSV", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const reportEmail = (Data)=>{
    let formData = new FormData()
    console.log(Data)
    formData.set('receiver', Data)

    return axios.post("http://192.168.0.252:2424/reportEmail", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const reportLine = (Data)=>{
    let formData = new FormData()
    console.log(Data)
    formData.set('receiver', Data.receiver)
    formData.set('msg', Data.msg)
    return axios.post("http://192.168.0.252:2424/reportLine", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export {
    GetMemberListByID,
    getGroup,
    GetMemList,
    removeMemberlist,
    readCSV,
    reportEmail,
    reportLine
}