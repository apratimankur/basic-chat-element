export default class ChatBox extends Muffin.DOMComponent {
    static domElName = "chat-box";

    static schema = {
        "chats": []
    }

    static styleMarkup(rootEl) { 
        //for component-specific style (else can also be done globally by adding css in styles folder)
        return `<style type="text/css">
            ${rootEl} {
              height: calc(100% - 75px);
              overflow-y: auto;
              overflow-x: hidden;
              position: relative;
              display: flex;
              flex-direction: column;
            }

            ${rootEl} .chatbox-chat {
              position: relative;
              border-radius: 0.3em;
            }

            ${rootEl} .chatbox-chat span {
              padding: 5px;
              right: 0;
            }
        </style>`
    }

    static chatMarkup(_chat){
        return `<div class="chatbox-chat p-2 my-2 grey lighten-5">
            <span>${_chat.msg}</span>
        </div>`
    }

    static markupFunc(_data, uid, uiVars, routeVars, _constructor) {
        return `<div class="chatbox w-100 m0 p0 px-3 d-flex flex-column align-items-end">
            ${_data.chats.map(_chat=>{
                return _constructor.chatMarkup(_chat);
            }).join(" ")}
        </div>`
    }

    constructor(){
        super();
        Muffin.PostOffice.sockets["ChatAgent"].addListener("new-chat", (chat)=>{
            this.data.chats.push(chat);
            this.data_src._updateData(this.data);
        });
    }

    onConnect(){
        this.render();
    }

    postRender(){
        this._getDomNode().scrollTop = this._getDomNode().scrollHeight;
    }
}