
  export default interface IHeader  {

    windowGlobal: Window | any;
    paypal: any;
    optionsStyle: any;
    data(): any;
    switchTheme();
    changeTheme (themeEnu: string);
    googleApiLogin(): void;
    mounted (): void;
    createPayPalDonateButton();
    showAboutDialogClick(): void;

  }
