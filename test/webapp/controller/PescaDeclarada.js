sap.ui.define([
	"sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/ui/integration/library",
    "sap/m/MessageBox",
], function(
	ManagedObject,
    JSONModel,
    MessageToast,
    integrationLibrary,
    MessageBox
) {
	"use strict";

	return ManagedObject.extend("com.tasa.test.controller.PescaDeclarada", {

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

        validarPescaDeclarada: function(verMensajes){
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var bOk = true;
            var motivo = marea.MotMar; //motivo de marea de modelo detalle marea
            var ListaEventos = [];
            var eventoActual = {}; //modelo del evento actual
            var pescaDeclarada = eventoActual.PescaDeclarada;
            for (let index = 0; index < pescaDeclarada.length; index++) {
                const element = pescaDeclarada[index];
                var valorPesca = null;
                var mensaje = "";
                if(motivo == "1" || motivo == "2"){
                    if(motivo === "1"){
                        valorPesca = element.PorcPesca;
                        mensaje = this.oBundle.getText("ALGCANTPESCACERO");
                    }else{
                        valorPesca = element.CantPesca;
                        mensaje = this.oBundle.getText("ALGPORCPESCACERO"); 
                    }

                    if(!valorPesca){
                        bOk = false;
                        if(verMensajes){
                            MessageBox.error(mensaje);
                        }   
                    }

                    if(bOk && motivo == "1"){
                        if(element.Moda < 1){
                            bOk = false;
                            if(verMensajes){
                                mensaje = "";//no se encontro en el pool de mensajes ALGVALMODACERO
                                MessageBox.error(mensaje);
                            }
                        }


                    }

                    if(!bOk){
                        break;
                    }
                }
                
            }

            return bOk;
        },

        calcularPescaDeclarada: function(){
            var eventoActual = {}; //modelo del evento actual
            var cantPescaDec = eventoActual.PescaDeclarada.length;
            var cantTotal = eventoActual.CantTotalPescDecla;
            if(cantTotal > 0 && cantPescaDec > 0){
                var pescaDecla = eventoActual.PescaDeclarada;
                for (let index = 0; index < pescaDecla.length; index++) {
                    const element = pescaDecla[index];
                    var porcPesca = element.porcPesca;
                    pescaDecla.Editado = true;
                    pescaDecla.PorcPesca = porcPesca;
                    pescaDecla.CantPesca = cantTotal * (porcPesca * 0.01);
                }
            }
        },

        validarPorcPesca: function(){
            var bOk = true;
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var eventoActual = {}; //modelo del evento actual
            var cantPescaDec = eventoActual.PescaDeclarada.length;
            var cantTotal = eventoActual.CantTotalPescDecla;
            if(cantTotal > 0 && cantPescaDec > 0){
                var pescaDeclarada = eventoActual.PescaDeclarada;
                var porcTotal = 0;
                for (let index = 0; index < pescaDeclarada.length; index++) {
                    const element = pescaDeclarada[index];
                    var porcPesca = element.PorcPesca;
                    porcPesca = porcPesca != null ? porcPesca : 0;
                    porcTotal += porcPesca;
                }

                if(porcTotal < 100){
                    bOk = false;
                    var mssg = this.oBundle.getText("PORCPESCMENOR100");
                    MessageBox.error(mssg);
                }else if(porcTotal > 100){
                    bOk = false;
                    var mssg = this.oBundle.getText("PORCPESCMAYOR100");
                    MessageBox.error(mssg);
                }
            
            }
            return bOk;
        },

        calcularCantTotalPescDeclEve: function(){
            var eventoActual = {}; //modelo del evento actual
            var pescaDeclarada = eventoActual.PescaDeclarada;
            var cantTotal = 0;
            for (let index = 0; index < pescaDeclarada.length; index++) {
                const element = pescaDeclarada[index];
                var cantPesca = element.CantPesca;
                cantPesca = cantPesca != null ? cantPesca : 0;
                cantTotal += cantPesca;
            }
            eventoActual.CantTotalPescDecla = cantTotal;
            //refrescar modelo
        },

        validarCantidadTotalPesca: function(){
            var eventoActual = {};
            var indProp = "";//obtener indicador de propeidad del modelo de marea
            var cantPermiso = "";//obtener capacidad de bodega del modelo de marea
            var cantTotal = 0;
        }



	});
});