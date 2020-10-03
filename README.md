

# Project name: vue-ts-starter

 #### Creator: Nikola Lukic 2020
 #### Visual Code editor used
 #### Code formater vsPrettier
 #### Version "Ecstacy of gold"


## Clone project command:

```js
  git clone --recurse-submodules https://github.com/zlatnaspirala/vue-typescript-starter
```

## Project objective

 To create perfect modular fit for any type project.
  I will integrate next features:

  - Google client login based on  ApiKey. [DONE]
  - Test yt video play with YT Player embeded iframe[DONE]
    also with customhtml5 video tag.[DONE]
  - Google account login based on node.js server.
  - Calling Youtube API v3. and preview in classic html tags. [DONE]
  - Implementing three.js video preview sub component[DONE]
  - Preview thumbnails with threejs component. [DONE]
  - BASIC NUI commander and Voice commander [DONE]
  - NUI hands control yt vieo navigation [WIP]
  - BASIC openCV for web (opencvjs) implementation [DONE]
  - Implementing custom webGL2 (glmatrix) video preview sub component.
  - Kure Video Chat (kurento) Mixing yt video with camera stream.
  - Visual ts game engine - some kind of implementation
  - Implementing AR (commercial)
  - Google map API - Not free (maybe for 3d vs maps)
    7$ min cost

 ## Go to project folder
 ### [Starter readme more details](https://github.com/zlatnaspirala/vue-typescript-starter/tree/master/vue-ts-starter)


Last version sceenshots:
 Screenshot:
![screenshot](https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/screenshot.0.1.3.png)


 See `setup-from-zero-point.md` to make clear who this project was created.

### Help links:

 [developers.google.com/youtube/v3](https://developers.google.com/youtube/v3/getting-started)

 [github.com/google/google-api-javascript-client](https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md)


## About programming paradigma methods ##

####  About vue methods in ts variant ####

For now we need trust this:

[Source https://blog.logrocket.com](https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript)

## About three.js implementation ##

I will not use ts variant for three.js.
Reasons on page:

https://threejs.org/docs/#manual/en/introduction/Typescript-setup

I will use javascript classic variant but script type module with `import`.

Raport:
npm i three ->
```found 376 vulnerabilities (375 low, 1 high)```

### Features DONE ###

  - YouTube component. Log in , fetch data from youtube APi v3.
    preview images in list
  - Added threejs lib / my subComponent and preview video and thumbnails.
    Play video in webGL context , control video from status bar buttons UI.

### github submodules

Update all submodules:
```js
  git pull --recurse-submodules
```

```js
[submodule "vue-ts-starter/public/submodules/nui-commander/nui-commander"]
  url = https://github.com/zlatnaspirala/nui-commander
[submodule "vue-ts-starter/public/submodules/voice-commander/voice-commander"]
  url = https://github.com/zlatnaspirala/voice-commander
[submodule "vue-ts-starter/public/submodules/opencv-starter"]
  url = https://github.com/zlatnaspirala/opencv-starter
```

### Formating

 ESLINT is present also (not configured).

#### Lints and fixes files

```bash
  npm run lint
```

## Direct link for dev server

### VueTube web service 2020

https://maximumroulette.com:3000

https://www.youtube.com/watch?v=-lwkKzFLzk0
