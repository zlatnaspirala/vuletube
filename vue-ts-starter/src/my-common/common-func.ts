
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
  var themes = this.$store.state.appStyle.themes()

  var nextThemeIndex = themes.indexOf((this.$root as any).$material.theming.theme) + 1;

  if (nextThemeIndex == themes.length) {
    nextThemeIndex = 0
  }

  (this.$root as any).$material.theming.theme = themes[nextThemeIndex]
  // quick fix - fix later 
  if (typeof this.changeTheme !== 'undefined') {
    this.changeTheme(themes[nextThemeIndex])
  }
  
}
