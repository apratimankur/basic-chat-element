export default class ChatController extends Muffin.DOMComponent {
	static domElName = "chat-controller";

	static markupFunc(_data, uid, uiVars, routeVars, _constructor) {
		return `<div class="w-100 chat-controller m0 p0 px-3 pb-2 position-absolute" style="bottom: 0; right: 0;">
			<input class="form-control tx-xl" type="text" value="" on-change="sendChat"/>
        </div>`
	}

	sendChat(srcEl, ev) {
		console.warn("Event --> ", ev);
		Muffin.PostOffice.sockets["ChatAgent"].dispatchMessage("new-chat", {"msg": srcEl.value});
		srcEl.value = "";
	}

	// handleKeyup(srcEl, ev){
	// 	if(ev.keyCode == 13){ //enter 
	// 		this.interface.dispatchMessage("new-chat", srcEl.value);
	// 	}
	// }
}