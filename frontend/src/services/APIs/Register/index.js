import axios from 'axios'


const RegisterUser = (Data) => {
    
    // console.log(Data)
    let formData = new FormData()
    formData.set('nickname',Data.nickname)
    formData.set('gender',Data.gender)
    formData.set('firstname',Data.firstname)
    formData.set('lastname',Data.lastname)
    formData.set('role',Data.role)
    formData.set('email',Data.email)
    formData.set('phone',Data.phone)
    formData.set('line',Data.line)


    return axios.post("http://192.168.0.252:2424/insert_register", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}





export {
    RegisterUser
}