sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/integration/library"
], function (
    ManagedObject,
    JSONModel,
    MessageToast,
    integrationLibrary
) {
    "use strict";

    return ManagedObject.extend("com.tasa.test.controller.PescaDescargada", {

        constructor: function (oView, sFragName) {

            this._oView = oView;
            this._oControl = sap.ui.xmlfragment(oView.getId(), "com.tasa.test.fragments." + sFragName, this);
            this._bInit = false;


        },
        onButtonPress3: function (o_event) {
            console.log(o_event);
        },

        getcontrol: function () {
            return this._oControl;
        },

        validarBodegas: function () {
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var bOk = true;
            var ListaEventos = [];
            var eventoActual = {};
            var bodegas = eventoActual.Bodegas;
            var cantTotal = 0;
            var mensaje = "";
            for (let index = 0; index < bodegas.length; index++) {
                const element = bodegas[index];
                var cantPesca = element.CantPesca;
                var capaMaxim = element.CapaPesca;
                if (cantPesca) {
                    cantTotal += cantPesca;
                    if (cantPesca > capaMaxim) {
                        bOk = false;
                        mensaje = this.oBundle.getText("CAPABODEGASUPER");
                        MessageBox.error(mensaje);
                        break;
                    }
                }
            }

            if (bOk) {
                if (cantTotal == 0) {
                    bOk = false;
                    mensaje = this.oBundle.getText("CANTTOTBODNOCERO");
                    MessageBox.error(mensaje);
                }
            }

            return bOk;
        },

        validarBodegaPesca: function (verMensaje) {
            var bOk = true;
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var eventoActual = {};
            var cantPesca = eventoActual.PescaDeclarada;
            var cantTotBod = eventoActual.CantTotalPescDecla;
            if ((cantTotBod > 1 && cantPesca == 0) || (cantTotBod == 0 && cantPesca > 0)) {
                if (cantPesca > 0) {
                    if (!this.oApproveDialog) {
                        this.oApproveDialog = new Dialog({
                            type: DialogType.Message,
                            title: "Confirm",
                            content: new Text({ text: "Do you want to submit this order?" }),
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "Submit",
                                press: function () {
                                    MessageToast.show("Submit pressed!");
                                    this.oApproveDialog.close();
                                }.bind(this)
                            }),
                            endButton: new Button({
                                text: "Cancel",
                                press: function () {
                                    this.oApproveDialog.close();
                                }.bind(this)
                            })
                        });
                    }

                    this.oApproveDialog.open();
                } else {
                    mensaje = this.oBundle.getText("BODDECPESCANODEC");
                    MessageBox.error(mensaje);
                }
                bOk = false;
            }
            return bOk;
        },

        eliminarPescaDeclarada: function(){
            var eventoActual = {};
            var pescaDeclarada = eventoActual.PescaDeclarada;
            var ePescaDeclarada = eventoActual.ePescaDeclarada;
            for (let index = 0; index < pescaDeclarada.length; index++) {
                const element = pescaDeclarada[index];
                if(element.indicador == "E"){
                    var ePescaDeclarada = {
                        Especie: element.Especie
                    };
                    ePescaDeclarada.push(ePescaDeclarada);
                }
            }
            pescaDeclarada = [];
        }


    });
});