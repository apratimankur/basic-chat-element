import NavigationMenu from "./navigation-menu";
import ChatSettings from "./chat-settings";

import ChatBox from "./chat-box";
import ChatController from "./chat-controller";

class ChatAgent extends Muffin.DOMComponent {
    static domElName = "chat-agent";

    static styleMarkup(rootEl) {
        return `<style type="text/css">

        </style>`
    }

    static interfaceSpecs = {};

    static markupFunc (_data, uid, uiVars, routeVars, _constructor) { 
        return `<div class="col-12 p0 m0">
            <div class="row right m0 p0" style="z-index: 999; height: 80px;">
                <navigation-menu config='{"Chat": "chat", "Settings": "chat-settings"}'></navigation-menu>
            </div>

            <div class="row m0" style="position: relative; height: calc(100% - 80px);">
                <div class="surface" route="chat">
                    <chat-box>
                        <component-data socket="ChatAgent" label="chat-agent-state"></component-data> 
                    </chat-box>
                    <chat-controller></chat-controller>
                </div>
                <div class="surface" route="chat-settings">
                    <chat-settings></chat-settings>
                </div>
            </div>
        </div>`
    }

    constructor(){
        super();
        Muffin.PostOffice.getOrCreateInterface("ChatAgent", this.constructor.interfaceSpecs);
    }
}


ChatAgent.compose = () => {
    ChatBox.compose();
    ChatController.compose();
    ChatSettings.compose();
    NavigationMenu.compose();
}

export { ChatAgent };