// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require_directory ../../../vendor/assets/javascripts
//= require_self

// ----------- METODOS ----------------
function fecharPopUpContato() {
    $('#contatopopup').dialog('close');
    $('.error').remove();
}

 function abrirPopUp() {
    var form = document.getElementById("form1");
    form.reset();
    var texts = document.getElementsByClassName('validation_erro');
    for (var i = 0; i < texts.length; i++) {
        texts[i].style.display = 'none';
    }
    $('#contatopopup').dialog("open");
}

function abrirBarra(msg) {
    $("#msgup").bar({
        color: '#1E90FF',
        background_color: '#FFFFFF',
        removebutton: false,
        message: msg,
        time: 4000
    });
    document.getElementById("msgup").click();
}

// Chamada Ajax para servico de EnvioEmail
function callAjax() {
    // Sistema de Spinner Carregamento
    fecharPopUpContato();
    $('<img src="http://img.pandox.com.br/icon/287.gif" id="loadingIcon" width="32" height="32" />').insertAfter('#buttonSubmit');
    $('#buttonSubmit').remove();

    var nome = $("#nomeTxt").val();
    var email = $("#emailTxt").val();
    var telefone = $("#telefoneTxt").val();
    var mensagem = $("#msgTxt").val();

    // Ajax
    $.ajax({
        // Cria parametros para WebMethod
        type: "POST",
        url: "EmailService.asmx/HelloWorld",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{nome:'" + nome + "', email:'" + email + "', telefone:'" + telefone + "', mensagem:'" + mensagem + "'}",
        success: function (msg) {
            abrirBarra(msg.d);
            $('<input type="button" value="Enviar" id="buttonSubmit" class="buttonSubmit" onclick="enviarEmail();" />').insertAfter('#loadingIcon');
            $('#loadingIcon').remove();
            $('#form1').each(function () {
                this.reset();
            }); 
        },
        error: AjaxFailed
    });
    function AjaxFailed(result) {
        alert(result.status + ' ' + result.statusText);
    }
}

function enviarEmail() {
    $('#form1').submit();
}



// onBodyLoad
$(function () {
    /*//Validacao do FORM
    var validator = $("#form1").validate({
        errorElement: "div",
        highlight: function (element) {
            $(element).removeClass("error");
        },
        rules: {
            nomeTxt: "required",
            emailTxt: { required: true, email: true }, 
            msgTxt: "required"
        },
        messages: {
            nomeTxt: "Precisamos saber seu nome.",
            emailTxt: "Informe seu e-mail corretamente.",
            msgTxt: "Escreva sua mensagem."
        },
        submitHandler: function () {
            callAjax();
        }
    });

    // PopUp de contato
    $('#contatopopup').dialog({
        title: 'Contato',
        resizable: false,
        autoOpen: false,
        width: 600,
        hide: "fadeOut",
        modal: true,
        buttons: {
            "Cancelar": function () { validator.resetForm(); fecharPopUpContato(); },
            "Enviar": function () { enviarEmail() }
        }
    });
    $(".ui-widget-overlay").live("click", function () { validator.resetForm(); fecharPopUpContato(); });
*/
    // Sistema de Noticias
    $('#js-news').ticker({
        titleText: '',
        controls: false
    });

    // Estilo nos FORMs
    $(":input").hover(function () {
        $(this).addClass("input_overEvent");
    }, function () {
        $(this).removeClass("input_overEvent");
    });

    $("#buttonSubmit").hover(function () {
        $(this).addClass("btnOverEvent");
        $(this).removeClass("input_overEvent");
    }, function () {
        $(this).removeClass("btnOverEvent");
    });

    $(":input").focusin(function () {
        $(this).addClass("input_onFocus");
    });
    $(":input").focusout(function () {
        $(this).removeClass("input_onFocus");
    });
});



