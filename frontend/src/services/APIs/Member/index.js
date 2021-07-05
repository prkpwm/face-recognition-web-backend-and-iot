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

// const EditMemberList = (Data)=>{
//     console.log('data img-->', Data)
//     let formData = new FormData()
//     formData.set('user_id', Data)
//     console.log(formData)
//     return axios.post("http://192.168.0.253:1969/private/api/v1/selectMemberByID", formData, { 
//         headers: {
//             'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     })
// }

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





export {
    GetMemberListByID,
    getGroup,
    GetMemList
}