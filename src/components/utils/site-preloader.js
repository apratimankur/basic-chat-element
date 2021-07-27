const toggleUIMsg = class extends Muffin.Lexeme {
    static schema = {
        state: null
    }
}

class SitePreloader extends Muffin.DOMComponent {
    static domElName = "site-preloader";

    static advertiseAs = "PreloaderInterface";

    static LEXICON = {
        "ToggleUI" : toggleUIMsg
    }

    static styleMarkup(rootEl) {
        return `<style type="text/css">

        </style>`
    }

    static markupFunc (_data, uid, uiVars, routeVars, _constructor) { 
        return `<div class="position-absolute w100 h100 d-flex align-items-center justify-content-center white" style="left: 0; top: 0; z-index: 9999;">
            <i class="fas fa-spinner fa-spin fa-7x"></i>
        </div>`
    }

   
    ToggleUI(toggleUIMsgInflection) {
        var inDomNode = this._getDomNode();
        // console.debug('DEBUG: inDomnode = ', inDomNode);
        if(inDomNode){
            inDomNode.remove();
        }
    }

    onConnect() {
        
    }
}

export { SitePreloader };