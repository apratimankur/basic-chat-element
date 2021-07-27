import CONFIG from "./CONFIG";

import { LEXICON } from "./lexicon/main";


class ConnectionManager extends DOMComponent {
	static domElName = "connection-manager";

	static styleMarkup(rootEl) {
		return `<style type="text/css">
			${rootEl} .connection-info .connection-retry, 
			${rootEl} .connection-info .status-offline{
				display: block;
			}
			${rootEl} .connection-info .status-online{
				display: none;
			}

			${rootEl} .connection-info.connection-active .connection-retry, 
			${rootEl} .connection-info.connection-active .status-offline{
				display: none;
			}

			${rootEl} .connection-info.connection-active .status-online {
				display: initial;
			}
		</style>`
	}

	static markupFunc = (_data, uid, uiVars, routeVars, _constructor) => { 
		return `<div class="row m0 p0 h100 w100" renderonlyonce>
			<div class="col-sm-12 col-md-12 h100">
				<div class="connection-info" style="overflow: auto; max-height: 100%;">
					<div class="status-icon tx-xxxl d-flex justify-content-center align-items-center">
						<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-wifi-off status-offline" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						  <path d="M10.706 3.294A12.545 12.545 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.448 8.448 0 0 1 3.51-1.27L8 6zm2.596 1.404l.785-.785c.63.24 1.228.545 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.462 8.462 0 0 0-1.98-.932zM8 10l.934-.933a6.454 6.454 0 0 1 2.012.637c.285.145.326.524.1.75l-.015.015a.532.532 0 0 1-.611.09A5.478 5.478 0 0 0 8 10zm4.905-4.905l.747-.747c.59.3 1.153.645 1.685 1.03a.485.485 0 0 1 .048.737.518.518 0 0 1-.668.05 11.496 11.496 0 0 0-1.812-1.07zM9.02 11.78c.238.14.236.464.04.66l-.706.706a.5.5 0 0 1-.708 0l-.707-.707c-.195-.195-.197-.518.04-.66A1.99 1.99 0 0 1 8 11.5c.373 0 .722.102 1.02.28zm4.355-9.905a.53.53 0 1 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75l10.75-10.75z"/>
						</svg>
						<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-wifi status-online" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						  <path d="M15.385 6.115a.485.485 0 0 0-.048-.736A12.443 12.443 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.717 2.164.204.148.489.13.668-.049z"/>
						  <path d="M13.229 8.271c.216-.216.194-.578-.063-.745A9.456 9.456 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336c.205.132.48.108.652-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.472 6.472 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.408.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.611-.091l.015-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .708 0l.707-.707z"/>
						</svg>
						<span class="status-msg tx-md">${uiVars.connectionStatus}</span>
						<button class="btn btn-danger connection-retry" on-click="connectHost">Retry</button>
					</div>
				</div>
			</div>
		</div>`
	}


	static stateSpace = {
        "connecting": {apriori: ["idle","failed"]},
        "failed": {apriori:["connecting","authorising", "authorised"]},
        "authorising": {apriori: ["connecting"]},
        "authorised": {apriori: ["authorising"]},
        "unauthorised": {apriori: ["authorising"]}
    }

	constructor() {
		super();
        this.defaultConfig = {
            connectionName: "testConnection",
            apiHost: "ws://127.0.0.1:8877/wsapi/element-test-agent",
            autoRetryOnClose: true,
            autoRetryInterval: 10000
        }
		this.CONFIG = {...this.defaultConfig, ...CONFIG};
		this.transitionSpace = {
            "idle <to> connecting": this.connectHost,
            "failed <to> connecting": this.connectHost,
            "connecting <to> authorising": this.requestAuthorisation,
            "authorising <to> authorised": this.keepAlive,
            "authorising <to> unauthorised" : this.onUnauthorised,
            "connecting <to> failed": this.retryConnection,
            "authorising <to> failed": this.retryConnection,
            "authorised <to> failed": this.retryConnection
        }
	}

