import endpoint from '../../api/endpoint'
export default {
    getCheckPlanInfoById(id) {
        return endpoint.http().get("/qltyarlMoralEducationManage/getMoralEducationBaseinfo/" + id).then(resp => {
            return resp.data
        }).catch(error => {
            throw error
        })
    },
    getStudentApplys() {
        return endpoint.http().get("/qltyarlMoralEducationManage/getStudentApplys").then(resp => {
            return resp.data
        }).catch(error => {
            throw error
        })
    },
    //   getMenus() {
    //     return endpoint.http().post("/getMenus").then(resp => {
    //       return resp.data
    //     }).catch(error => {
    //       throw error
    //     })
    //   }
}
