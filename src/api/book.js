import request from '@/utils/request'

export function createBook(data) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}

export function updateBook(data) {
  return request({
    url: '/book/update',
    method: 'post',
    data
  })
}

export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'get',
    params: {fileName}
  })
}


export function listBook(params) {
  return request({
    url: '/book/list',
    method: 'get',
    params:params
  })
}


export function getCategory() {
  return request({
    url: '/book/category',
    method: 'get',
  })
}
export function deleteBook(fileName) {
  return request({
    url: '/book/delete',
    method: 'get',
    params:{fileName}
  })
}
