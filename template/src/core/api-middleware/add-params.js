import param from '@/core/lib/param';

const AddParams = (url, params) => {
  Object.keys(params).forEach((key) => {
   if (typeof params[key] === 'undefined') delete params[key]
  })

  return url + '?' + param(params)
}

export default AddParams;