sap.ui.define([
	"sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/ui/integration/library"
], function(
	ManagedObject,
    JSONModel,
    MessageToast,
    integrationLibrary
) {
	"use strict";

	return ManagedObject.extend("com.tasa.test.controller.General", {

        constructor: function(oView,sFragName) {

            this._oView = oView;
            this._oControl = sap.ui.xmlfragment(oView.getId(), "com.tasa.test.fragments."+ sFragName,this);
            this._bInit = false;


        },
        onButtonPress3:function(o_event){
            console.log(o_event);
        },

        getcontrol:function(){
            return this._oControl;
        },

        validateFields: function(attributeName, verMensajes){
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var bOk = true;
            var value = null;
            var messages = [];
            for (var key in attributeName) {
                if (attributeName.hasOwnProperty(key)) {
                    var value = attributeName[key];
                    if (!value) {
                        var message = this.oBundle.getText("CAMPONULL", [value]);
                        messages.push(message);
                    }
                }
            }
            return messages;
        },

        messagePopover: function(){


            var that = this;

			this.oMP = new MessagePopover({
				activeTitlePress: function (oEvent) {
					var oItem = oEvent.getParameter("item"),
						oPage = that.getView().byId("messageHandlingPage"),
						oMessage = oItem.getBindingContext("message").getObject(),
						oControl = Element.registry.get(oMessage.getControlId());

					if (oControl) {
						oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
						setTimeout(function(){
							oControl.focus();
						}, 300);
					}
				},
				items: {
					path:"message>/",
					template: new MessageItem(
						{
							title: "{message>message}",
							subtitle: "{message>additionalText}",
							groupName: {parts: [{path: 'message>controlIds'}], formatter: this.getGroupName},
							activeTitle: {parts: [{path: 'message>controlIds'}], formatter: this.isPositionable},
							type: "{message>type}",
							description: "{message>message}"
						})
				},
				groupItems: true
			});

			this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
        },

        validarCamposGeneral: function(){
            
        }

        



	});
});