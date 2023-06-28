var LitElement = LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
var html = LitElement.prototype.html;
var css = LitElement.prototype.css;

class LeftSideBarCard extends LitElement {

    static get properties() {
        return {
            hass: {},
            config: {},
            _current_submenu: {}
        };
    }

    constructor() {
        super();
        this._current_submenu = -1;
    }

    render() {
        const url = window.location.href.split("/").pop();

        return html`
            <div class="main">
                <aside style="width: ${this.isSubmenuOpened() ? '50px' : '90px'}">
                    <div class="empty"></div>
                    ${this.config.items.map(item => {
                        return item.url ?
                                html`
                                    <a href="${item.url}"
                                       class="${this.isItemActive(item, url) ? 'active' : 'deactive'}">
                                        <i >
                                            <ha-icon icon="${item.icon}"/>
                                        </i>
                                    </a>
                                ` :
                                item.submenu ?
                                        html`
                                            <a class="${this.isSubmenuItemOpen(item) ? 'active' : 'deactive'}">
                                                <i @click=${() => {
                                                    this._current_submenu = this.toggleSubmenu(item);
                                                }}>
                                                    <ha-icon icon="${item.icon}"/>
                                                </i>
                                            </a>
                                        ` : null;
                    })}
                    <div class="empty"></div>
                </aside>
                <div class="sub_menu" style="display: ${this._current_submenu >= 0 ? 'flex' : 'none'}">
                    ${this.isSubmenuOpened() ?
                            this.config.items[this._current_submenu].submenu.map(sub => {
                                return html`
                                    <a class="button_option_menu ${sub.url === url ? 'button_option_menu_active' : ' '}"
                                       href="${sub.url}">
                                        <ha-icon class="icon" icon="${sub.icon}"/>
                                        </ha-icon>
                                    </a
                                `;
                            }) : null}
                </div>
            </div>

        `;
    }

    isItemActive(item, url) {
        return item.url === url;
    }

    isSubmenuOpened() {
        return this._current_submenu !== -1;
    }

    isSubmenuOpen(item) {
        return this._current_submenu === this.config.items.indexOf(item);
    }

    isSubmenuItemOpen(item) {
        const url = window.location.href.split("/").pop();
        return this.isSubmenuOpen(item) && item.submenu.filter(i => i.url === url).length > 0;
    }

    toggleSubmenu(item) {
        return this._current_submenu === this.config.items.indexOf(item) ? -1 : this.config.items.indexOf(item);
    }

    connectedCallback() {
        const url = window.location.href.split("/").pop();
        this._current_submenu = this.findSubmenuWithUrl(url);
        super.connectedCallback()
    }

    findSubmenuWithUrl(url) {
        return this.config.items.findIndex(i =>
            !i.url &&
            i.submenu &&
            i.submenu.filter(mi => mi.url === url).length > 0);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    setConfig(config) {
        if (!config.items) {
            throw new Error("You need to define entities");
        }

        this.config = config;
    }

    getCardSize() {
        return this.config.items.length + 1;
    }

    static get styles() {
        return css`

    :host {
      --layout-margin: 4px 4px 0px 4px;
    }

    .main {
      // width: 80px;
      height: 99.6vh;
      display: flex;
      flex-direction:rows;
      justify-content: center;
      text-align: center;
      vertical-align: middle;
      // margin: 2vh 0 2vh 10px;

    }

    .empty {
      background-color: transparent;
      height: 100%;
      border-right: 1px solid var(--border_color);
    }
    
    aside {
      color: #fff;
      
      height: 100%;
      //background-image: linear-gradient(270deg, #f6f5fa, transparent);
      // background-image: linear-gradient(30deg, #0048bd, #44a7fd);
      background-color: var(--secondary-background-color);
      // border-radius: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      vertical-align: middle;
    }
    
    aside a {
      // color: #fff;
      color: var(--sidebar-icon-color);
      display: block;
      padding: 20px 0px 20px 5px;
      margin-left: 10px;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      // border-right: 1px solid rgba(128, 128, 128, 0.2);
    }
    .deactive {
      border-right: 1px solid var(--border_color);
    }
    .active {
      color: #3f5efb;
      background-color: var(--primary-background-color);
      outline: none;
      position: relative;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      border-left: 1px solid var(--border_color);
      border-top: 1px solid var(--border_color);
      border-bottom: 1px solid var(--border_color);
      border-right-color: var(--border_color);
      border-right-width: 1px;
      // box-shadow: 0 -4px 3px -4px, 0 4px 3px -4px, -4px 0px 3px -4px;
    }
    
    .active.sub_menu_button {
      background: var(--primary-background-color)
      // background: #aaa;
      background-color: #aaa;
      z-index: 1;
    }
    
    .active.sub_menu_button:after {
      box-shadow: #aaa 0px 15px 0px 0px;
      pointer-events: none;
    }
    
    .active.sub_menu_button:before {
      box-shadow: 0 -15px 0 0 #aaa;
      pointer-events: none;
    }
    
    aside a i {
      margin-right: 15px;
    }
    
    .active:after{
      content: "";
      position: absolute;
      background-color: transparent;
      bottom: 100%;
      right: 0px;
      height: 100%;
      width: 12px;
      border-bottom-right-radius: 15px;
      border-right: 1px solid var(--border_color);
      border-bottom: 1px solid var(--border_color);
      box-shadow: 0 15px 0 0 var(--primary-background-color);
      pointer-events: none;
    }
    
    .active:before {
      content: "";
      position: absolute;
      background-color: transparent;
      top: 64px;
      right: 0px;
      height: 100%;
      width: 25px;
      border-top-right-radius: 15px;
      border-right: 1px solid var(--border_color);
      border-top: 1px solid var(--border_color);
      box-shadow: 0 -15px 0 0 var(--primary-background-color);
      pointer-events: none;
    }
    
    aside p {
      margin: 0;
      padding: 40px 0;
    }
    
    body {
      font-family: "Roboto";
      width: 100%;
      height: 100vh;
      margin: 0;
    }
    
    i:before {
      width: 14px;
      height: 14px;
      font-size: 14px;
      position: fixed;
      color: #fff;
      background: #0077b5;
      padding: 10px;
      border-radius: 50%;
      top: 5px;
      right: 5px;
    }
    .sub_menu {
      
      flex-direction: column;
      justify-content: center;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      width: 45px;

    }
    .button_option_menu {
      padding: 15px;
      border-right: 2px solid var(--sidebar-border-color);
      background-color: transparent;
    }
    .button_option_menu_active {
      border-right: 4px solid var(--state-icon-active-color);
    }

    .icon {
      color: var(--sidebar-icon-color)
    }
    
    `;
    }

}

customElements.define('leftside-card', LeftSideBarCard);