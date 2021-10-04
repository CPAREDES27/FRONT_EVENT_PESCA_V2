/*global QUnit*/

sap.ui.define([
	"comtasa./test/controller/DetalleEventos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DetalleEventos Controller");

	QUnit.test("I should test the DetalleEventos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
