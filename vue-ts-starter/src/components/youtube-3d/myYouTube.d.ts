
/**
 * Best way is to create interface for
 * youtube api call details.
 */

export interface TYResponse {
  body: any;
  headers: any;
  result: YTResult;
  status: number;
  statusText: any;
}

export interface YTResult {
  etag: string;
  items: YTItem[];
  kind: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  regionCode: string;
}

export interface YTItem {
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  kind: string;
  snippet: any;
}

/**
 * @description Enumerators:
 *               YTITEM_ENUM for YTItem
 *               YTRESULT_ENUM for YTResult
 */
// eslint-disable-next-line
export enum YTITEM_ENUM {
  KIND = "youtube#searchResult",
  ID_KIND = "youtube#video"
}

// eslint-disable-next-line
export enum YTRESULT_ENUM {
  KIND = "youtube#searchListResponse"
}
