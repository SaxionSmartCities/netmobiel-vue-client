/**
 * A page is used to paginate backend lists.
 */
export interface Page<T> {
  /**
   * Number of elements in this page.
   */
  readonly count: number
  /**
   * Total number of elements in backend list.
   */
  readonly totalCount: number
  /**
   * Offset of this page in the backend list.
   */
  readonly offset: number
  /**
   * Elements in this page.
   */
  readonly data: T[]
}
