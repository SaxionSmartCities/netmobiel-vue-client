import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL

export default {
  async buyCredits(context, payload) {
    const URL = BASE_URL + `/banker/buy/credits`
    try {
      console.log(payload)
      const response = axios.get(URL, { headers: { bla: 42 } })
      payload, response
    } catch (problem) {
      // eslint-disable-next-line
      console.log(error)
      context.dispatch(
        'ui/queueNotification',
        {
          message: `Onbekende fout bij inkopen van credits`,
          timeout: 3000,
        },
        { root: true }
      )
    }
  },
}
