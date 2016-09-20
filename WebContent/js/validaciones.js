/*
 * Para poder realizar las validaciones tenemos que tener en cuenta un par de cosas:
 * 
 * 1- Los input que sean requeridos les añadiremos la clase required en el HTML
 * **********************************************************************************************************************************
 * 
 * 2- Las funciones a las que habrá que llamar en el html para realizar la validación son estas:
 * 		onKeypress = "comprobarCampo(this.id)"
 * 		onblur="comprobarCampo(this.id)"
 * Esto habrá que ponerlo en los input que lleven type="text":
 * <input type="text" onblur="comprobarCampo(this.id)" onKeypress = "comprobarCampo(this.id)" />
 * ***********************************************************************************************************************************
 * 
 * 3- Hay varios tipos de campos, los hemos administrado de la siguiente forma:
 * 		
 * 		Email --> Añadiendo la clase email al input realizará las validaciones de los emails.
 * 		
 * 		Fecha --> Añadiendo la clase fecha al input realizará las validaciones de las fechas.
 *			>>Para el caso de las fechas no es necesario introducir el evento onKeyPress, se pone de forma dinámica el evento onKeyup.
 *				Sin embargo es necesario añadir el evento onFocus.
 *				También es necesario añadir el evento onBlur pasandole la función validarFormatoFecha(this.id, this.value)
 *			<input type="text" id="fecha" class="fecha" onFocus="focusCampo(this.id)" onblur="validarFormatoFecha(this.id, this.value)"  />
 * 		
 * 		Números --> añadiendo la clase numero al input realizará las validaciones de los input en los que sólo puede haber números.
 * 		Importes --> añadiendo la clase importe al input realizará las validaciones de los importes.
 * 			>>Para el caso de los números y el importe, es necesario introducir el evento onFocus="focusCampo(this.id)"
 * <input type="text" id="numero" class="numero" onFocus="focusCampo(this.id)" onKeypress="comprobarCampo(this.id)" onblur="comprobarCampo(this.id)" />
 * 
 * 		Documentos --> Añadiendo la clase documento al input realizará la comprobación de si se ha insertado un DNI o un CIF correcto
 * ****************************************************************************************************************************************************
 * 
 * 4- Otros tipos de campos son los Checkbox y los radiobutton. Para realizar la validación de estos, es necesario realizar lo siguiente:
 * 		
 * 		>> Checkbox:
 * 		*Crear un div principal en el que debe de ir todo el contenido del checkbox, al cual debemos de pasarle la clase checkbox.
 * 		*Al igual que el resto de elementos, si queremos que sea requerido, le pondremos también la clase required
 * 			<div class="checkbox required col-md-12"></div>
 * 		*Dentro de este div insertaremos todas las opciones de nuestro checkbox. Lo haremos de la siguiente manera:
 * 			<label> 
 * 				<input type="checkbox" value="Si" class="check">
 *				SI
 *			</label>
 *		*Muy importante!!! poner la clase check a cada uno de los checkbox
 *
 *		>> Radio:
 * 		*Crear un div principal en el que debe de ir todo el contenido de los radiobutton, al cual debemos de pasarle la clase radio.
 * 		*Al igual que el resto de elementos, si queremos que sea requerido, le pondremos también la clase required
 * 			<div class="radio required col-md-12"></div>
 * 		*Dentro de este div insertaremos todas las opciones de nuestro radioButton. Lo haremos de la siguiente manera:
 * 			<label> 
 * 				<input type="radio" name="color" value="Rojo" class="radioButton">
 *				Rojo
 *			</label>
 *		*Muy importante!!! poner la clase radioButton a cada uno de los checkbox
 *		*Muy importante!!! poner el mismo name a todos los radioButton que sean del mismo tipo con los que queramos montar un grupo.
 *		 Por ejemplo, si tenemos un grupo de radios de colores a todos les ponemos el name color.
 * *********************************************************************************************************************************
 * 
 * 5- El último campo que se va a validar es el de select. Para validar este campo es necesario realizar la estructura de un select.
 * 	  Se añadirá la clase required en el select como siempre, y la clase select. También se puede añadir la clase chosen-select en caso
 * 	  queramos utilizar el plugin Chosen Select de Jquery.
 * 
 * 	  En los option se puede poner una primera opción para que fuerce al usuario a elegir una opción, es decir que no aparezca seleccionada
 * 	  una opción válida desde el principio. Para ello al crear el option le ponemos value="null" y le añadimos la clase selected hidden.
 * 	  Esto hará que aparezca esta opción seleccionada al principio, pero que sea necesario realizar el cambio de opción para poder continuar
 * 
 * 	  Nos quedaría una estructura parecida a esta:
 * 	  	<select class="form-control select required chosen-select" id="select">
 *			<option value="null" selected hidden>Selecciona una opcion...</option>
 *			<option label="opcion1" value="opcion1">opcion1</option>
 *			<option label="opcion2" value="opcion2">opcion2</option>
 *		</select>
 * ***********************************************************************************************************************************
 * 
 * 6- Por último, si se quiere añadir un mensaje de alerta que aparezca cuando se ha realizado la validación de todos los campos.
 * 	  Creamos en el código HTML los siguientes contenedores:
 * 
 * 		<div class="alert alert-success hide" role="alert">
			<button type="button" class="close" data-dismiss="alert"
				aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<div class="msgSuccess"></div>
		</div>
		<div class="alert alert-warning hide" role="alert">
			<button type="button" class="close" data-dismiss="alert"
				aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<div class="msgError"></div>
		</div>
		
		después en la función de comprobarObligatorios() rellenamos las siguientes variables:
			alerta ( true | false )
			msgError (Mensaje que aparecerá cuando haya errores en el formulario)
			msgSuccess (Mensaje que aparecerá cuando el formulario esté correctamente relleno)
 * ***********************************************************************************************************************************
 * */



