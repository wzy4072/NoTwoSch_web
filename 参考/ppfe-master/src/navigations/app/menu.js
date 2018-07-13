function createMenuItem(name, icon, link, selectedLink, children) {
    const selected = (link === selectedLink);
    if (children === undefined) {
        return { name, link, icon, selected };
    } else {
        return { name, link, icon, selected, children };
    }
}

export default {
    functionMenu(context, selectedLink) {
        if (context == null) {
            return [];
        }
        
        // if (context.currentCorporate == null) {
        //     return [];
        // } else {
        //     return [
        //         createMenuItem('SKU管理', 'gift', '/sku', selectedLink),
        //     ];
        // }
        
        return [
            createMenuItem('个人首页', 'home', '/home', selectedLink),
            createMenuItem('基础设置', 'user', '/account/userinfo', selectedLink),
            createMenuItem('创建公司', 'user', '/account/createcom', selectedLink),
            createMenuItem('加入公司', 'user', '/account/joincom', selectedLink),
            createMenuItem('消息中心', 'mail', '/message', selectedLink),
        ];
    }
}