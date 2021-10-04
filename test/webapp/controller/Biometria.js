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

	return ManagedObject.extend("com.tasa.test.controller.Biometria", {

        constructor: function(oView,sFragName,idBiometria) {

            this._oView = oView;
            this._oControl = sap.ui.xmlfragment(oView.getId(), "com.tasa.test.fragments."+ sFragName,this);
            this._bInit = false;
            this._navBio = idBiometria;
            console.log("TextoNav : " + idBiometria)

            this.getTableDefault();


        },
        onButtonPress3:function(o_event){
            console.log(o_event);
            console.log("TextoNav2 : " + this._navBio)
            var i_tme =  this._oView.byId("idTallaMenor").getValue();
            var i_tma =  this._oView.byId("idTallaMayor").getValue();
            let v_rest = i_tma - i_tme;
            let v_sumMen = Number('0');
            let v_tallamAyorA = Number(i_tme) + Number((2*v_rest));
            this._oView.byId("table_biometria").destroyColumns();

            this.setColumnDinamic("CodEspecie","");
            this.setColumnDinamic("Especie","");

            var d1 = Number(i_tme);
            var d2 = Number(v_tallamAyorA);
            
            if(v_rest > 0){
                for (var i=d1; i<= v_tallamAyorA; i++){

                    if(i==d1){v_sumMen = Number(d1);}
                    else{v_sumMen = Number(v_sumMen) + Number('0.5');}

                    console.log("ddd : " + v_sumMen);
                    let idCol = "col_" + i;
                    this.setColumnDinamic(v_sumMen,idCol);
                }
            }

            this.setColumnDinamic("Moda","");
            this.setColumnDinamic("Muestra","");
            this.setColumnDinamic("Porc. Juveniles","");

        },

        getTableDefault:function(){

            this.setColumnDinamic("CodEspecie","");
            this.setColumnDinamic("Especie","");
            this.setColumnDinamic("Moda","");
            this.setColumnDinamic("Muestra","");
            this.setColumnDinamic("Porc. Juveniles","");

        },
        setColumnDinamic:function(textCol,idCol){
            if(idCol != ""){
                this._oView.byId("table_biometria").addColumn( new sap.ui.table.Column(idCol,{
                    label: new sap.m.Label({
                        text: textCol 
                    }),
                    template : new sap.m.Text({
                        text: textCol 
                    })
                }));
            }
            else{
                this._oView.byId("table_biometria").addColumn( new sap.ui.table.Column({
                    label: new sap.m.Label({
                        text: textCol 
                    }),
                    template : new sap.m.Text({
                        text: textCol 
                    }),
                    width : '10rem'
                }));
            }
        },

        getcontrol:function(){
            return this._oControl;
        }
	});
});