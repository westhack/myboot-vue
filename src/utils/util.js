import _ from 'lodash'
import moment from 'moment'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 *
 * @param img
 * @param callback
 */
export function getFileBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export function fileReader (file, options) {
  options = options || {}
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()

    reader.onload = function () {
      resolve(reader)
    }
    reader.onerror = reject

    if (options.accept && !new RegExp(options.accept).test(file.type)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        code: 1,
        msg: 'wrong file type'
      })
    }

    if (!file.type || /^text\//i.test(file.type)) {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  })
}

export function mapFormValue (items, values) {
  if (_.isArray(items)) {
    _.each(items, (item, name) => {
      if (values[item['name']] !== undefined) {
        let value = values[item['name']]

        try {
          if (items[name]['path'] !== undefined && items[name]['path'] !== null) {
            const path = items[name]['path']
            const paths = path.split('.')
            paths.map(res => {
              value = value[res]
            })
          }
        } catch (e) {
        }

        if (
          items[name]['type'] === 'date-picker' ||
          items[name]['type'] === 'week-picker' ||
          items[name]['type'] === 'month-picker'
        ) {
          if (value != null) {
            items[name]['value'] = moment(value)
          } else {
            items[name]['value'] = null
          }
        } else if (items[name]['type'] === 'range-picker') {
          if (_.isArray(value) && value.length === 2) {
            items[name]['value'] = [
              moment(value[0]),
              moment(value[1])
            ]
          }
        } else if (items[name]['type'] === 'time-picker') {
          if (value != null) {
            items[name]['value'] = moment(value, items[name]['format'] ? items[name]['format'] : 'hh:mm:ss')
          } else {
            items[name]['value'] = null
          }
        } else {
          items[name]['value'] = value
        }
      }
    })
  } else {
    _.each(values, (value, name) => {
      try {
        if (items[name]['path'] !== undefined && items[name]['path'] !== null) {
          const path = items[name]['path']
          const paths = path.split('.')
          paths.map(res => {
            value = value[res]
          })
        }
      } catch (e) {
      }

      if (items[name] !== undefined) {
        if (
          items[name]['type'] === 'date-picker' ||
          items[name]['type'] === 'week-picker' ||
          items[name]['type'] === 'month-picker'
        ) {
          if (value != null) {
            items[name]['value'] = moment(value)
          } else {
            items[name]['value'] = null
          }
        } else if (items[name]['type'] === 'range-picker') {
          if (_.isArray(value) && value.length === 2) {
            items[name]['value'] = [
              moment(value[0]),
              moment(value[1])
            ]
          }
        } else if (items[name]['type'] === 'time-picker') {
          if (value != null) {
            items[name]['value'] = moment(value, items[name]['format'] ? items[name]['format'] : 'hh:mm:ss')
          } else {
            items[name]['value'] = null
          }
        } else {
          items[name]['value'] = value
        }
      }
    })
  }

  return items
}

export function treeToList (tree, index = null, children = 'children') {
  const dataList = []
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const id = node[index]
      if (index) {
        dataList[id] = node
      } else {
        dataList.push(node)
      }
      if (node[children]) {
        generateList(node[children], node[index])
      }
    }
  }

  generateList(tree)

  return dataList
}

export function treeParseData (val, key, title) {
  const _parseData = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      tree[i]['key'] = tree[i].value = tree[i][key] + ''
      tree[i]['title'] = tree[i][title]
      tree[i]['scopedSlots'] = { title: 'title' }
      if (tree[i].children && tree[i].children.length > 0) {
        _parseData(tree[i].children)
      }
    }
    return tree
  }

  return _parseData(val)
}
