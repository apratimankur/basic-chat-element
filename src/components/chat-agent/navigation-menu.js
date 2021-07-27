export default class NavigationMenu extends Muffin.DOMComponent {
	static domElName = "navigation-menu";

	static routeLinkMarkup(name, link) {
		return `<li class="p5 m10">
            <a class="" href="#" onclick="_router.go('${link}')">${name}</a>
        </li>`
	}

	static markupFunc(_data, uid, uiVars, routeVars, _constructor) {
		return `<ul class="nav nav-tabs">
			${uiVars.routeList.map((_routeName)=>{
				return _constructor.routeLinkMarkup(_routeName, uiVars.config[_routeName]);
			})}
        </ul>`
	}

	constructor () {
		super();
		this.uiVars.config = JSON.parse(this.attributes.config.value);
		this.uiVars.routeList = Object.keys(this.uiVars.config);
	}
}