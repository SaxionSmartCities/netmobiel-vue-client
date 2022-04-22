import { Page } from '@/store/types'

export const emptyPage = {
  totalCount: 0,
  offset: 0,
  count: 0,
  data: [],
}

export function assignPageResults<T>(
  current: Page<T>,
  content: Page<T>
): Page<T> {
  if (content.offset === 0) {
    return content
  } else {
    if (current.count !== content.offset) {
      //eslint-disable-next-line
      console.log(
        `Warning: Content page is not contiguous: count ${current.count} vs next offset ${content.offset}`
      )
    }
    return {
      totalCount: content.totalCount,
      offset: 0,
      count: current.data.length + content.data.length,
      data: [...current.data, ...content.data],
    } as Page<T>
  }
}
