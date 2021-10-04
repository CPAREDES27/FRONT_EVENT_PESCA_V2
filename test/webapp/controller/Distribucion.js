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

	return ManagedObject.extend("com.tasa.test.controller.Distribucion", {

        constructor: function(oView,sFragName) {

            this._oView = oView;
            this._oControl = sap.ui.xmlfragment(oView.getId(), "com.tasa.test.fragments."+ sFragName,this);
            this._bInit = false;

            this._oView.byId("P02").addColumn( new sap.m.Column({
                header: new sap.m.Label({
                    text:"hi" //data[0].KURZNAME
                })
            }));


        },
        onButtonPress3:function(o_event){
            console.log(o_event);
        },

        getcontrol:function(){
            return this._oControl;
        }
	});
});