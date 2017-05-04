var routePrefixApi = '/api';
var routePrefixAdmin = '/api-admin';
var routeOpenApi = '/open-api';

module.exports = {
    modules: [
        {
            atom_id: 'snv-tentacle-static',
            module_path: './static',
            route: {
                routePrefix: '/'
            },
        },
        {
            atom_id: 'snv-tentacle-echo',
            module_path: './echo',
            route: {
                routePrefix: `${routePrefixApi}/echo`
            },
        },
        {
            atom_id: 'snv-tentacle-app2micro',
            module_path: './app2micro',
            route: {
                routePrefix: `${routePrefixApi}/app2micro`
            },
            model: {
                types: ['weapp', 'screenshot']
            }
        },
        {
            atom_id: 'snv-tentacle-poy',
            module_path: './poy',
            route: {
                routePrefix: `${routePrefixApi}/poy/dashboard`
            }
        },
        {
            atom_id: 'snv-tentacle-maintaince',
            module_path: './maintance',
            route: {
                routePrefix: `${routePrefixApi}/maintance`
            }
        },
        {
            atom_id: 'snv-tentacle-user',
            module_path: './user',
            route: {
                routePrefix: `${routePrefixApi}/user`
            },
            model: {
                types: [
                    'user', 
                    'project', 
                    'userBizInfo', 
                    'issue', 
                    'question', 
                    'releationship_user_issue', 
                    'releationship_user_question', 
                    'comment', 
                    'loginSession'
                ]
            }
        },
        {
            atom_id: 'snv-tentacle-admin',
            module_path: './admin',
            route: {
                routePrefix: `${routePrefixAdmin}`
            },
            model: {
                types: [
                    'admin-usergroups',
                    'admin-user'
                ]
            }
        },
        {
            atom_id: 'snv-hydra',
            module_path: './hydra',
            route: {
                routePrefix: `${routeOpenApi}`
            }
        }
    ]
}