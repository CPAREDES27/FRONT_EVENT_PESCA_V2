sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/m/MessageBox",
], function (
    ManagedObject,
    JSONModel,
    MessageToast,
    integrationLibrary,
    MessageBox
) {
    "use strict";

    return ManagedObject.extend("com.tasa.test.controller.Horometro", {

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


        validarLecturaHorometros: function(){
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var bOk = true;
            var eventoActual = {}; //nodo evento actual
            var horometroActual = eventoActual.Horometros; // nodo horometros de evento actual
            for (let index = 0; index < horometroActual.length; index++) {
                const element = horometroActual[index];
                if(element.lectura < 0){
                    //Mostrar mensajes
                    var mssg = this.oBundle.getText("LECTHOROMAYORCERO", [element.Lectura]);
                    MessageBox.error(mssg)
                    bOk = false;
                }
                
            }
            return bOk;
        },

        calcularCantTotalBodegaEve: function(){
            var eventoActual = {}; //nodo evento actual
            var bodegas = eventoActual.Bodegas; //bodegas
            var cantTotal = 0;
            for (let index = 0; index < bodegas.length; index++) {
                const element = bodegas[index];
                var cantPesca = element.CantPesca;
                if(cantPesca){
                    cantTotal += cantPesca;
                }
            }
            eventoActual.CantTotalPescDecla = cantTotal;
            //refrescar modelo
        },

        mostrarEnlaces: function(){
            var ListaEventos = [];
            var eventoActual = {}; //nodo evento actual
            var indEvento = eventoActual.Indicador;

            var visible = {};//nodo visible
            visible.Links = true;
            visible.LinkRemover = false;
            visible.LinkDescartar = false;

            if(indEvento == "N" && eventoActual == ListaEventos[ListaEventos - 1]){
                visible.LinkRemover = true;
            }else{
                visible.LinkDescartar = true;
            }
            //refresh model
        },

        validarSiniestros: function(){
            var bOk = true;
            var eventoActual = {};
            var numeroSiniestros = eventoActual.Siniestros.length;
            if(numeroSiniestros < 1){
                bOk = false;
                var mssg = this.oBundle.getText("NOEXISINIESTROS");
                MessageBox.error(mssg)
            }
            return bOk;
        },

        validarMuestra: function(){
            var bOk = true;
            var eventoActual = {};
            var muestra = eventoActual.Muestra;
            if(muestra < 1){
                var mssg = this.oBundle.getText("MUESDEBMAYORCERO");
                MessageBox.error(mssg);
                bOk = false;
            }
            return bOk;
        },

        onActionVerMotiLimitacion: function(){
            var eventoActual = {};
            var estOper = eventoActual.EstaOperacion;
            var visible = {};//nodo visible
            eventoActual.MotiLimitacion = null;
            if (estOper.equalsIgnoreCase("L")) {
                eventoActual.MotiLimitacion = null;
                visible.MotiLimitacion = true;
            } else {
                visible.MotiLimitacion = false;
            }
            //refresh model
        },

        crearEventoEspera: function(){
            this.getDialogEventoEspera().open();

        },

        getDialogEventoEspera: function () {
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment("com.tasa.test.fragments.CrearEventoEspera", this);
                this.getView().addDependent(this.oDialog);
            }
            return this.oDialog;
        },

        onActionRemoverEvento: function(){
            var ListaEventos = [];
            var eventoActual = {};
            var newArray = this.farrayRemove(ListaEventos, eventoActual);
            ListaEventos = newArray;
            //refresh model
            if(ListaEventos.length < 1){
                history.go(-1);
            }
        },

        farrayRemove: function(arr, value) { 
    
            return arr.filter(function(ele){ 
                return ele != value; 
            });
        },

        onActionDescartarCambios: function(){
            //metodo backmanage
            history.go(-1);
        },

        
        onActionVerificarAveria: function(horometro){
            var averiado = horometro.Averiado;
            if(averiado){
                horometro.Lectura = 0;
                horometro.ReadOnly = true;
            }else{
                horometro.ReadOnly = false;
            }
            //refresh model
        }
        
        
        
















    });
});