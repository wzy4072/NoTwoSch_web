
import endpoint from '../endpoint'

export default {
    loadStaffList(corpId) {
        return endpoint.current_http().get("/corporate/" + corpId + "/teamstall")
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    loadRole(corpId, query, pageNo, pageSize) {
        return endpoint.current_http().get("/corporate/"+ corpId +"/role/load",
            {
                params: {
                    q: query,
                    p: pageNo,
                    s: pageSize
                }
            })
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            })
    },
    loadroleInfo(roleID) {
        return endpoint.current_http().get("/corporate/role/"+roleID)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            })
    },
    editRole(rolename, roleId, description, moduleIds) {
        return endpoint.current_http().post("/corporate/role/modity",
            {
                rolename,
                id: roleId,
                description,
                moduleIds
            }
        )
            .then(resp => resp.data)
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    deleteRole(roleId) {
        return endpoint.current_http().post("/corporate/role/delete/"+roleId)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            })
    },
    loadRoleStaffs(corpId, roleId) {
        return endpoint.current_http().post("/corporate/"+ corpId +"/role/current",
            {
                id: roleId
            }
        )
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            })
    },
    addStaffToRole(corpId, staffIds, roleId) {
        return endpoint.current_http().post("/corporate/"+ corpId +"/role/"+ roleId +"/add",
            {
                staffIds
            }
        )
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            })
    },
    
    teams(corpId, query, pageNo, pageSize, sortColumns) {
        return endpoint.current_http().get("corporate/" + corpId + "/team",
            {
                params: {
                    q: query,
                    p: pageNo,
                    s: pageSize
                }
            })
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    loadAllTeams(corpId) {
        return this.teams(corpId, null, null, null, null);
    },
    createTeam(corpId, name, description) {
        return endpoint.current_http().post("corporate/" + corpId + "/team",
            {
                name: name,
                description: description
            })
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    editTeam(corpId, name, description, teamID) {
        return endpoint.current_http().post("corporate/" + corpId + "/team/modity",
            {
                name: name,
                description: description,
                id: teamID
            })
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    deleteTeam(corpId, teamID) {
        return endpoint.current_http().post("/corporate/"+ corpId +"/team/delete", 
            {
                id: teamID
            })
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            })
    },
    loadTeamStaffs(corpId, teamId) {
        return endpoint.current_http().post("/corporate/"+ corpId +"/team/current",
            {
                id:teamId,
            }
        )
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    addStaffToTeam(corpId, staffIds, teamId) {
        return endpoint.current_http().post("/corporate/"+ corpId +"/team/"+ teamId +"/add",
            {
                staffIds:staffIds,
            }
        )
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
}