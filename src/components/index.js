import { ConnectionManager } from "./connection/main";
import { ChatAgent } from "./chat-agent/main";


class AppUI extends Muffin.DOMComponent {
	static domElName = "app-ui";

	static markupFunc() {
		return `<div class="site-wrapper">
			<div class="row m0 p20 position-absolute grey lighten-3 d-none" style="width: 320px; right: 0;">
				<connection-manager></connection-manager>
			</div>

			<div class="row m0 p0 h100">
				<chat-agent></chat-agent>
			</div>
		</div>`
	}
}


AppUI.compose = () => {
	ConnectionManager.compose();
	ChatAgent.compose();
}


AppUI.compose();