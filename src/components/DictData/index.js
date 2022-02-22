import Vue from 'vue'
import DataDict from '@/utils/dict'
import { getDicts as getDicts } from '@/api/system/dict/data'

function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        //如果后端字段名有变化，需修改下列的metaLabel和metaValue
        labelField: 'metaLabel',
        valueField: 'metaValue',
        request(dictMeta) {
          return getDicts(dictMeta.type).then(res => res.data)
        },
      },
    },
  })
}

export default {
  install,
}