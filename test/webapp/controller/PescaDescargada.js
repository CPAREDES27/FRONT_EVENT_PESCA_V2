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
            //refrescar modelo
        },


        validarDatosEvento: function(){
            var soloLectura = DataSession.SoloLectura;//modelo data session
            var tieneErrores = DetalleMarea.TieneErrores;//modelo detalle marea
            var eventoActual = {};//modelo evento actual
            var visible = {};//modelo visible
            var motivoEnCalend = ["1", "2", "8"];//motivos de marea con registros en calendario
            if(!soloLectura && !tieneErrores){
                var tipoEvento = eventoActual.TipoEvento;
                var indEvento = eventoActual.Indicador;
                var motMarea = eventoActual.MotMarea;
                var bOk = true;//llamar metodo wdThis.validarCamposGeneral(true)
                if(bOk && visible.TabHorometro){
                    bOk = true;//llamar metodo wdThis.validarLecturaHorometros(true);
                    if(bOk){
                        bOk = true;//llamar wdThis.validarHorometrosEvento();
                    }
                }

                
                if(bOk && tipoEvento == "6" && motivoEnCalend.includes(motMarea)){
                    visible.VisibleDescarga = false;
                    visible.FechFin = false;
                    var fechIni = eventoActual.FechIni;
                    bOk = true;//llamar a metodo wdThis.wdGetFormCustController().verificarTemporada(motivoMarea, fechIni);
                    //refrescar modelo visible
                }

                if(bOk && tipoEvento == "3"){
                    visible.Descarga = true;
                    bOk = true; //llamar metodo wdThis.validarPescaDeclarada(true);
                    if(bOk && motMarea == "1"){
                        //llamar metodo wdThis.calcularCantTotalBodegaEve();
                        bOk = true;//llamar metodo wdThis.validarBodegas(true);
                        
                    }
                }
            }
            return bOk;
        },

        validarPescaDescargada: function(){
            var bOk = true;
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var valorAtributo = null;
            var DetalleMarea = {}//modelo detalle de marea
            var eventoActual = {};//modelo evento actual
            var PescaDescargada = eventoActual.PescaDescargada; //actual pesca descargada
            var tipoDescarga = eventoActual.TipoDescarga;
            var indPropPlanta = eventoActual.IndPropPlanta;
            var motMarea = eventoActual.MotMarea;
            var centEmba = DetalleMarea.CenEmbarcacion;
            var atributos = ["CantPescaDescargada", "CantPescaDeclarada"];
            var mensaje = "";
            if(indPropPlanta == "T"){
                if(PescaDescargada.Especie == "0000000000"){
                    mensaje = this.oBundle.getText("SELECCESPECIE");
                    MessageBox.error(mensaje);
                    bOk = false;
                }
                if(PescaDescargada.Indicador == "N"){
                    PescaDescargada.NroDescarga = tipoDescarga + centEmba;
                    //Refrescar modelo
                }
                PescaDescargada.FechContabilizacion = eventoActual.FechProduccion;
                PescaDescargada.Planta = eventoActual.Planta;
            }else if(indPropPlanta == "P"){
                if(motMarea == "1"){
                    atributos = ["CantPescaDeclarada"];
                }else{
                    atributos = ["CantPescaDeclarada", "PuntDescarga", "FechContabilizacion"];
                }
                eventoActual.FechProduccion = PescaDescargada.FechContabilizacion;
                eventoActual.CantTotalPescDecla = PescaDescargada.CantPescaDeclarada;
                //refrescar modelo
                if (PescaDescargada.NroDescarga) {
                    mensaje = this.oBundle.getText("SELECCDESCARGA");
                    MessageBox.error(mensaje);
                    bOk = false;
                }
            }

            if(atributos){
                var actualPescaDescargada = {}//actual pesca descargada
                for (let index = 0; index < atributos.length; index++) {
                    const element = atributos[index];
                    var valor = actualPescaDescargada[element];
                    if(!valor){
                        bOk = false;
                        mensaje = this.oBundle.getText("MISSINGFIELD", [element]);
                        //agregar mensaje al modelo de message popover
                    }
                    
                }
            }

            if(bOk){
                if(indPropPlanta == "T"){
                    PescaDescargada.CantPescaModificada = PescaDescargada.CantPescaDescargada;
                    //refrescar modelo
                }
                if(PescaDescargada.CantPescaDeclarada < 0){
                    bOk = false;
                }
                
            }

            return bOk;
        }


    });
});