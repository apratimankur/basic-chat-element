export default class ChatSettings extends Muffin.DOMComponent {
	static domElName = "chat-settings";

	static markupFunc(_data, uid, uiVars, routeVars, _constructor) {
		return `<div class="col-12 h-100 m0 p0 d-flex flex-column align-items-center justify-content-center">
			<h3 class="grey-text text-darken-4">Chat Settings</h3>
        </div>`
	}
}