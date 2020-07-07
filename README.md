
# Project name: vue-ts-starter #
### Creator: Nikola Lukic 2020 ###
### Visual Code editor used ###
### Code formater vsPrettier ###

## Project objective ##

 To create perfect modular fit for any type project.
  I will integrate next features:
  - Google account login based on node.js server.
  - Youtube API
  - Kure Video Chat (kurento)
  - Visual ts game engine
  - Google map API - Not free (maybe for 3d gameing)
     7$ min cost

<pre>
 See setup-from-zero-point.md to make clear who this project is created.

 Help links:

 https://developers.google.com/youtube/v3/getting-started
 https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md#LoadinganAPIandMakingaRequest

</pre>

### About methods ###

For now we need trust:
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

### Features ###

  - YouTube component. Log in , fetch data from youtube APi v3.

### Formating ###

ESLINT is present also.

#### Lints and fixes files ####
```
npm run lint
```

