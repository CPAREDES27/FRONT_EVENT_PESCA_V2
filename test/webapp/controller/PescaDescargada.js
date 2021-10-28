sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "./General",
    "./Horometro",
    "./PescaDeclarada",
    "./Siniestro"
], function (
    ManagedObject,
    JSONModel,
    MessageToast,
    integrationLibrary,
    General,
    Horometro,
    PescaDeclarada,
    Siniestro
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
            var DataSession = {};//modelo data session
            var DetalleMarea = {};//modelo detalle marea
            var soloLectura = DataSession.SoloLectura;//modelo data session
            var tieneErrores = DetalleMarea.TieneErrores;//modelo detalle marea
            var listaEventos = DetalleMarea.ListaEventos;
            var eventoActual = {};//modelo evento actual
            var visible = {};//modelo visible
            var motivoEnCalend = ["1", "2", "8"];//motivos de marea con registros en calendario

            if(!soloLectura && !tieneErrores){
                var tipoEvento = eventoActual.TipoEvento;
                var indEvento = eventoActual.Indicador;
                var motMarea = eventoActual.MotMarea;
                var bOk = General.validarCamposGeneral(true);
                var eveActual = listaEventos.indexOf(eventoActual);
                var cantEventos = listaEventos.length;
                if(bOk && visible.TabHorometro){
                    bOk = Horometro.validarLecturaHorometros();
                    if(bOk){
                        bOk = Horometro.validarHorometrosEvento();
                    }
                }

                if(bOk && tipoEvento == "6" && motivoEnCalend.includes(motMarea)){
                    visible.VisibleDescarga = false;
                    visible.FechFin = false;
                    var fechIni = eventoActual.FechIni;
                    bOk = General.verificarTemporada(motMarea, fechIni);
                }

                if(bOk && tipoEvento == "3"){
                    visible.Descarga = true;
                    bOk = PescaDeclarada.validarPescaDeclarada(true);
                    if(bOk && motMarea == "1"){
                        Horometro.calcularCantTotalBodegaEve();
                        bOk = this.validarBodegas();
                        if(bOk){
                            bOk = this.validarBodegaPesca(true)();
                        }
                        if(bOk){
                            bOk = PescaDeclarada.validarPorcPesca();
                        }
                        PescaDeclarada.calcularPescaDeclarada();
                    } else if(bOk && motMarea == "2"){
                        PescaDeclarada.calcularCantTotalPescDeclEve();
                    }
                    if(bOk){
                        PescaDeclarada.validarCantidadTotalPesca();
                    }
                    if(bOk){
                        bOk = General.validarIncidental();
                        if(bOk){
                            //wdThis.wdGetEventoCustController().cargarIncidental();
                        }
                    }

                    if(eventoActual.CantTotalPescDecla){
                        eventoActual.CantTotalPescDeclaM = eventoActual.CantTotalPescDecla;
                    }else{
                        eventoActual.CantTotalPescDeclaM = null;
                    }

                    if(eveActual < cantEventos){
                        var cantTotalDec = eventoActual.CantTotalPescDecla;
                        var cantTotalDecDesc = 0;
                        for (let index = (eveActual + 1); index < cantEventos; index++) {
                            const element = listaEventos[index];
                            if(element.TipoEvento == "3"){
                                visible.VisibleDescarga = false;
                                cantTotalDec += element.CantTotalPescDecla;
                            } else if(element.TipoEvento == "5"){
                                visible.VisibleDescarga = false;
                                if (index == (cantEventos - 1)) {
                                    if(cantTotalDec < 0 || cantTotalDec == 0){
                                        element.MotiNoPesca = "7";
                                        element.Editado = true;
                                    }
                                } else {
                                    element.MotiNoPesca = null;
                                    element.Editado = true;
                                }
                            } else if(element.TipoEvento == "6"){
                                visible.VisibleDescarga = false;
                                visible.FechFin = false;
                                if(cantTotalDec < 0 || cantTotalDec == 0){
                                    bOk = false;
                                    break;
                                } else {
                                    if(element.PescaDescargada.CantPescaDeclarada){
                                        cantTotalDecDesc += element.PescaDescargada.CantPescaDeclarada;
                                    }
                                }
                            } else if(element.TipoEvento == "1"){
                                visible.VisibleDescarga = true;
                                if(cantTotalDec > 0 && cantTotalDecDesc == 0){

                                }

                            }
                        }
                    }
                }

                if(bOk && tipoEvento == "6"){
                    visible.VisibleDescarga = false;
                    visible.FechFin = false;
                    bOk = this.validarPescaDescargada();
                    if(eventoActual.PescaDescargada.CantPescaModificada){
                        eventoActual.CantTotalPescDescM = eventoActual.PescaDescargada.CantPescaModificada;
                    }else{
                        eventoActual.CantTotalPescDescM = null;
                    }
                    //wdThis.wdGetEventoCustController().obtenerTipoDescarga(eveActual);
                }

                if(bOk && tipoEvento == "8"){
                    visible.VisibleDescarga = true;
                    bOk = Siniestro.validarSiniestros();
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