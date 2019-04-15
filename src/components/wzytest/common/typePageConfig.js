const page1 = {
    blockName: "活动项目",
    id: 1,
    status: "未录入",
    id: 101,
    columns: [
        { colName: "活动项目" },
        { colName: "累计次数（次）", colId: 10101 },
        { colName: "累计时间（小时）", colId: 10102 }
    ],
    rows: [{
        rowId: 10103,
        rowName: "党团活动",
        '10101': 31,
        "info10101": {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        },
        '10102': 32,
        'info10102': {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        }
    },
    {
        rowId: 10104,
        rowName: "社团活动",
        '10101': 41,
        "info10101": {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        },
        '10102': 42,
        'info10102': {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        }
    }, {
        rowId: 10105,
        rowName: "志愿服务",
        '10101': 51,
        "info10101": {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        },
        '10102': 52,
        'info10102': {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        }
    }, {
        rowId: 10106,
        rowName: "公益劳动",
        '10101': 61,
        "info10101": {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        },
        '10102': 62,
        'info10102': {
            type: 'input',
            pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
            contType: ['ch', 'en', 'no'],
            maxLength: 8
        }
    }


    ]

}
const page2 = {}
const page3 = {}
const page4 = {}
const page5 = {}
export default { page1, page2, page3, page4, page5 }