/* Validación para comprobar que los campos obligatorios están rellenados correctamente al pulsar sobre el botón de enviar o guardar*/

$( document ).ready(function() {
	$(".chosen-select").chosen();
	$('.chosen-container-single .chosen-single div b').addClass(
	'glyphicon glyphicon-chevron-down');
	$('.glyphicon-chevron-down').css("padding-top", "5px");
});

function comprobarObligatorios() {

	var valida, texto, progreso, alerta, msgError, msgSuccess;
	valida = true;
	progreso = 0;
	/* Admite los valores true | false */
	alerta = true;
	msgError = "Hay algunos errores en el formulario, por favor corrígelos para continuar";
	msgSuccess = "Se han guardado los cambios con éxito";


	$(".checkbox.required").each(function() {
		/* Si no hay ningun checkbox seleccionado mostrará error */
		if($(this).find(".check:checkbox:checked").length===0) {
			$(this).removeClass('has-successCheck');
			$(this).addClass('has-errorCheck');
			valida = false;
			progreso = progreso + 1
		}
		/* Si hay alguno relleno, no debe de mostrar error */
		else {
			$(this).removeClass('has-errorCheck');
			$(this).addClass('has-successCheck');
			valida = true;
		}
	});

	$(".radio.required").each(function() {
		/* Si no hay ningun radio seleccionado mostrará error */
		if($(this).find(".radioButton:radio:checked").length===0) {
			$(this).removeClass('has-successCheck');
			$(this).addClass('has-errorCheck');
			valida = false;
			progreso = progreso + 1
		}
		/* Si hay alguno relleno, no debe de mostrar error */
		else {
			$(this).removeClass('has-errorCheck');
			$(this).addClass('has-successCheck');
			valida = true;
		}
		return valida
	});

	/* Vamos comprobando en cada campo que tenga la clase required si está relleno o no*/
	$(".required:input").each(function() {
		texto = $(this).val();
		/* Si no está relleno le pondremos la clase has-error */
		if( (texto === "") || (texto === "null") ){
			$(this).addClass("has-error");
			$(this).removeClass("has-success");
			$(this).siblings('.chosen-container-single').find('.chosen-single').css({
				'border' : '1px solid #A1302E',
				'border-color' : '#A1302E',
				'background-color' : '#F2DEDE'
			})
			valida = false;
			valida = progreso + 1
		} 
		/* Si está relleno le quitamos la clase de has-error */
		else {
			$(this).removeClass("has-error");
			$(this).addClass("has-success");
			$(this).siblings('.chosen-container-single').find('.chosen-single').css({
				'border' : '1px solid #92e485',
				'border-color' : '#92e485',
				'background-color' : '#f8fff7'
			})
			valida = true;
		}
		/* Comprobamos si el campo es un email*/
		if( ($(this).hasClass('email')) && (!comprobarEmail($(this).attr('id'), $(this).val())) ) {
			/* Le pasamos el campo y el valor del campo para comprobar si es un email */
			valida=false;
			progreso = progreso + 1
		}
		if(($(this).hasClass('fecha')) && (!validarFormatoFecha($(this).attr('id'), $(this).val())) ) {
			valida=false;
			progreso = progreso + 1
		}
		if(($(this).hasClass('documento')) && (!comprobarDocumento($(this).attr('id'), $(this).val()))) {
			valida=false;
			progreso = progreso + 1
		}
		
	});
	
	if( progreso === 0) {

		if(alerta === true) {
			$('.alert-warning').addClass('hide');
			$('.alert-success').removeClass('hide');
			$('.msgSuccess').html(msgSuccess);
			$('.msgError').html(msgError);
			
		} else {
			alert('Se ha aprobado correctamente la solicitud');
		}
	} else {

		if(alerta === true) {
			$('.alert-success').addClass('hide');
			$('.alert-warning').removeClass('hide');
			$('.msgSuccess').html(msgSuccess);
			$('.msgError').html(msgError);
		} else {
			alert('Hay algunos errores en el formulario, rellena los campos correctamente');
		}
		progreso = 0
	}
	return valida;
}

