import axios from 'axios'


const AddGroup = (Data) => {
    
    // console.log(Data)
    let formData = new FormData()
    formData.set('group_name',Data.name)


    return axios.post("http://192.168.0.253:1969/private/api/v1/addMemberGroup", formData, {
    // return axios.post("http://192.168.100.129:1969/private/api/v1/addMemberGroup", formData, {

        
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}


const Getgroup = () => {
    return axios.get("http://192.168.0.253:1969/private/api/v1/getMemberGroup", {
    // return axios.get("http://192.168.100.129:1969/private/api/v1/getMemberGroup", {

        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })
    
}

const Editgroup = (Data) => {
    let formData = new FormData()
    formData.set('id',Data.id)
    formData.set('group_name',Data.name)


    return axios.post("http://192.168.0.253:1969/private/api/v1/updateMemberGroup", formData, {
    // return axios.post("http://192.168.100.129:1969/private/api/v1/updateMemberGroup", formData, {

        
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const Deletegroup = (Data) => {
    let formData = new FormData()
    formData.set('id',Data.id)


    return axios.post("http://192.168.0.253:1969/private/api/v1/removeMemberGroup", formData, {
    // return axios.post("http://192.168.100.129:1969/private/api/v1/removeMemberGroup", formData, {

        
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const FindMemberByIDGroup = (Data) => {
    let formData = new FormData()
    formData.set('group_id',Data)
    console.log(formData)

    return axios.post("http://192.168.0.253:1969/private/api/v1/findMemberByID", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })
}





export {
    AddGroup,
    Getgroup,
    Editgroup,
    Deletegroup,
    FindMemberByIDGroup
}