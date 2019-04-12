let pageConfig =  [
    {
      blockName: "活动项目",
      id: 1,
      status: "未录入",
      blockName: "党团活动",
      id: 101,
      columns: [
        { colName: "活动项目" },
        { colName: "累计次数（次）", colId: 10101 },
        { colName: "累计时间（小时）", colId: 10102 }
      ],
      rows: [
        {
          rowId: 10103,
          rowName: "党团活动",
          '10101':1,
          "info10101":{
              type:'input',
              pleaseholder:'温馨提示，请输入汉字中文英文和数字！',
              contType:['ch','en','no'],
              maxLength:8
            },
          "10102":'德国',
          "info10102":{type:'select',options:[1,2,3,4,5,6,7,8,9,'阿尔及利亚','布利斯特','塞切丝','德国']}
        },
        {
          rowId: 10104,
          rowName: "社团活动",
          '10101':'this is text',
          "info10101":{type:'text',
          pleaseholder:'温馨提示，请输入XXX！',
          maxLength:200
        },
          "10102":[2,3],
          "info10102":{type:'multiselect',options:[2,5,6456,3,5,'asdf','a','abb','avv','bsd','vasdf','edfs','efsd']}
        },
        {
          rowId: 10105,
          rowName: "志愿活动",
          '10101':'2019-04-12',
          "info10101":{
              type:'date',
              pleaseholder:'温馨提示，请输入XXX！',
              format:'yyyy-MM-dd'
        },
          "10102":2,
          "info10102":{
              type:'upload',
              maxCount:5,
              maxSize:2
        }
          
        },
        {
          rowId: 10106,
          rowName: "公益劳动",
          '10101':'string',
          "info10101":{ 
              type:'input',
          pleaseholder:'温馨提示，请输入数字！',
          contType:['no'],
          maxLength:8},
          "10102":2,
          "info10102":{ 
              type:'input',
          pleaseholder:'温馨提示，请输入字母和数字！',
          contType:['en','no'],
          maxLength:8}
          
        }
      ]
    }
  ]

  export default pageConfig