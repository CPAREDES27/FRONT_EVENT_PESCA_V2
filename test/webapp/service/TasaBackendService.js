sap.ui.define([
    "./CoreService",
    "./UtilService"
], function(
    CoreService,
    UtilService
) {
	"use strict";

    var TasaBackend = CoreService.extend("com.tasa.test.service.TasaBackendService", {

        obtenerTipoEmbarcacion: function(sUsuario){
            var uri = UtilService.getHostService() + "/api/embarcacion/listaTipoEmbarcacion";
            var arg = {
				usuario: sUsuario
			};
            return this.http(uri).get(null, arg).then(function(response){
                var data = JSON.parse(response);
                var sData = JSON.parse(data);
                return sData;
            });
        },

        obtenerPlantas: function(sUsuario){
            var uri = UtilService.getHostService() + "/api/embarcacion/listaPlantas";
            var arg = {
				usuario: sUsuario
			};
            return this.http(uri).get(null, arg).then(function(response){
                var data = JSON.parse(response);
                var sData = JSON.parse(data);
                return sData;
            });
        },

        cargarListaMareas: function(sUsuario){
            var uri = UtilService.getHostService() + "/api/embarcacion/ObtenerFlota";
            var arg = {
				usuario: sUsuario
			};
            var me = this;
            return this.http(uri).get(null, arg).then(function(response){
                var data = JSON.parse(response);
                var sData = JSON.parse(data);
                var str_di = sData.str_di;
                var uri1 = UtilService.getHostService() + "/api/dominios/Listar";
                var sBody = UtilService.getBodyDominio();
                sBody.dominios[0].domname = "ZDO_ZCDMMA";
                return me.http(uri1).post(null, sBody).then(function(sResponse){
                    var sData1 = JSON.parse(sResponse);
                    var sData2 = sData1.data[0].data;
                    console.log("Dominios: ", sData1);
                    for (let index = 0; index < str_di.length; index++) {
                        const element = str_di[index];
                        var descMotMar = "";

                        //validar descripcion motivo marea
                        for (let index1 = 0; index1 < sData2.length; index1++) {
                            const element1 = sData2[index1];
                            if (element1.id == element.CDMMA) {
                                descMotMar = element1.descripcion;
                                break;
                            }
                        }
                        
                        element.DESCMOTMAR = descMotMar;
                    }
                    return sData;
                });
            });
        },

        obtenerDetalleMarea: function(marea, sUsuario){
            var uri = UtilService.getHostService() + "/api/embarcacion/consultaMarea/";
            var sBody = UtilService.getBodyDetalleMarea();
            sBody.p_marea = marea;
            sBody.user = sUsuario;
            return this.http(uri).post(null, sBody).then(function(response){
                var data = JSON.parse(response);
                return data;
            });
        },

        obtenerDominio: function(dominio){
            var uri = UtilService.getHostService() + "/api/dominios/Listar";
            var sBody = UtilService.getBodyDominio();
            sBody.dominios[0].domname = dominio;
            return this.http(uri).post(null, sBody).then(function(response){
                var data = JSON.parse(response);
                return data;
            });
        },

        obtenerDepartamentos: function(sUsuario){
            var uri = UtilService.getHostService() + "/api/General/Read_Table/";
            var sBody = UtilService.getBodyReadTable();
            sBody.delimitador = "|";
            sBody.fields.push("BLAND");
            sBody.fields.push("BEZEI");
            sBody.option[0].wa = "SPRAS EQ 'ES' AND LAND1 EQ 'PE'";
            sBody.p_user = sUsuario;
            sBody.tabla = "T005U";
            return this.http(uri).post(null, sBody).then(function(response){
                var data = JSON.parse(response);
                return data;
            });
        },

        validarBodegaCert: function(embarcacion, planta){
            var uri = UtilService.getHostService() + "/api/embarcacion/ValidarBodegaCert/";
            var sBody = UtilService.getBodyValidaCert();
            sBody.codEmba = embarcacion;
            sBody.codPlanta = planta;
            return this.http(uri).post(null, sBody).then(function(response){
                var data = JSON.parse(response);
                return data;
            });
        },

        validarMareaProd: function(embarcacion, planta){
            var uri = UtilService.getHostService() + "/api/embarcacion/ValidarMarea/";
            var sBody = UtilService.getValidaMarea();
            sBody.p_codemb = embarcacion;
            sBody.p_codpta = planta;
            return this.http(uri).post(null, sBody).then(function(response){
                var data = JSON.parse(response);
                return data;
            });
        },

        obtenerDatosDstrFlota: function(embarcacion, sUsuario){
            var me = this;
            var uri = UtilService.getHostService() + "/api/General/Read_Table/";
            var sBody = UtilService.getBodyReadTable();
            sBody.delimitador = "|";
            sBody.fields = ["CDPTA", "DESCR", "CDPTO", "DSPTO", "LTGEO", "LNGEO", "FEARR", "HEARR", "EMPLA", "WKSPT", "CDUPT", "MANDT"];;
            sBody.option[0].wa = "CDEMB LIKE '" + embarcacion + "'";
            sBody.p_user = sUsuario;
            sBody.tabla = "ZV_FLDF";
            return this.http(uri).post(null, sBody).then(function(response){
                var data = JSON.parse(response);
                var empla = data.data[0].EMPLA;
                var sUri = UtilService.getHostService() + "/api/General/Read_Table/";
                sBody.fields = ["DSEMP", "INPRP", "MANDT"];
                sBody.option[0].wa = "CDEMP LIKE '" + empla + "'";
                sBody.tabla = "ZV_FLMP";
                return me.http(sUri).post(null, sBody).then(function(sResponse){
                    var sData = JSON.parse(sResponse);
                    var objReturn = {
                        CDPTA: data.data[0].CDPTA,
                        DESCR: data.data[0].DESCR,
                        CDPTO: data.data[0].CDPTO,
                        DSPTO: data.data[0].DSPTO,
                        LTGEO: data.data[0].LTGEO,
                        LNGEO: data.data[0].LNGEO,
                        FEARR: data.data[0].FEARR,
                        HEARR: data.data[0].HEARR,
                        EMPLA: data.data[0].EMPLA,
                        WKSPT: data.data[0].WKSPT,
                        CDUPT: data.data[0].CDUPT,
                        DSEMP: sData.data[0].DSEMP,
                        INPRP: sData.data[0].INPRP,
                    }
                    return objReturn;
                });
            });
        },

        obtenerMareaAnterior: function(marea, embarcacion, sUsuario){
            var me = this;
            var uri = UtilService.getHostService() + "/api/General/Read_Table/";
            var sBody = UtilService.getBodyReadTable();
            sBody.delimitador = "|";
            sBody.fields = ["NRMAR", "ESMAR", "CDMMA", "FEMAR", "HAMAR", "FXMAR", "HXMAR", "FIMAR", "HIMAR", "FFMAR", "HFMAR", "ESCMA", "MANDT"];
            sBody.option[0].wa = marea ? "NRMAR < " + marea + " AND CDEMB LIKE '" + embarcacion + "'" : "CDEMB LIKE '" + embarcacion + "'"  ;
            sBody.order = "NRMAR DESCENDING";
            sBody.tabla = "ZFLMAR";
            sBody.p_user = sUsuario;
            return this.http(uri).post(null, sBody).then(function(response){
                return response;
            });
        },

        obtenerNroReserva: function(nrmar, sUsuario){
            var uri = UtilService.getHostService() + "/api/General/Read_Table/";
            var sBody = UtilService.getBodyReadTable();
            sBody.delimitador = "|";
            sBody.fields = ["NRRSV"];
            sBody.option[0].wa = "NRMAR = " + nrmar + " AND ESRSV EQ 'S'";
            sBody.tabla = "ZFLRSC";
            sBody.p_user = sUsuario;
            return this.http(uri).post(null, sBody).then(function(response){
                return response;
            });


        },
        obtenerCodigoTipoPreservacion: function(cdemb){
            var uri = UtilService.getHostService() + "/api/General/Read_Table/";
            var sBody = UtilService.getBodyReadTable();
            sBody.delimitador = "|";
            sBody.fields = ["CDTPR"];
            sBody.option[0].wa = "CDEMB = '" + cdemb + "'";
            sBody.tabla = "ZFLEMB";
            return this.http(uri).post(null, sBody).then(function(response){
                return response;
            });


        }

    });

    return new TasaBackend();
});