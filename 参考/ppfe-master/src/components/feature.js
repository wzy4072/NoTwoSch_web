import config from 'appconfig';

/**
 * 0 , 已经成熟，具备正式上线条件 
 * 1 , 可在生产环境内部开放
 * 2 ，测试阶段  
 */
const features = {
    0: ['ROAD'],
    1: [],
    // 2: ['test',]
}
let stage = config.experimental;

export default {

    hasFeature(key) {
        console.debug('Stage: ' + stage);
        let stageValue = stage ? parseInt(stage) : 0;
        for (var sv = 0; sv <= stageValue; sv++) {
            console.debug(features[sv]);
            if (!Array.isArray(features[sv]) ? false : features[sv].find(f => f === key)) {
                return true;
            }
        }
    }
}