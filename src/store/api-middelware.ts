import Vue from 'vue'
import { AxiosInstance } from 'axios'
import * as uiStore from '@/store/ui'
import { NetworkRequestStatus } from './ui/types'

export const addInterceptors = (axiosInstance: AxiosInstance) => {
  // Clear UI (network) state
  uiStore.mutations.resetNetworkRequest()

  // Add bearer token to request.
  addTokenInterceptor(axiosInstance)

  // Add a request interceptor
  addUiRequestInterceptor(axiosInstance)

  // Add a response interceptor
  addUiResponseInterceptor(axiosInstance)
}

const addTokenInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
}

const addUiRequestInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    config => {
      // Do something before request is sent
      uiStore.mutations.updateNetworkRequest({
        location: config.url,
        method: config.method?.toUpperCase(),
        submitStatus: {
          message: undefined,
          status: NetworkRequestStatus.PENDING,
          statusCode: undefined,
        },
      })
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
}
const addUiResponseInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    response => {
      uiStore.mutations.updateNetworkRequest({
        location: response.config.url,
        method: response.config.method?.toUpperCase(),
        submitStatus: {
          message: response.data.message,
          status: NetworkRequestStatus.SUCCESS,
          statusCode: response.status,
        },
      })
      return response
    },
    error => {
      uiStore.mutations.updateNetworkRequest({
        location: error.config.url,
        method: error.config.method?.toUpperCase(),
        submitStatus: {
          message: error.message,
          status: NetworkRequestStatus.FAILED,
          statusCode: error.response.status,
        },
      })
      return Promise.reject(error)
    }
  )
}
