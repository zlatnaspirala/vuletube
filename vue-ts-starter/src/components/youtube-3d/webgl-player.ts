
/**
 * @description
 * LocalStorageMemory will handle saving
 * and loading object of the localStorage.
 */
import LocalStorageMemory from "../../local-storage/local-storage";

/**
 * @description
 * When we make instance for CvStarter we need to provide
 * args to make it work nice.
 * @param videoProcessing Boolean
 * @param injectCanvas String Literal reprasent canvas id.
 * @param injectVideo
 */
export interface CvStarterOptions {
  videoProcessing: boolean
  injectVideo: HTMLVideoElement
  injectCanvas: string
}

export enum EFFECT_TYPE {
  NOEFFECT = 'NOEFFECT',
  CVVIDEOPROCESSING = 'CVVIDEOPROCESSING'
}

/**
 * @description
 * This is pseudo type.
 * CvStarter class is external for this project.
 */
type CvStarter = any;

/**
 * @description
 * This is pseudo type.
 * ThreeJSCamera class is external for this project.
 * Represent THREE.camera
 */
type ThreeJSCamera = any;

/**
 * @description This is interface docs declaration
 * for typedocs - also can be active
 */

export enum IPreviewMode {
  classic = "classic",
  firstPerson = "firstPerson"
}

export interface threejsYoutubePlayer {
  ls: LocalStorageMemory
  camera: ThreeJSCamera
  scene: any
  renderer: any
  raycaster: any
  mouse: any
  container: any
  videoWebCam: any
  webcamMesh: any
  mainVideoMesh: any
  cvEffectCanvas: any
  previewMode: IPreviewMode
  meshGroupSearchResult: any
  INTERSECTED: any
  preventRaycastClickAction: boolean
  lastHoveredElement: any
  showDialog: boolean
  optionsSearchResultPreview: boolean
  planeAddedToScene: boolean
  previewPerPage: number
  optionsVideoCamera: boolean
  isVideoCameraActive: boolean
  videoCameraStream: MediaStream | null
  localCurrentTime: any
  cvStarter: CvStarter | null
  styleObject: any
  optionsStyle: any
  oBackground: {
    r: number,
    g: number,
    b: number
  }
  oCvStarter: boolean
  runVideoReactor()
  mounted(): void
  runCvjsLoader(injectComponentFlag ?: string) : void
  created(): void
  rayClickHandler()
  oCvStarterOptionsChanged(value): void
  previewPerPageChanged(value): void
  searchResultPreviewOptionsChanged(value): void
  setCameraDeepByZ(currValue: any): void

  /**
   * @description This function emits
   * `videoInProgress` event.
   * @examples
   * this.$root.$emit('videoInProgress', passArgs);
   */
  prepareThisVideo(arg)

  trySource(args: any)
  init()
  stopVideoCamera()
  accessVideoCamera()
  getDuration(): number | any
  getCurrentTime(): any
  changeCurrentVideoPosition(testValue): void
  prepareVideoTexture(visualShape: string, effectType: string)
  setCanvasElementSize()
  onWindowResize()
  animate()
  onMouseUp(): void
  onMouseMove(event): void
  clearSearchResultFromScene()
  addSearchResult3dObjects(currentIdItems) : void
  setDefaultWebCamCVstarter() : void
  set3dBackground(): void
  videoCameraOptionsChanged() : void

}
