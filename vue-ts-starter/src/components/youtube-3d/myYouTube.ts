
/**
 * Best way is to create interface for
 * youtube api call details.
 */
import LocalStorageMemory from "../../local-storage/local-storage";

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
 * YTITEM_ENUM for YTItem
 * YTRESULT_ENUM for YTResult
 */
export enum YTITEM_ENUM {
  KIND = "youtube#searchResult",
  ID_KIND = "youtube#video"
}

export enum YTRESULT_ENUM {
  KIND = "youtube#searchListResponse"
}

export interface myYouTube {

  showDialog: boolean;
  styleObject: Partial<CSSStyleDeclaration>;
  optionsStyle: Partial<CSSStyleDeclaration>;
  styleTableObject: Partial<CSSStyleDeclaration>;
  ls: LocalStorageMemory;
  execute(): void;
  data();
  isAuthorized: false;
  tyfetchVisibility: false;
  ytListVisibilityRowChannelTitle: Boolean;
  ytListVisibilityRowTitle: Boolean;
  ytListVisibilityRowVideoID: Boolean;
  ytListVisibilityRowThumbnails: Boolean;
  spaceHForYTComponet: string;
  componentWidthOptions: any;
  nuiVisibility: boolean;
  nuiVisibilityOptionsChanged(): void;
  channelTitleOptionsChanged(): void;
  titleOptionsChanged(): void;
  videoIdOptionsChanged(): void;
  thumbnailsOptionsChanged(): void;
  setupCompWidth(): void;
  loginIn(): void;
  prepareThisVideo(e);
  setNewResponse(r: any);
  mounted(): void;
  // this.$root.$on('googleApiLoginEvent', function (this: typeof Vue, args: any) {
  // window.addEventListener('resize', ()
  // this.$set(this, "spaceHForYTComponet", window.innerHeight * 0.85);
  created();
  loadStartUpVideo();
  player
  // (window as any).onYouTubeIframeAPIReady();
  authenticate();
  loadClient();
  start(gapi: any): void;

}
