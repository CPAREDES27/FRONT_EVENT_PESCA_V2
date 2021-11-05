sap.ui.define([
	"sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/ui/integration/library",
    "../service/TasaBackendService",
    "./Horometro",
    "./PescaDescargada",
    "./PescaDeclarada",
    "./Siniestro",
    "../model/textValidaciones"
], function(
	ManagedObject,
    JSONModel,
    MessageToast,
    integrationLibrary,
    TasaBackendService,
    Horometro,
    PescaDescargada,
    PescaDeclarada,
    Siniestro,
    textValidaciones
) {
	"use strict";

	return ManagedObject.extend("com.tasa.test.controller.General", {

        constructor: function(oView,sFragName,o_this) {

            this._oView = oView;
            this._oControl = sap.ui.xmlfragment(oView.getId(), "com.tasa.test.fragments."+ sFragName,this);
            this._bInit = false;
            this.ctr = o_this;
            this.previousTab = "";
            this.nextTab = "";
            console.log(textValidaciones.eventAttTabGeneral);

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

        validarCamposGeneral: function(bool){
            var bOk = false;
            var eventoActual = this.ctr._listaEventos[this.ctr._elementAct]; //nodo evento actual
            //var detalleMarea = {};//modelo detalle marea
            var Utils = {};//modelo Utils
            var visible = {};//modelo visible
            //var eventAttTabGeneral = {};//modelo con los atributos de los tab por tipo de evento
            var motivoMarea = this.ctr._motivoMarea;
            var tipoEvento = this.ctr._tipoEvento;
            var indPropiedad = this.ctr._indicadorProp;
            var indPropPlanta = this.ctr._indicadorPropXPlanta; //
            var eveCampGeneVal = ["1", "5", "6", "H", "T"]; //Tipos de evento con campos generales distintos a validar 
            if(indPropiedad == "P"){
                if(Utils.OpSistFrio && parseInt(tipoEvento) < 6){
                    if(eventoActual.SistemaFrio){
                        var mssg = this.oBundle.getText("MISSINGSISTFRIO");
                        MessageBox.error(mssg);
                        bOk = false;
                    }
                }
            }
            if(!eveCampGeneVal.includes(tipoEvento)){
                bOk = this.validateFields(textValidaciones.eventAttTabGeneral[Number(tipoEvento)],bool);
                if(bOk && tipoEvento == "3"){
                    textValidaciones.visible.VisibleDescarga = true;
                    //bOk =  wdThis.wdGetEventoCustController().validarLatitudLongitud()
                }
            } else {
                var estOperacion = eventoActual.EstaOperacion;
                var eventosValidar = textValidaciones.eventAttTabGeneral[Number(tipoEvento)];
                if(tipoEvento == "1"){
                    textValidaciones.visible.VisibleDescarga = true;
                    if(textValidaciones.visible.MotiLimitacion){
                        eventosValidar = textValidaciones.eventAttTabGeneral[10];
                    }
                    if(indPropiedad == "T"){
                        eventosValidar = textValidaciones.eventAttTabGeneral[14];
                    }
                } else if(tipoEvento == "5"){
                    visible.VisibleDescarga = true;
                    var motLimitacion = textValidaciones.visible.MotiLimitacion;
                    var motNoPesca = textValidaciones.visible.MotiNoPesca;
                    if(indPropiedad == "P"){
                        if(motLimitacion && motNoPesca){
                            eventosValidar = textValidaciones.eventAttTabGeneral[13];
                        } else if (motLimitacion){
                            eventosValidar = textValidaciones.eventAttTabGeneral[11];
                        } else if (motNoPesca){
                            eventosValidar = textValidaciones.eventAttTabGeneral[12];
                        }
                    }else{
                        eventosValidar = textValidaciones.eventAttTabGeneral[15];
                    }
                } else if(tipoEvento == "6"){
                    textValidaciones.visible.VisibleDescarga = false;
                    textValidaciones.visible.FechFin = false;
                    if(indPropPlanta == "P"){
                        if(indPropiedad == "P"){
                            if(motivoMarea == "1"){
                                eventosValidar = textValidaciones.eventAttTabGeneral[17];
                            } else if(motivoMarea == "2"){
                                eventosValidar = textValidaciones.eventAttTabGeneral[16];
                            }
                        } else {
                            if(motivoMarea == "1"){
                                eventosValidar = textValidaciones.eventAttTabGeneral[21];
                            } else if(motivoMarea == "2"){
                                eventosValidar = textValidaciones.eventAttTabGeneral[18];
                            }
                        }
                    } else if(indPropPlanta == "T"){
                        if(indPropiedad == "P"){
                            eventosValidar = textValidaciones.eventAttTabGeneral[6];
                        }
                    } 
                } else if(tipoEvento == "H"){
                    eventosValidar = textValidaciones.eventAttTabGeneral[20];
                } else if(tipoEvento == "T"){
                    eventosValidar = textValidaciones.eventAttTabGeneral[20];
                }

                bOk = this.validateFields(eventosValidar,bool);
            }

            if(bOk && tipoEvento == "1" && indPropiedad == "P"){
                bOk = this.ctr.validarEsperaEventoAnterior();
                textValidaciones.visible.VisibleDescarga = true;
            }

            if(bOk && tipoEvento == "7"){
                bOk = this.ctr.validarDatosEspera();
                textValidaciones.visible.VisibleDescarga = true;
            }

            if(bOk){
                eventoActual.FechHoraIni = eventoActual.FechIni + " " + eventoActual.HoraIni;
                if(textValidaciones.visible.FechFin){
                    eventoActual.FechHoraFin = eventoActual.FechFin + " " + eventoActual.HoraFin;
                }
            }

            return bOk;
        },

        onActionSelectTab: function(){
            var DataSession = {};//modelo data session
            var soloLectura = DataSession.SoloLectura;
            var visible = {};//modelo visible
            var eventoActual = {}; //nodo evento actual
            var motivoEnCalend = ["1", "2", "8"]; // Motivos de marea con registros en calendario
            var detalleMarea = {};//modelo detalle marea
            if(!soloLectura){
                visible.Links(false);
                var tipoEvento = eventoActual.TipoEvento;
                var motivoMarea = detalleMarea.MotMar;
                var fechEvento = new Date(eventoActual.FechIni);
                if(this.previousTab == "General"){
                    var validarStockCombustible = this.validarStockCombustible();
                    if(!this.validarCamposGeneral(true)){
                        this.nextTab = this.previousTab;   
                    } else if(tipoEvento == "6" && motivoEnCalend.includes(motivoMarea)){
                        visible.visibleDescarga = false;
                        visible.fechFin = false;
                        var verificarTemporada = this.verificarTemporada(motivoMarea, fechEvento);
                        if(fechEvento && !verificarTemporada){
                            this.nextTab = this.previousTab;
                        }
                    } else if(tipoEvento == "5" && visible.tabHorometro && !validarStockCombustible){
                        visible.visibleDescarga = true;
                        this.nextTab = this.previousTab;
                    }
                }

                if(tipoEvento == "3" && this.nextTab !== this.previousTab){
                    if(motivoMarea == "1"){
                        var bOk = true;
                        Horometro.calcularCantTotalBodegaEve();
                        var validarBodegas = PescaDescargada.validarBodegaPesca(true);
                        if(bOk && this.previousTab == "General" && this.nextTab == "PescaDeclarada" && !validarBodegas){
                            this.nextTab = "Distribucion";
                        }

                        if(this.previousTab == "Distribucion" && this.nextTab == "PescaDeclarada" && !validarBodegas){
                            this.nextTab = this.previousTab;
                        }

                        if(bOk && this.previousTab == "Distribucion" && this.nextTab != "Biometria" && !validarBodegas){
                            this.nextTab = this.previousTab;
                        }
                        PescaDeclarada.calcularPescaDeclarada();
                    }else if(motivoMarea == "2"){
                        PescaDeclarada.calcularCantTotalPescDeclEve();
                    }

                    var valCantTotPesca = PescaDeclarada.validarCantidadTotalPesca();
                    if(this.previousTab != "General" && !valCantTotPesca){
                        this.nextTab = this.previousTab;
                    }

                    if((this.nextTab == "PescaDeclarada" && eventoActual.ObteEspePermitidas) || 
                        (this.nextTab == "Biometria" && eventoActual.ObteEspePermitidas)){
                            this.obtenerTemporadas(motivoMarea, eventoActual.FechIni);
                            this.obtenerTemporadas("8", eventoActual.FechIni);
                            this.consultarPermisoPesca(eventoActual.Embarcacion, motivoMarea);
                    }
                }

                if(tipoEvento == "6" && this.nextTab == "Horometro" && eventoActual.NroDescarga){
                    visible.visibleDescarga = false;
                    visible.fechFin = false;
                    this.nextTab = "PescaDescargada";
                }

                var validarLecturaHorometros = Horometro.validarLecturaHorometros();
                var validarHorometrosEvento = Horometro.validarHorometrosEvento();
                if(this.previousTab == "Horometro" && (!validarLecturaHorometros || !validarHorometrosEvento)){
                    this.nextTab = this.previousTab;
                }

                if(this.nextTab == "PescaDescargada"){
                    //wdThis.wdGetEventoCustController().prepararInputsDescargas();
                }

                var validarPescaDescargada = PescaDescargada.validarPescaDescargada();
                if(this.previousTab == "PescaDescargada" && !validarPescaDescargada){
                    this.nextTab = this.previousTab;
                }

                var valSiniestro = Siniestro.validarSiniestros();
                if(this.previousTab == "Siniestro" && !valSiniestro){
                    this.nextTab = this.previousTab;
                }

            }
            //refrescar modelos
        },

        verificarTemporada: function(motivo, fecha){
            //desarrollar servicio verificar temporada
            var codTemp = "";
            if(motivo == "1"){
                codTemp = "D";
            }else{
                if(motivo == "2"){
                    codTemp = "I"; 
                }else{
                    codTemp = "V"; 
                }
            }

            TasaBackendService.verificarTemporada(codTemp, fecha).then(function(response){
                //obtener repsonse
                return true
            }).catch(function(error){
                console.log("ERROR: General.verificarTemporada - ", error );
            });

            return false;

        },

        consultarPermisoPesca: function(cdemb, motivo){
            var detalleMarea = {};//modelo detalle marea
            var codTemp = "";
            if(motivo == "1"){
                codTemp = "D";
            }else{
                if(motivo == "2"){
                    codTemp = "I"; 
                }else{
                    codTemp = "V"; 
                }
            }

            TasaBackendService.obtenerEspeciesPermitidas(cdemb, codTemp).then(function(response){
                //obtener repsonse
                //detalleMarea.EspPermitida = repsonse;
            }).catch(function(error){
                console.log("ERROR: General.consultarPermisoPesca - ", error );
            });
        },

        obtenerTemporadas: function(motivo, fecha){
            var calendarioPesca = [];
            var codTemp = "";
            if(motivo == "1"){
                codTemp = "D";
            }else{
                if(motivo == "2"){
                    codTemp = "I"; 
                }else{
                    codTemp = "V"; 
                }
            }

            TasaBackendService.obtenerTemporadas(codTemp, fecha).then(function(response){
                //obtener repsonse
                var data = [];
                for (let index = 0; index < data.length; index++) {
                    const element = array[index];
                    var obj = {};//crear objeto calendario
                    calendarioPesca.push(obj);
                };
                //setear variable global calendarioPescaCHD calendarioPescaCHI calendarioPescaVED
            }).catch(function(error){
                console.log("ERROR: General.obtenerTemporadas - ", error );
            });

        },

        validarStockCombustible: function(){
            //llamar evento valida stock combustible
        },

        validarIncidental: function(){
            var bOk = true;
            var nodeInciden = this.ctr._listaEventos[this.ctr._elementAct].ListaIncidental; //modelo incidental
            var ListaBiomet = this.ctr._listaEventos[this.ctr._elementAct].ListaBiometria;//modelo lista biometria
            if(nodeInciden.length > 0){
                if(ListaBiomet.length > 0){
                    for (let index = 0; index < ListaBiomet.length; index++) {
                        const element = ListaBiomet[index];
                        for (let index1 = 0; index1 < nodeInciden.length; index1++) {
                            const element1 = nodeInciden[index1];
                            if(element.CodEspecie == element1.Cdspc){
                                bOk = false;
                                break;
                            }
                        }
                    }
                }else{
                    bOk = false;
                    var mssg = this.oBundle.getText("NOREGBIOMET");
                    MessageBox.error(mssg);
                }
            }

            if(!bOk){
                var mssg = this.oBundle.getText("VALINCIDENTAL");
                MessageBox.error(mssg);
            }
            return bOk;
        },
        map_onActionVerMotiLimitacion:function(event){
            sap.ui.controller("Horometro").onActionVerMotiLimitacion();
            //Horometro.onActionVerMotiLimitacion();
        }


        



	});
});