import {
  loginAuth,
  adminAuth
} from '../../../middlewares/authorization';

function AdminUser() {
    return require('../model/admin-user')();
}

function AdminUserGroups() {
    return require('../model/admin-usergroups')();
}

module.exports = router => {
    router.postAsync('/changeMember', async function(req, res) {
        let params = req.body;
        let {
            groupId,
            ownedMemberKeys = [],
        } = params;
        //加法 
        AdminUser().update({
            adminUsergroupId: groupId
        }, {
            where: {
                id: {
                    $in: ownedMemberKeys   
                }
            }
        });

        //减法
        if(ownedMemberKeys == null || ownedMemberKeys.length == 0) {//`$notIn: []` = `not in (NULL)`不是期望的true
            AdminUser().update({
                adminUsergroupId: null
            }, {
                where: {
                    $and: {
                        adminUsergroupId: groupId
                    }
                }
            });
        } else {
            AdminUser().update({
                adminUsergroupId: null
            }, {
                where: {
                    $and: {
                        id: {
                            $notIn: ownedMemberKeys   
                        },
                        adminUsergroupId: groupId
                    }
                }
            });
        }
        res.toApiJson('successful');
    });   
}