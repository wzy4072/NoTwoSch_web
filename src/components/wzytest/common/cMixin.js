const RegNumberKey = /^[0-9]+$/
const cMixin = {
    data() {
        return {
            recordStatusLabel:
            {
                '0': '草稿',
                '1': '已提交',
                '2': '审核通过',
                '3': '审核不通过',
            }
        }
    },
    methods: {
        isIdKey(key) {
            return RegNumberKey.test(key)
        },
        // 根据页面判断使用哪一个页面
        initPageBlock(bInfo, forShow) {
            // get table title
            // 判断是否是表格
            let showAsTable = false;
            // 用于数据渲染 id显示到col下
            let idToCol = {};
            // 存储 协助统计（表格方式显示时使用）
            let cIdxs = [];
            // 表体 及 单元格格式
            let cols = [];
            // !!! 目前只考虑了 table方式和普通方式 其他方式尚未考虑

            // 附件信息
            let needFiles = [];
            bInfo.detailList.map(detail => {
                detail.needFile && needFiles.push(this.collectUploadsInfo(detail));
                // 假如没有三级数据 // 暂时不考虑 table类型
                const sIdx = detail.rowToColIndex;
                if (!detail.detailList || detail.detailList.length === 0) {
                    // if (sIdx) {
                    //...
                    // }
                    // 非 表格方式显示
                    cols.push({
                        prop: detail.checkDetailId,
                        label: detail.checkDetailName,
                        cellInfo: detail
                    });
                } else {
                    //三级的处理
                    detail.detailList.map(vInfo => {
                        detail.vInfo && needFiles.push(this.collectUploadsInfo(vInfo));
                        const cIdx = vInfo.rowToColIndex;
                        if (cIdx) {
                            showAsTable = true;
                            idToCol[vInfo.checkDetailId] = cIdx;
                            if (!cIdxs.includes(cIdx)) {
                                cIdxs.push(cIdx);
                                cols.push({
                                    prop: cIdx,
                                    label: vInfo.checkDetailName,
                                    cellInfo: vInfo
                                });
                            }
                        } else {
                            // 非 表格方式显示
                            cols.push({
                                prop: vInfo.checkDetailId,
                                label: vInfo.checkDetailName,
                                cellInfo: vInfo
                            });
                        }
                    });
                }
            });

            let rows = [];
            let colForId = {};
            let idForCol = {};
            if (showAsTable) {
                cols.unshift({
                    prop: "name",
                    label: bInfo.checkItemName,
                    cellInfo: {}
                });


                bInfo.detailList.map(detail => {
                    let row = {
                        checkDetailId: detail.checkDetailId,
                        name: detail.checkDetailName
                    }; // 表格首列

                    detail.detailList.map(vInfo => {
                        row[vInfo.rowToColIndex] = Math.random()
                            .toString()
                            .slice(2, 5); // 表格内单元格默认值

                        // colForId[三级id_值序列] = 值id 
                        colForId[detail.checkDetailId + "_" + vInfo.rowToColIndex] =
                            vInfo.checkDetailId;
                        // idForCol[值id] =[值序列]
                        idForCol[vInfo.checkDetailId] = vInfo.rowToColIndex
                    });
                    rows.push(row);
                });
            }
            let inited = !0;
            // 根据初始数据 整理出 表头、表体 id查找工具 附件信息
            return {
                cols,
                rows,
                colForId,
                idForCol,
                inited,
                needFiles,
                showAsTable,
                checkItemName: bInfo.checkItemName,
                checkItemId: bInfo.checkItemId
            };
        },
        collectUploadsInfo(i) {
            return {
                fileId: "",
                name: i.checkDetailName,
                checkDetailId: i.checkDetailId,
                singleFileSize: i.singleFileSize,
                fileCount: i.fileCount,
                // 标记 是否需要同步名字 （如果当前字段没有下一级，有值，那么就需要同步）
                syncName: !i.detailList || i.detailList.length === 0
            };
        }
    }
}
export default cMixin