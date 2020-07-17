# Project name: vue-ts-starter #

 ### Creator: Nikola Lukic 2020 ###
 ### Visual Code editor used ###
 ### Code formater vsPrettier ###
 ### Version "Ecstacy of gold" ###


## Project objective ##

 To create perfect modular fit for any type project.
  I will integrate next features:

  - Google client login based on  ApiKey. [DONE]
  - Test yt video play with YT Player embeded iframe[DONE]
    also with customhtml5 video tag.[DONE]
  - Google account login based on node.js server.
  - Calling Youtube API v3. and preview in classic html tags. [DONE]
  - Implementing three.js video preview sub component[DONE]
  - Implementing custom webGL2 (glmatrix) video preview sub component.
  - Kure Video Chat (kurento) Mixing yt video with camera stream.
  - Visual ts game engine
  - Google map API - Not free (maybe for 3d vs maps)
    7$ min cost

 ## Go to project folder ##
 ### [Starter readme](https://github.com/zlatnaspirala/vue-typescript-starter/tree/master/vue-ts-starter) ###

 See setup-from-zero-point.md to make clear who this project is created.

 Help links:

 [developers.google.com/youtube/v3](https://developers.google.com/youtube/v3/getting-started)

 [github.com/google/google-api-javascript-client](https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md)


## About programming paradigma methods ##

####  About vue methods in ts variant ####

For now we need trust this:

[Source](https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript)

```javascript
// Methods in TypeScript, like normal class methods, have an optional access modifier.

export default class HelloWorld extends Vue {
  public clickMe(): void {
    console.log('clicked')
    console.log(this.addNum(4, 2))
  }
  public addNum(num1: number, num2: number): number {
    return num1 + num2
  }
}

// The JavaScript-equivalent code is as follows.
export default {
  methods: {
    clickMe() {
      console.log('clicked')
      console.log(this.addNum(4, 2))
    }
    addNum(num1, num2) {
      return num1 + num2
    }
  }
}
```

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
  - Added threejs lib / my subComponent

### Formating ###

 ESLINT is present also (not configured).

#### Lints and fixes files ####

```bash
  npm run lint
```

## Direct link for dev server ##

### VueTube web service 2020 ###
https://maximumroulette.com:3000

