// 1
// 二级块名
// 二级块id
// 是否有三级块儿

// 三级块列表（项）

// 项名 id 
// 项值1名 值1 id 关联id
// 值1 类型等
// 是否可添加多个

// 附件对应项还是值

let config = [
    {
        blockName: '活动项目（不可增加/关联类型/三级/附件对应项）',
        blockId: 1,
        haveItem: true,// 是否有三级
        uploadToItem: true,// 上传是否对应到项
        canAdd: false, // 可否用户自定义增加
        itemList: [
            {
                itemName: '党团活动',
                itemId: 11,
                uploadValid: {
                    limit: 5,
                    size: 5
                },
                values: [
                    {
                        id: 111,
                        rId: '111-1', // 关联id 可以无关联
                        name: '累计次数',
                        valid: {
                            type: 'input',
                            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
                            contType: ['ch', 'en', 'no'],
                            maxLength: 8
                        }
                    },
                    {
                        id: 112,
                        rId: '111-2', // 关联id
                        name: '累计小时',
                        valid: {
                            type: 'input',
                            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
                            contType: ['ch', 'en', 'no'],
                            maxLength: 8
                        }
                    }
                ]

            },
            {
                itemName: '社团活动',
                itemId: 12,
                uploadValid: {
                    limit: 5,
                    size: 5
                },
                values: [
                    {
                        id: 121,
                        rId: '111-1', // 关联id 可以无关联
                        name: '累计次数',
                        valid: {
                            type: 'input',
                            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
                            contType: ['ch', 'en', 'no'],
                            maxLength: 8
                        }
                    },
                    {
                        id: 122,
                        rId: '111-2', // 关联id
                        name: '累计小时',
                        valid: {
                            type: 'input',
                            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
                            contType: ['ch', 'en', 'no'],
                            maxLength: 8
                        }
                    }
                ]

            }, {
                itemName: '志愿活动',
                itemId: 13,
                uploadValid: {
                    limit: 5,
                    size: 5
                },
                values: [
                    {
                        id: 131,
                        rId: '111-1', // 关联id 可以无关联
                        name: '累计次数',
                        valid: {
                            type: 'input',
                            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
                            contType: ['ch', 'en', 'no'],
                            maxLength: 8
                        }
                    },
                    {
                        id: 132,
                        rId: '111-2', // 关联id
                        name: '累计小时',
                        valid: {
                            type: 'input',
                            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
                            contType: ['ch', 'en', 'no'],
                            maxLength: 8
                        }
                    }
                ]

            }
        ]
    },
    {
        blockName: '先进个人荣誉称号（可增加/无联类型/二级/附件对应值）',
        blockId: 2,
        haveItem: false,// 是否有三级
        uploadToItem: false, // 上传是否对应到项
        canAdd: true, // 可否用户自定义增加
        itemList: null,
        uploadValid: {
            limit: 5,
            size: 5
        },
        values: [
            {
                id: 21,
                rId: null, // 关联id 可以无关联
                name: '先进个人荣誉称号',
                valid: {
                    type: 'input',
                    pleaseholder: '请输入荣誉称号，最多35字！',
                    contType: ['ch', 'en', 'no'],
                    maxLength: 35
                }
            },
            {
                id: 22,
                rId: null, // 关联id 可以无关联
                name: '日期',
                valid: {
                    type: 'date',
                    pleaseholder: '',
                    contType: '',
                }
            },
            {
                id: 23,
                rId: null, // 关联id 可以无关联
                name: '级别',
                valid: {
                    type: 'select',
                    pleaseholder: '',
                    contType: '',
                    options:['国家级','省级','市级']
                }
            }, {
                id: 24,
                rId: null, // 关联id 可以无关联
                name: '评选单位',
                valid: {
                    type: 'input',
                    pleaseholder: '请输入评选单位，最多35字！',
                    contType: ['ch', 'en', 'no'],
                    maxLength: 35
                }
            }
        ]
    }
]


export default config
