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
    getApplyDetails(a, b, c) {
        return endpoint.http().get(`/qltyarlMoralEducationManage/getApplyDetails/${a}/${b}/${c}`).then(resp => {
            return resp.data
        }).catch(error => {
            throw error
        })
    },
    getMyApplyDetails(id) {
        return endpoint.http().post(`/qltyarlMoralEducationManage/getMyApplyDetails/${id}`).then(resp => {
            return resp.data
        }).catch(error => {
            throw error
        })
    }
}
