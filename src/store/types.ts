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
<<<<<<< HEAD

/**
 * Payload for page selection.
 */
export interface PageSelection {
  /**
   * Offset in result set of selected page.
   */
  readonly offset: number
  /**
   * Number of elements in selected page.
   */
  readonly maxResults: number
}
=======
>>>>>>> commit before pull
