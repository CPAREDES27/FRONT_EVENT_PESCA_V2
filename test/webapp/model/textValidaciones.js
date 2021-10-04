sap.ui.define([], function () {
	"use strict";
	var productItems =
		{
			INDIC_PROPIEDAD_PROPIOS: "P",
			INDIC_PROPIEDAD_TERCEROS: "T",
			TIPOEVENTOCALA: "3",
			TIPOEVENTODESCARGA: "6",
			TIPOEVENTOSINIESTRO: "8",
			TIPOEVENTOACCIDENTE: "9",
			TIPOEVENTOZARPE: "1",
			TIPOEVENTOLLEGADAZONA: "2",
			TIPOEVENTOESPERA: "7",
			TIPOEVENTOARRIBOPUE: "5",
			TIPOEVENTOSALIDAZONA: "4",
			TIPOEVENTOHOROMETRO: "H",
			TIPOEVENTOTRASVASE: "T",
			MOTIVOPESCADES : [
				{id : "1"},
				{id : "2"}
			],
			EVEVISTABHOROM : [
				{id : "1"},
				{id : "5"},
				{id : "6"},
				{id : "H"},
				{id : "T"}
			],
			EVEVISTABEQUIP : [
				{id : "1"},
				{id : "5"}
			],
			EVEVISTABPEDCL : [
				{id : "3"}
			],
			EVEVISTABPEDSC : [
				{id : "6"}
			],
			EVEVISTABBIOME : [
				{id : "3"}
			],
			EVEVISUEMPRESA : [
				{id : "5"},
				{id : "6"}
			],
			EVEVISZONPESCA : [
				{id : "2"},
				{id : "3"},
				{id : "4"},
				{id : "8"}
			],
			EVEVISFECHABIO : [
				{id : "3"}
			],
			EVEVISFECHAFIN : [
				{id : "3"},
				{id : "6"},
				{id : "7"}
			],
			EVEVISESTAOPER : [
				{id : "1"},
				{id : "5"},
				{id : "6"},
				{id : "2"},
				{id : "4"}
			],
			READONLYZONPES : [
				{id : "3"},
				{id : "4"}
			]
		}

	return productItems;
});