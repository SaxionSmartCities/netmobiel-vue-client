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
        submitStatus: {
          message: undefined,
          status: NetworkRequestStatus.PENDING,
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
        submitStatus: {
          message: response.data.message,
          status: NetworkRequestStatus.SUCCESS,
        },
      })
      return response
    },
    error => {
      uiStore.mutations.updateNetworkRequest({
        submitStatus: {
          message: error.message,
          status: NetworkRequestStatus.FAILED,
        },
      })
      return Promise.reject(error)
    }
  )
}