	randStr(length) {
       var result = '';
       var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    generateToken() {
        return this.randStr(16);
    }

    keepAlive() {
        Muffin.PostOffice.sockets[this.CONFIG.connectionName].keepAlive = true;
    }

    ping(senderUid) {
        if(!document.querySelector(`[data-component='${senderUid}']`)){return;}
        // if(this._getDomNode().dataset.component != senderUid){return;}
        Muffin.PostOffice.sockets[this.CONFIG.connectionName].send("ping");
    }

    retryConnection() {
        this.uiVars.msg = "Connection Failed";
        // this.uiVars.action = true;
        // this.uiVars.action_msg = "Retry? <count-down debug>10</count-down>";
    }

    onUnauthorised(){

    }

    requestAuthorisation() {
        var _this = this;
        this.ping(this.uid);
        setTimeout(()=>{this.switchState("authorised");},100);
    }

    onHostError(ev) {
    	let msg = `connection failed: ${ev}`;
        console.log("imp:", msg);
        Muffin.PostOffice.broadcastMsg("connection-errored",msg);
        this.uiVars.connectionStatusEl.innerHTML = msg;
        this.uiVars.connectionInfoEl.classList.remove('connection-active');
        this.uiVars.connectionRetryEl.removeAttribute("disabled");
        this.switchState("failed")
    }

    onHostOpen(ev) {
    	let msg = `connection established`;
    	console.debug(`Muffin.PostOffice.Socket:::${this.connection.name} opened`);
    	Muffin.PostOffice.broadcastMsg("connection-opened",msg);
    	this.uiVars.connectionStatusEl.innerHTML = msg;
    	this.uiVars.connectionInfoEl.classList.add('connection-active');
    	this.switchState("authorising");
    }

    onHostClose(ev) {
    	let msg = `connection closed`;
    	Muffin.PostOffice.broadcastMsg("connection-closed",msg);
    	this.uiVars.connectionStatusEl.innerHTML = msg;
    	this.uiVars.connectionInfoEl.classList.remove('connection-active');
    	this.uiVars.connectionRetryEl.removeAttribute("disabled");
    	this.switchState("failed");
    }

    onHostMessage(socketMsgEv) {
    	// console.log("imp:", "-------------------------------",socketMsgEv);
		var _msgStr = socketMsgEv.data;
		if(_msgStr=="pong"){return;} //ping-pong messages exchanged in keepAlive
		var ev = null;
  		try{
            var _msg = JSON.parse(_msgStr);
            _msg.label = _msg.label || `msg-from-${this.connection.name}`;
            ev = new CustomEvent(_msg.label, {
                detail: _msg
            });
        }catch(e){ //not valid msg
            var _msg = {error: e, label: `${this.name}-message-error`}
            ev = new CustomEvent(_msg.label, {
                detail: _msg
            });
        }

        // console.debug("DEBUG: socketMsgEv - ", ev);
  		return ev;
    }

	connectHost(){
		let msg = `connecting with api host`;
       	this.uiVars.connectionStatusEl.innerHTML = msg;
       	this.uiVars.connectionRetryEl.setAttribute("disabled","true");


        let _socketOpts = {
            autoRetryOnClose: this.CONFIG.autoRetryOnClose,
            autoRetryInterval: this.CONFIG.autoRetryInterval
        }
		this.connection = Muffin.PostOffice.addSocket(WebSocket, this.CONFIG.connectionName, `${this.CONFIG.apiHost}?token=${this.generateToken()}`, _socketOpts);

		Muffin.PostOffice.sockets[this.connection.name].LEXICON = LEXICON;
		
		Muffin.PostOffice.sockets[this.connection.name].addListener("error", (ev) => {
			this.onHostError(ev);
        });

        Muffin.PostOffice.sockets[this.connection.name].addListener("open", (ev) => {
        	this.onHostOpen(ev);
        });

        Muffin.PostOffice.sockets[this.connection.name].addListener("close",(ev) => {
        	this.onHostClose(ev);
        });

        Muffin.PostOffice.sockets[this.connection.name].onmessage = (ev)=> {
			return this.onHostMessage(ev);  //must return an event for the Muffin.postOffice to work
		}

		Muffin.PostOffice.sockets[this.connection.name].addListener(`msg-from-${this.connection.name}`, (ev)=>{
            console.log("imp:"," incoming-apihost-msg = ", ev.detail);
        });
	}


	_loadDefaults(){
		this.uiVars.clock = {};
		this.uiVars.connectionStatus = "Connecting...";
		this.uiVars.selectedLexeme = null;

		this.uiVars.connectionInfoEl = this._getDomNode().querySelector('.connection-info')
		this.uiVars.connectionStatusEl = this._getDomNode().querySelector('.connection-info .status-msg');
		// this.uiVars.connectionMsgLogEl = this._getDomNode().querySelector('.connection-info .msg-log');
		this.uiVars.connectionRetryEl = this._getDomNode().querySelector('.connection-info .connection-retry');

	}


	onConnect(){
		this.interface.addListener("send-message",(ev)=>{
            _this.sendMsgToHost.call(this, ev);
        });
        this.interface.addListener("state-change", (ev)=>{
            console.debug(`${this.label()}:::Interface state change event - ${ev}`);
            Muffin.PostOffice.sockets[this.CONFIG.connectionName].dispatchMessage("connection-update",{
                current_state: this.current_state
            });
        });

		this._loadDefaults();

		this.switchState("connecting");
	}

	validateMsgToHost(_inflection){
		return _inflection instanceof Muffin.Lexeme;
	}

	sendMsgToHost(_inflection) {
		var isValid = this.validateMsgToHost(_inflection);

		if(isValid){
			this.connection.send(_inflection.stringify());
		}
	}
}


export { ConnectionManager };