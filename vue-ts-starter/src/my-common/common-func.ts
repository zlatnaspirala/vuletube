
export function asyncLoad(path, callback ?) {

  if (typeof callback === "undefined") {
    callback = function () { };
  }

  var nuiScript = document.createElement("script")
  nuiScript.src = path
  document.head.appendChild(nuiScript)
  nuiScript.onload = function () {
    callback()
  }
}

export function switchTheme (this: any) {
  try {
    if ((this.$root as any).$material.theming.theme == 'myDark') {
      (this.$root as any).$material.theming.theme='myLight'
      this.changeTheme('myLight')
    } else if ((this.$root as any).$material.theming.theme == 'myLight') {
      (this.$root as any).$material.theming.theme='myOrange'
      this.changeTheme('myOrange')
    } else if ((this.$root as any).$material.theming.theme == 'myOrange') {
      (this.$root as any).$material.theming.theme='myDark'
      this.changeTheme('myDark')
    } else {
      console.log('(this.$root as any).$material.theming.theme=myDark' , (this.$root as any).$material.theming.theme='myDark')
    }
  }catch(err) {
    console.warn('Error =>', err)
  }
}
