sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "./General",
    "./Distribucion",
    "./PescaDeclarada",
    "./PescaDescargada",
    "./Horometro",
    "./Equipamiento",
    "./Siniestro",
    "./Accidente",
    "./Biometria",
    "../model/textValidaciones",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Fragment",
    "../service/TasaBackendService"
], function (
    Controller,
    General,
    Distribucion,
    PescaDeclarada,
    PescaDescarga,
    Horometro,
    Equipamiento,
    Siniestro,
    Accidente,
    Biometria,
    textValidaciones,
    JSONModel,
    MessageToast,
    integrationLibrary,
    Fragment,
    TasaBackendService
) {
    "use strict";
    return Controller.extend("com.tasa.test.controller.Detalle", {

        /**
         * @override
         */
         onInit: function () {

            //var response = TasaBackendService.obtenerCodigoTipoPreservacion("0000000013");
            //console.log(response);
            /********* Carga de variables globales **********/
            this._utilNroEventoBio = "001";
            this._utilNroEventoIncid = "001";
            this._utilFlagVistaBiometria = true;
            this._motivoMarea = "1";
            this._tipoEvento = "8";
            this._nroEvento = "6";
            this._indicador = "E";
            this._indicadorProp = "T";
            this._embarcacion = "0000000013";
            this._indicadorPropXPlanta = "P";
            this._soloLectura = false;
            this._EsperaMareaAnt = [{ "id": "0" }, { "id": "1" }];
            this._listaEventos = [{ "id": "0", "TipoEvento": "7", "MotiNoPesca": "no pesca", "EstaOperacion": "L", "ObseAdicional": "Prueba" }, { "id": "1", "TipoEvento": "2", "MotiNoPesca": "no pesca", "EstaOperacion": "L", "ObseAdicional": "Prueba" }];
            this._listaHorometros = [{ "id": "0", "TipoEvento": "7", "MotiNoPesca": "no pesca", "EstaOperacion": "L", "ObseAdicional": "Prueba" }, { "id": "1", "TipoEvento": "2", "MotiNoPesca": "no pesca", "EstaOperacion": "L", "ObseAdicional": "Prueba" }];
            this._FormMarea = { "EstMarea": "C", "EstCierre": "A", "FecCierre": "02/24/2021", "HorCierre": "17:04:50", "ObseAdicional": "Prueba" };
            this._mareaReabierta = false;
            this._elementAct = "1";
            this._IsRolRadOpe = true;
            this._IsRolIngComb = true;
            this._tipoPreservacion = "";

            /************ Carga de fragments de los eventos **************/
            let self = this;
            this.cargarServiciosPreEvento().then(r =>{
                 if(r){
                    self.getFragment();
                 }else {
                     alert("Error");
                }
            })
              
            var cardManifests = new JSONModel();
            var oCitiesModel = new JSONModel(),
                oProductsModel = new JSONModel();

            cardManifests.loadData("./model/cardManifests.json");
            oCitiesModel.loadData("./model/cities.json");
            oProductsModel.loadData("./model/products.json");

            this.getView().setModel(cardManifests, "manifests");
            this.getView().setModel(oCitiesModel, "cities");
            this.getView().setModel(oProductsModel, "products");

            // let s = await  this.cargarServiciosPreEvento();
            // console.log(s);

        },

        cargarServiciosPreEvento: function(){

            let self = this;
            var s1 = TasaBackendService.obtenerCodigoTipoPreservacion("0000000012");
            var s2 = TasaBackendService.obtenerCodigoTipoPreservacion();

            return  Promise.all([s1, s2]).then(values => {
                console.log(JSON.parse(values[0]).data);
                self._tipoPreservacion = JSON.parse(values[0]).data[0].CDTPR;
                return true;
              }).catch(reason => {
                return false;
              })

        },

        getFragment: function () {
            var o_tabGeneral = this.getView().byId("idGeneral");
            var o_tabDistribucion = this.getView().byId("idDistribucion");
            var o_tabPescaDeclarada = this.getView().byId("idPescaDecl");
            var o_tabPescaDescargada = this.getView().byId("idPescaDesc");
            var o_tabHorometro = this.getView().byId("idHorometro");
            var o_tabEquipamiento = this.getView().byId("idEquipamiento");
            var o_tabSiniestro = this.getView().byId("idSiniestro");
            var o_tabAccidente = this.getView().byId("idAccidente");
            var o_tabBiometria = this.getView().byId("idBiometria");

            var o_fragment = new General(this.getView(), "General");
            var o_fragment2 = new General(this.getView(), "General_fechas");
            var o_fragment3 = new General(this.getView(), "General_operacion");
            var o_fragment4 = new General(this.getView(), "General_espera");
            var o_fragment5 = new General(this.getView(), "General_adicional");

            var o_fragment6 = new Distribucion(this.getView(), "Distribucion");
            var o_fragment7 = new PescaDeclarada(this.getView(), "PescaDeclarada");
            var o_fragment8 = new PescaDescarga(this.getView(), "PescaDescargada");
            var o_fragment9 = new Horometro(this.getView(), "Horometro");
            var o_fragment10 = new Equipamiento(this.getView(), "Equipamiento");
            var o_fragment11 = new Siniestro(this.getView(), "Siniestro");
            var o_fragment12 = new Accidente(this.getView(), "Accidente");
            var o_fragment13 = new Biometria(this.getView(), "Biometria", this._utilNroEventoBio);


            o_tabGeneral.addContent(o_fragment.getcontrol());
            o_tabGeneral.addContent(o_fragment2.getcontrol());
            o_tabGeneral.addContent(o_fragment3.getcontrol());
            o_tabGeneral.addContent(o_fragment4.getcontrol());
            o_tabGeneral.addContent(o_fragment5.getcontrol());

            o_tabDistribucion.addContent(o_fragment6.getcontrol());
            o_tabPescaDeclarada.addContent(o_fragment7.getcontrol());
            o_tabPescaDescargada.addContent(o_fragment8.getcontrol());
            o_tabHorometro.addContent(o_fragment9.getcontrol());
            o_tabEquipamiento.addContent(o_fragment10.getcontrol());
            o_tabSiniestro.addContent(o_fragment11.getcontrol());
            o_tabAccidente.addContent(o_fragment12.getcontrol());
            o_tabBiometria.addContent(o_fragment13.getcontrol());

            this.prepararRevisionEvento(false);

        },

        _onButtonPress1: function () {

        },

        _onButtonPress: function (o_event) {
            console.log(o_event);
        },

        prepararRevisionEvento: function (soloDatos) {
            if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA) {
                var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                fechaIniEnvase.setVisible(true);
                var fechaIniEnvaseText = this.getView().byId("0001");
                fechaIniEnvaseText.setHeaderText("Envase");
            } else {
                var fechaIniEnvaseText = this.getView().byId("0001");
                fechaIniEnvaseText.setHeaderText("Fechas");
            }

            if (this._tipoEvento == textValidaciones.TIPOEVENTODESCARGA
                && this.buscarValorFijo(textValidaciones.MOTIVOPESCADES, this._motivoMarea)) {
                var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                fechaIniEnvase.setVisible(false);
                var fechaFinEnvase = this.getView().byId("FechaEnvaseFin");
                fechaFinEnvase.setVisible(false);
                this.obtenerPescaDeclDescarga();
            }

            this.obtenerDetalleEvento();

            if (!soloDatos) {
                this.prepararVista(false);
                // wdThis.mngBckEventos(true);
            }

        },

        buscarValorFijo: function (arrayRecorrido, valor_a_encontrar) {

            var encontroValor = false

            for (var i = 0; i < arrayRecorrido.length; i++) {

                if (arrayRecorrido[i].id == valor_a_encontrar) {
                    encontroValor = true;
                }
            }


            return encontroValor
        },
        obtenerDetalleEvento: function () {
            var datCons = false// wdThis.getEventoConsultado(nroEvento);

            if (this._indicador == "E" && !datCons) {
                //wdThis.setEventoConsultado(nroEvento, true);

                if (this.buscarValorFijo(textValidaciones.EVEVISTABHOROM, this._tipoEvento)) {
                    //wdThis.obtenerHorometros(tipoEvento);
                    //wdThis.obtenerLectHorometros(marea, nroEvento);
                }

                if (this.buscarValorFijo(textValidaciones.EVEVISTABEQUIP, this._tipoEvento)) {
                    //wdThis.obtenerEquipamiento();
                }

                if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA) {
                    //wdThis.obtenerCoordZonaPesca();
                    //wdThis.obtenerPescaDeclarada(marea, nroEvento);
                    if (this._motivoMarea == "1") {
                        //wdThis.obtenerBodegas();
                        //wdThis.obtenerPescaBodega(marea, nroEvento);
                    }
                }

                if (this._tipoEvento == textValidaciones.TIPOEVENTODESCARGA) {
                    var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                    fechaIniEnvase.setVisible(false);
                    var fechaFinEnvase = this.getView().byId("FechaEnvaseFin");
                    fechaFinEnvase.setVisible(false);

                    //wdThis.wdGetFormCustController().obtenerPuntosDescarga();			
                    //wdThis.obtenerPescaDescargada(eventosElement.getNroDescarga());
                }

                if (this._tipoEvento == textValidaciones.TIPOEVENTOHOROMETRO) {
                    var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                    fechaIniEnvase.setVisible(true);
                    //wdThis.obtenerSiniestros(marea, nroEvento);
                }

                // eventosElement.setFechModificacion(new Date(Calendar.getInstance().getTimeInMillis()));
                // eventosElement.setHoraModificacion(new Time(Calendar.getInstance().getTimeInMillis()));
                // eventosElement.setAutoMoficicacion(wdThis.wdGetMainCompController().wdGetContext().currentDataSessionElement().getUser());

            }
        },
        obtenerPescaDeclDescarga: function () {
            var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
            fechaIniEnvase.setVisible(false);
            var fechaFinEnvase = this.getView().byId("FechaEnvaseFin");
            fechaFinEnvase.setVisible(false);

            let cantTotalDecl = Number('0');
            let cantTotalDeclDesc = Number('0');
            let cantTotalDeclRest = Number('0');



        },

        prepararVista: function (nuevoEvento) {

            var exisEspMarAnt = false;
            if (this._EsperaMareaAnt != null && this._EsperaMareaAnt.length > 0) { exisEspMarAnt = true; } else { exisEspMarAnt = false; }

            //Datos de fecha	
            if (this._tipoEvento == textValidaciones.TIPOEVENTOZARPE) {
                var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                fechaIniEnvase.setVisible(true);

                if (this._listaEventos.length > 1) {
                    var elementoAnt = Number(this._elementAct) - 1

                    if (this._listaEventos[elementoAnt].TipoEvento == textValidaciones.TIPOEVENTOESPERA) {
                        var dtf_fechaIniEnv = this.getView().byId("dtf_fechaIniEnv");
                        dtf_fechaIniEnv.setEnabled(false);
                    }

                } else if (exisEspMarAnt) {
                    var dtf_fechaIniEnv = this.getView().byId("dtf_fechaIniEnv");
                    dtf_fechaIniEnv.setEnabled(false);
                }
            }

            //Datos de ubicacion
            if (this.buscarValorFijo(textValidaciones.EVEVISUEMPRESA, this._tipoEvento)) {
                var fe_empresa = this.getView().byId("fe_Empresa");
                fe_empresa.setVisible(true);

                if (this._tipoEvento == textValidaciones.TIPOEVENTOARRIBOPUE) {
                    var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                    fechaIniEnvase.setVisible(true);
                    var btn_Planta = this.getView().byId("btn_Planta");
                    btn_Planta.setVisible(true);
                }
            }

            if (this.buscarValorFijo(textValidaciones.EVEVISZONPESCA, this._tipoEvento)) {
                var fe_ZonaPesca = this.getView().byId("fe_ZonaPesca");
                fe_ZonaPesca.setVisible(true);

                if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA) {
                    var fechaIniEnvase = this.getView().byId("FechaEnvaseIni");
                    fechaIniEnvase.setVisible(true);
                    var f_LatitudLongitud = this.getView().byId("f_LatitudLongitud");
                    f_LatitudLongitud.setVisible(true);

                    if (this._motivoMarea == "1") {
                        var fe_muestra = this.getView().byId("fe_muestra");
                        fe_muestra.setVisible(false);
                    }
                }

                if (this.buscarValorFijo(textValidaciones.READONLYZONPES, this._tipoEvento)) {
                    this.getView().byId("cb_ZonaPesca").setEnabled(false);
                }
            }
            //Datos de las fecha de cala de biometria 	 
            if (this.buscarValorFijo(textValidaciones.EVEVISFECHABIO, this._tipoEvento)) {
                var fe_fechaIniCala = this.getView().byId("fe_fechaIniCala");
                fe_fechaIniCala.setVisible(true);
                var fe_fechaFinCala = this.getView().byId("fe_fechaFinCala");
                fe_fechaFinCala.setVisible(true);
            }
            //Datos de fechas
            if (this.buscarValorFijo(textValidaciones.EVEVISFECHAFIN, this._tipoEvento)) {
                var labelTextFechIniEnv = this.getView().byId("labelTextFechIniEnv");
                labelTextFechIniEnv.setText("Fecha/hora inicio");
                var fechaFinEnvase = this.getView().byId("FechaEnvaseFin");
                fechaFinEnvase.setVisible(true);

                if (this._tipoEvento == textValidaciones.TIPOEVENTODESCARGA) {
                    this.getView().byId("FechaEnvaseIni").setVisible(false);
                    this.getView().byId("FechaEnvaseFin").setVisible(false);
                    this.getView().byId("fe_FechaProduccion").setVisible(true);
                    if (this._indicadorPropXPlanta == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                        this.getView().byId("fe_FechaProduccion").setEnabled(false);
                        //Sea (CHI o CHD)
                        if (this._motivoMarea == "2" || this._motivoMarea == "1") {
                            this.getView().byId("dtf_fechaIniEnv").setEnabled(false);
                            this.getView().byId("dtf_fechaFinEnv").setEnabled(false);
                        }
                    }
                }
                else if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA) {
                    this.getView().byId("FechaEnvaseIni").setVisible(false);
                    this.getView().byId("labelTextFechIniEnv").setText("Fech/hora ini. envase");
                }
            } else {
                if (this._tipoEvento == textValidaciones.TIPOEVENTOSALIDAZONA) {
                    this.getView().byId("FechaEnvaseIni").setVisible(true);
                    this.getView().byId("fe_fechaArribo").setVisible(true);
                }
            }

            if (this._tipoEvento == textValidaciones.TIPOEVENTOARRIBOPUE
                && this._listaEventos[this._elementAct].MotiNoPesca != "") {
                this.getView().byId("FechaEnvaseIni").setVisible(true);
                this.getView().byId("fe_MotiNoPesca").setVisible(true);
            }

            if (this._tipoEvento == textValidaciones.TIPOEVENTOESPERA) {
                this.getView().byId("FechaEnvaseIni").setVisible(true);
                this.getView().byId("0004").setVisible(true);
                this.getView().byId("dtf_fechaIniEnv").setEnabled(false);
            }

            //Datos de operacion
            if (this.buscarValorFijo(textValidaciones.EVEVISESTAOPER, this._tipoEvento)) {
                this.getView().byId("0003").setVisible(true);
                this.getView().byId("fe_estadoOperacion").setVisible(true);

                if (this._indicadorPropXPlanta == textValidaciones.INDIC_PROPIEDAD_PROPIOS && (this._tipoEvento == textValidaciones.TIPOEVENTOLLEGADAZONA || this._tipoEvento == textValidaciones.TIPOEVENTOSALIDAZONA)) {

                    this.getView().byId("fe_estadoOperacion").setVisible(false);
                }

                if (this._tipoEvento == textValidaciones.TIPOEVENTODESCARGA) {
                    this.getView().byId("FechaEnvaseIni").setVisible(false);
                    this.getView().byId("FechaEnvaseFin").setVisible(false);

                    this.getView().byId("fe_estadoOperacion").setVisible(false);
                    this.getView().byId("fe_tipoDescarga").setVisible(true);

                    if (this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_TERCEROS || this._indicadorPropXPlanta == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                        this.getView().byId("cb_tipoDescarga").setEnabled(false);
                    }
                }
                else {
                    this.getView().byId("FechaEnvaseIni").setVisible(true);
                }

                if (this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                    this.getView().byId("fe_stockCombustible").setVisible(true);
                }

                if (this._listaEventos[this._elementAct].EstaOperacion != null
                    && this._listaEventos[this._elementAct].EstaOperacion == "L") {
                    this.getView().byId("fe_motivoLimitacion").setVisible(true);
                }
            } else if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA && this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                this.getView().byId("0003").setVisible(true);
                this.getView().byId("fe_temperaturaMar").setVisible(true);

            } else if (this._tipoEvento == textValidaciones.TIPOEVENTOHOROMETRO && this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS
                || this._tipoEvento == textValidaciones.TIPOEVENTOTRASVASE && this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {

                this.getView().byId("0003").setVisible(true);
                this.getView().byId("fe_stockCombustible").setVisible(true);
            }

            //Mostrar Sistema frio
            if (this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {

                if (this._tipoPreservacion != "" && this._tipoPreservacion != "4") {
                    if (manageSimpleTypes.getInt(wdContext.currentEventosElement().getTipoEvento()) < 6 && !wdContext.currentEventosElement().getTipoEvento().equalsIgnoreCase("H")
                        && !wdContext.currentEventosElement().getTipoEvento().equalsIgnoreCase("T")) {
                        wdContext.currentVisibleElement().setSistFrio(WDVisibility.VISIBLE);
                        wdContext.currentUtilsElement().setOpSistFrio(true);

                    } else {
                        wdContext.currentVisibleElement().setSistFrio(WDVisibility.NONE);
                        wdContext.currentUtilsElement().setOpSistFrio(false);
                    }

                } else {
                    wdContext.currentVisibleElement().setSistFrio(WDVisibility.NONE);
                    wdContext.currentUtilsElement().setOpSistFrio(false);
                }
            }

            //Observaciones adicionales
            if (this._listaEventos[this._elementAct].ObseAdicional != "") {
                this.getView().byId("fe_observacioAdic").setVisible(true);
            }

            //Tab Equipamiento
            if (this.buscarValorFijo(textValidaciones.EVEVISTABEQUIP, this._tipoEvento)) {
                if (this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                    this.getView().byId("idEquipamiento").setVisible(true);
                }
            }

            //Tab Horometro        
            if (this.buscarValorFijo(textValidaciones.EVEVISTABHOROM, this._tipoEvento)
                && this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                this.getView().byId("idHorometro").setVisible(true);
            }

            //Tab Pesca Declarada
            if (this.buscarValorFijo(textValidaciones.EVEVISTABPEDCL, this._tipoEvento)) {
                this.getView().byId("idPescaDecl").setVisible(true);
                //wdContext.currentVisibleElement().setBtnRowPescaDeclarada(WDVisibility.VISIBLE); -->ELEMENTO NO ENCONTRADO A UTILIZAR

                if (this._motivoMarea == "1") {
                    this.getView().byId("clm_moda_pescDecl").setVisible(true);
                }
            }

            //Tab Pesca Biometria
            if (this.buscarValorFijo(textValidaciones.EVEVISTABBIOME, this._tipoEvento)) {
                if (this._indicadorPropXPlanta != textValidaciones.INDIC_PROPIEDAD_TERCEROS) {
                    this.getView().byId("idBiometria").setVisible(true);
                }

            }

            //Tab Pesca Descargada
            if (this.buscarValorFijo(textValidaciones.EVEVISTABPEDSC, this._tipoEvento)) {
                this.getView().byId("idPescaDesc").setVisible(true);
                this.getView().byId("ext_pesc_desc").setVisible(true);

                if (this._indicadorPropXPlanta == textValidaciones.INDIC_PROPIEDAD_TERCEROS) { //Descarga en planta tercera
                    this.getView().byId("table_pesc_desc_especie").setVisible(true);
                } else if (this._indicadorPropXPlanta == textValidaciones.INDIC_PROPIEDAD_PROPIOS) { //Descarga en planta propia
                    if (this._motivoMarea == "1") {
                        this.getView().byId("table_pesc_desc_CHD").setVisible(true);
                    } else {
                        this.getView().byId("table_pesc_desc_ticket").setVisible(true);
                    }

                    if (nuevoEvento) {
                        this.getView().byId("pdt_col_BuscarDesc").setVisible(true);
                        this.getView().byId("pdCHD_col_BuscarDesc").setVisible(true);
                    }
                }

                if (!nuevoEvento) {
                    this.getView().byId("pdt_col_EliminarDesc").setVisible(false);
                    this.getView().byId("pde_col_EliminarDesc").setVisible(false);
                    this.getView().byId("pdCHD_col_EliminarDesc").setVisible(false);
                    //wdContext.currentReadOnlyElement().setFechProdDesc(true);  ---> este dato se relacionara cuando se carga la data de la tabla de pesca descargada
                }
            }

            //Tab Distribucion
            if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA && this._motivoMarea == "1") {
                this.getView().byId("FechaEnvaseIni").setVisible(true);
                this.getView().byId("col_porc_pesc_desc").setVisible(true);
                this.getView().byId("ext_pesca_declarada").setVisible(true);

                //wdContext.currentReadOnlyElement().setCantPescDeclarada(true); ---> este dato se relacionara cuando se carga la data de la tabla de pesca declarada en en tab pesca declarada
                this.getView().byId("idDistribucion").setVisible(true);
            }

            //Tab Siniestro
            if (this._tipoEvento == textValidaciones.TIPOEVENTOSINIESTRO) {
                this.getView().byId("FechaEnvaseIni").setVisible(true);
                this.getView().byId("idSiniestro").setVisible(true);
                this.getView().byId("ext_siniestro").setVisible(true);
            }

            //Tab Accidente
            if (this._tipoEvento == textValidaciones.TIPOEVENTOACCIDENTE) {
                this.getView().byId("FechaEnvaseIni").setVisible(true);
                this.getView().byId("idAccidente").setVisible(true);
            }

            if ((!nuevoEvento && (this._elementAct < (this._listaEventos.length - 1)))
                || this._soloLectura || (this._FormMarea.EstMarea == "C" && this._FormMarea.EstCierre != "")) {

                //wdThis.prepararVistaRevision();

                if (this._soloLectura) {
                    this.getView().byId("pdt_col_BuscarDesc").setVisible(false);
                    this.getView().byId("pdCHD_col_BuscarDesc").setVisible(false);

                    this.getView().byId("pdt_col_EliminarDesc").setVisible(false);
                    this.getView().byId("pde_col_EliminarDesc").setVisible(false);
                    this.getView().byId("pdCHD_col_EliminarDesc").setVisible(false);

                    this.getView().byId("ext_siniestro").setVisible(false);
                    //wdContext.currentReadOnlyElement().setFechProdDesc(true);---> este dato se relacionara cuando se carga la data de la tabla de pesca descargada
                }
            }

            if (!this._soloLectura) {
                //Datos de operacion
                if (this._indicadorProp == textValidaciones.INDIC_PROPIEDAD_PROPIOS) {
                    this.getView().byId("i_stockCombustible").setEnabled(true);
                }

                //Tab Distribucion
                if (this._tipoEvento == textValidaciones.TIPOEVENTOCALA && this._motivoMarea == "1") {
                    this.getView().byId("FechaEnvaseIni").setVisible(true);
                    //wdContext.currentReadOnlyElement().setCantPescaBodega(false); --> se setea en la tabla del tab de distribucion
                }
            }

            if (this._mareaReabierta) {

                var fechHoraAct = new Date();
                var fecCierre = this._FormMarea.FecCierre;
                var horCierre = this._FormMarea.HorCierre;

                var fechHoraIni = new Date(fecCierre + " " + horCierre);
                var hour24 = 24 * 3600 * 1000;
                var miliFecHoraAct = fechHoraAct.getTime();
                var miliFechHoraIni = fechHoraIni.getTime();
                var miliDuracion = Number(miliFechHoraIni) + Number(hour24);

                if (this._IsRolRadOpe) {
                    if (miliDuracion <= miliFecHoraAct) {
                        this.getView().byId("i_stockCombustible").setEnabled(false);
                        for (var j = 0; j < this._listaHorometros.length; j++) {

                            //nodeHorometros.currentHorometrosElement().setReadOnly(true); --> seteo por cada elemento de la tabla de horometro
                        }
                    }

                }

                if (this._IsRolIngComb) {
                    // formCust.wdGetContext().currentReadOnlyElement().setObservacion(true);
                    // formCust.wdGetContext().currentReadOnlyElement().setFecHoraArribo(true);
                    // formCust.wdGetContext().currentReadOnlyElement().setEstMarea(true);  --- > viene por parte de alejandro mapear en su componente

                    this.getView().byId("ip_sistema_frio").setEnabled(false);
                    this.getView().byId("ip_observacion").setEnabled(false);
                    //wdContext.currentReadOnlyElement().setAveriado(true); --> al momento de cargar la tabla en el tab de horometros
                    //wdContext.currentReadOnlyElement().setCantEquipamiento(true); --> al momento de cargar la tabla en el tab de equipamiento
                    this.getView().byId("ip_muestra").setEnabled(false);
                    //wdContext.currentReadOnlyElement().setCantPescaBodega(true); --> se cargara la tabla en el tab de distribucion
                    //wdContext.currentReadOnlyElement().setCantPescDescargada(true); --> se carga la tabla en el tab pesca descargada
                    //wdContext.currentReadOnlyElement().setCantPescDeclDesc(true); --> se carga la tabla en el tab pesca descargada
                }
            }


        },
        obtenerHorometros: function (nuevoEvento) {

        }
        
    });
});