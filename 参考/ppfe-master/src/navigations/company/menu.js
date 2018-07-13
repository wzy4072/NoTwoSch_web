import routeData from './routeData.js'

var frontendMap = routeData.frontendMap;

/**
 * 创建菜单项
 * @param name
 * @param link
 * @param selectedLink
 * @param children
 * @param target
 * @param imgName
 * @param vuexGetter
 * @returns {*}
 */
function createMenuItem(name, link, selectedLink, children, target, imgName, vuexGetter) {
    const selected = (link === selectedLink);
    if (children === undefined) {
        return { name, link, selected, target, imgName, vuexGetter};
    } else {
        return { name, link, selected, children, target, imgName, vuexGetter};
    }
}

/**
 * 帮助函数，为菜单实例添加需要的属性
 * @param obj
 */
function addMenuProperty(obj) {
    var frontendObj = frontendMap[obj.code];
    if(obj.outerLink != null) {
        obj.link = obj.outerLink;
    }else if(frontendObj) {
        obj.link = frontendObj && frontendObj["link"] || "";
    }else {
        obj.link = "javascript:;";
    }
    obj.target = "_" + (obj.jumpWay || "self");
}

/**
 * 解析后台菜单数据
 * @param source
 * @param father
 * @returns {T[] | SharedArrayBuffer | Uint8ClampedArray | Uint32Array | Blob | Int16Array | *}
 */
function resolveData(source, father) {
    var arr = source.slice(0);
    for (var i = 0; i < arr.length; i++) {
        var son = arr[i];
        addMenuProperty(son);
        if(son.isRoot) {
            resolveData(son.children, son);
        }
    }
    if(!father) {
        return arr;
    }
}

export default {
    functionMenu(context, selectedLink) {
        if (context == null) {
            return [];
        }
        
        var powers = JSON.parse(JSON.stringify(context.modules));
        var munuItems = [];
        var arr =resolveData(powers);
        
        for (var i = 0; i < arr.length; i++) {
            munuItems.push(
                createMenuItem(arr[i].name, arr[i].link, selectedLink, arr[i].children || null, arr[i].target, arr[i].icon || null, arr[i].vuexGetter || null)
            )
        }
        
        return munuItems;
    }
}