/* Validación para comprobar que los campos obligatorios están formateados correctamente al ir rellenándolos */

function comprobarCampo(campo) {
	var valida = false
	if( ($('#'+campo).val()!=="") && ($('#'+campo).hasClass('required')) ) {
		$('#'+campo).removeClass("has-error");
    	$('#'+campo).addClass("has-success");
	} else {
		$('#'+campo).removeClass("has-success");
    	$('#'+campo).addClass("has-error");
	}
	/* Comprobamos si el campo es un email*/
	if($('#'+campo).hasClass('email')) {
		/* Le pasamos el campo y el valor del campo para comprobar si es un email */
		comprobarEmail(campo, $('#'+campo).val());
	}
	/* Comprobamos si el campo es una numero, y validamos su escritura*/
	if($('#'+campo).hasClass('numero')) {
		return comprobarNumero(event);
	}
	/* Comprobamos si el campo es un importe, y validamos su escritura*/
	if($('#'+campo).hasClass('importe')) {
		return comprobarImporte(event);
	}
	/* Comprobamos si el campo es una fecha*/
	if($('#'+campo).hasClass('fecha')) {
		/* Tenemos que pasarle el valor del input de la fecha */
		comprobarFecha($('#'+campo).val())
	}
	/* Comprobamos si el campo es un documento correcto*/
	if($('#'+campo).hasClass('documento')) {
		/* Tenemos que pasarle el valor del input de la fecha */
		comprobarDocumento(campo, $('#'+campo).val());
	}
}

/* Función para comprobar que se está escribiendo un email */
function comprobarEmail(campo, valor) {
    var valida
    /* Comprobamos la expresión de validación del email */
	var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(valor) ) {
    	/* En caso de que la validación NO sea correcta */
    	$('#'+campo).removeClass("has-success");
    	$('#'+campo).addClass("has-error");
    	valida = false
    } else {
    	/* En caso de que la validación SI sea correcta */
    	$('#'+campo).removeClass("has-error");
    	$('#'+campo).addClass("has-success");
    	valida = true
    }
    return valida;
}

/* Función para comprobar que se está escribiendo un número */
function comprobarNumero(e) {
	tecla = (document.all) ? e.keyCode : e.which;
	// Tecla de retroceso para borrar, siempre la permite
	if (tecla === 8) {
		return true;
	}
	if (tecla === 0) {
		return true;
	}

	// Patron de entrada, en este caso solo acepta numeros
	patron = /[0-9]/;
	tecla_final = String.fromCharCode(tecla);
	return patron.test(tecla_final);
}

/* Función para comprobar que se está escribiendo un importe */
function comprobarImporte(e) {
	tecla = (document.all) ? e.keyCode : e.which;

	// Tecla de retroceso para borrar, siempre la permite
	if (tecla === 8) {
		return true;
	}
	// Tecla de punto para introducir decimales
	if (tecla === 46) {
		return true;
	}
	if (tecla === 0) {
		return true;
	}

	// Patron de entrada, en este caso solo acepta numeros
	patron = /[0-9]/;
	tecla_final = String.fromCharCode(tecla);

	return patron.test(tecla_final);
}

function validarFormatoFecha(campo, fecha){
	
	var RegExPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if ((fecha.match(RegExPattern))) {
    	$('#'+campo).removeClass('has-error');
    	$('#'+campo).addClass('has-success');
    	return true;
    } else {
    	$('#'+campo).removeClass('has-success');
    	$('#'+campo).addClass('has-error');
    	return false;
    }
}

/* Función para comprobar que se está escribiendo una fecha */
function comprobarFechaInsertada(valor) {
    var log = valor.length;
    var sw = "S";
    for (var x = 0; x < log; x++) {
        var v1 = valor.substr(x, 1);
        var v2 = parseInt(v1);
        // Compruebo si es un valor numérico
        if (isNaN(v2)) {
            sw = "N";
        }
    }
    return (sw === "S");
}

var primerslap = false;
var segundoslap = false;

