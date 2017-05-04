module.exports = {
                            phone: {
                                name: '手机号',
                                editable: true
                            },
                            email: {
                                name: '邮箱',
                                editable: true
                            },
                            nickname: {
                                name: '昵称',
                                editable: true
                            },
                            avatar: {
                                name: '头像',
                                type: 'image-single',
                                editable: true
                            },
                            sex: {
                                name: '性别',
                                valueConverter: value => {
                                    if(value == 'unset') {
                                        return '未知';
                                    }
                                    if(value == 'male') {
                                        return '男';
                                    }
                                    if(value == 'female') {
                                        return '女';
                                    }
                                },
                                editable: true,
                                type: 'select',
                                selectOptions: [
                                    {
                                        id: 'unset',
                                        name: '未知'
                                    },
                                    {
                                        id: 'male',
                                        name: '男'
                                    },
                                    {
                                        id: 'female',
                                        name: '女'
                                    }
                                ]
                            },
                            birthday: {
                                name: '生日',
                                editable: true,
                                type: 'date'
                            },
                            latitude: {
                                hidden: true,
                                name: '纬度',
                                editable: true,
                                type: 'text'
                            },
                            longitude: {
                                hidden: true,
                                name: '经度',
                                editable: true,
                                type: 'text'
                            },
                            verifyBin: {
                                hidden: true,
                                editable: false
                            },
                            freeze: {
                                name: '账户状态',
                                editable: true,
                                valueConverter: value => {
                                    if(value == true) {
                                        return '禁用';
                                    }
                                    if(!value || value == false) {
                                        return '可用';
                                    }
                                },
                                editable: true,
                                type: 'select',
                                selectOptions: [
                                    {
                                        id: true,
                                        name: '冻结'
                                    },
                                    {
                                        id: false,
                                        name: '可用'
                                    }
                                ],
                            },
                            createdAt: {
                                name: '创建日期',
                                hidden: true,
                                editable: true,
                                type: 'date'
                            },
                            updatedAt: {
                                name: '修改日期',
                                hidden: true,
                                editable: true,
                                type: 'date'
                            },
                            deletedAt: {
                                name: '禁用',
                                hidden: true,
                                editable: true,
                                type: 'date'
                            }
                        }