/* Formatear una fecha según se va escribiendo */
function comprobarFecha(fecha) {
	var long = fecha.length;
	var dia;
	var mes;
	var ano;
	var valida

	/* Comprobamos la longitud de los datos que estamos introduciendo */
	if ((long >= 2) && (primerslap === false)) {
		/* Comprobamos que el día que estamos introduciendo es un día correcto */
		dia = fecha.substr(0, 2);
		if ((comprobarFechaInsertada(dia) === true) && (dia <= 31)
				&& (dia !== "00")) {
			fecha = fecha.substr(0, 2) + "/" + fecha.substr(3, 7);
			primerslap = true;
		} else {
			fecha = "";
			primerslap = false;
		}
	} else {
		dia = fecha.substr(0, 1);
		if (comprobarFechaInsertada(dia) === false) {
			fecha = "";
		}
		if ((long <= 2) && (primerslap === true)) {
			fecha = fecha.substr(0, 1);
			primerslap = false;
		}
	}
	/* Comprobamos que el mes que estamos introduciendo es un mes correcto */
	if ((long >= 5) && (segundoslap === false)) {
		mes = fecha.substr(3, 2);
		if ((comprobarFechaInsertada(mes) === true) && (mes <= 12)
				&& (mes !== "00")) {
			fecha = fecha.substr(0, 5) + "/" + fecha.substr(6, 4);
			segundoslap = true;
		} else {
			fecha = fecha.substr(0, 3);
			;
			segundoslap = false;
		}
	} else {
		if ((long <= 5) && (segundoslap = true)) {
			fecha = fecha.substr(0, 4);
			segundoslap = false;
		}
	}
	/* Comprobamos que el año que estamos introduciendo es un año correcto.
	 * Los años que se pueden introducir son desde el 1900 hasta el 2100 */
	if (long >= 7) {
		ano = fecha.substr(6, 4);
		if (comprobarFechaInsertada(ano) === false) {
			fecha = fecha.substr(0, 6);
		} else {
			if (long === 10) {
				if ((ano == 0) || (ano < 1900) || (ano > 2100)) {
					fecha = fecha.substr(0, 6);
				}
			}
		}
	}
	if (long >= 10) {
		fecha = fecha.substr(0, 10);
		dia = fecha.substr(0, 2);
		mes = fecha.substr(3, 2);
		ano = fecha.substr(6, 4);
		// Año no visiesto y es febrero y el dia es mayor a 28
		if ((ano % 4 != 0) && (mes == 02) && (dia > 28)) {
			fecha = fecha.substr(0, 2) + "/";
		}
		if (((mes == 04) || (mes == 06) || (mes == 09) || (mes == 11))
				&& (dia > 30)) {
			fecha = fecha.substr(0, 2) + "/";
		}
		// Si el día es mayor de 29 en febrero
		if((mes == 02) && (dia>29)) {
			fecha = fecha.substr(0, 2) + "/";
		}
	}
	return (fecha);
}

function nif(documento) {
    var valid = false;
    if (/^[0-9]{8}[A-Z]{1}$/.test(documento.toUpperCase())) {
        valid = true;
    }
    return valid;
}
function cif(documento) {
    var sum, num = [], controlDigit;
    for (var i = 0; i < 9; i++) {
        num[i] = parseInt(documento.charAt(i), 10);
    }
    // Algorithm for checking CIF codes
    sum = num[2] + num[4] + num[6];
    for (var count = 1; count < 8; count += 2) {
        var tmp = (2 * num[count]).toString(), secondDigit = tmp.charAt(1);
        sum += parseInt(tmp.charAt(0), 10) + (secondDigit === '' ? 0 : parseInt(secondDigit, 10));
    }
    // CIF test
    if (/^[ABCDEFGHJNPQRSUVW]{1}/.test(documento.toUpperCase())) {
        sum += '';
        controlDigit = 10 - parseInt(sum.charAt(sum.length - 1), 10);
        documento += controlDigit;
        return (num[8].toString() === String.fromCharCode(64 + controlDigit) || num[8].toString() === documento
                .charAt(documento.length - 1));
    }
    return false;
}

function comprobarDocumento(campo, valor) {
    var documento, validacion;
    documento = valor;
    if ((cif(documento)) || (nif(documento))) {
    	$('#'+campo).removeClass('has-error');
    	$('#'+campo).addClass('has-success');
        validacion = true;
    } else {
    	$('#'+campo).removeClass('has-success');
    	$('#'+campo).addClass('has-error');
        validacion = false;
    }
    return validacion;
}


/* Función para comprobar el foco de un input */
function focusCampo(campo) {
	/* Comprobamos si el campo es una fecha*/
	if($('#'+campo).hasClass('numero')) {
		$('#'+campo).attr('onKeypress', 'return comprobarCampo(this.id)')
	}
	if($('#'+campo).hasClass('importe')) {
		$('#'+campo).attr('onKeypress', 'return comprobarCampo(this.id)')
	}
	if($('#'+campo).hasClass('fecha')) {
		$('#'+campo).attr('onKeyup', 'this.value=comprobarFecha(this.value);')
	}
}