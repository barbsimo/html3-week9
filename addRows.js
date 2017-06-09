/*  Adds hive status to database. B Simonsen */
var helloTemplate = Handlebars.compile($('#helloTemplate').html());
$('#hello-button').on('click',showHello);
function showHello() {
  var data = {name: 'world'};
  var html = helloTemplate(data);
  $('#main').html(html);
}

(function() {
'use strict';
var tableTemplate = Handlebars.compile( $('#tableTemplate').html() );
var BASE_URL = 'https://pacific-meadow-64112.herokuapp.com/data-api/';
var collection = 'bsimonsen'; //Use your own!

var hives = [];
var saveDelId;

getHives();
$('#status').on( 'click', newStatus );
$('#beeHives').on('click','.delete',confirmAndDelete);

function getHives( evt ) {
  getAllHives();
}
  
function getAllHives() {
  $.ajax( BASE_URL + collection,
    {
        method: 'GET',
        success: loadHives,
        error: reportAjaxError
    } );
}
  
function loadHives( response ) {
  hives = response; 
  showHives();
}
  
function showHives () {
    var tr, td, beeHive, editBtn, deleteBtn;
    var i, len, button, oneHive;
    $('#beeHives').empty();
    //getHives();
    //hives.forEach( function (beeHive) {
    for (i = 0, len = hives.length; i<len; ++i) {
        oneHive = hives[i];
      
        tr = $( '<tr> data-id="' + oneHive._id + '">' );
        console.log('id='+oneHive._id);
        td = $( '<td>' );
        td.text( oneHive.name );
        tr.append( td );
      
        td = $( '<td>' );
        td.text(oneHive.age );
        tr.append( td );
      
        td = $( '<td>' );
        td.text(oneHive.notes );
        tr.append( td );  
      
        td = $( '<td>' );
        button = $( '<button type="button" class="edit">' );
        button.text( 'Edit' );
        td.append( button );

        button = $( '<button type="button" class="delete">' );
        button.text( 'Delete' );
        td.append( button );
        tr.append( td );
        //button.on( 'click', callDelete(delId) );
        $('#beeHives').append( tr );
    } ;

    $('#hiveList').show();
    $('#addStatus').hide();
}
  
 function idOfEventHive( evt ) {
    var btn = evt.target;
    var tr = $(btn).closest( 'tr' );
    var id = tr.attr( 'data-id' );
    console.log('idofevent='+id);
    return id;
} 
  
function confirmAndDelete( evt ){
  var delId = idOfEventHive(evt);
  console.log('in confirmAndDelete id='+delId);
  deleteHive(delId);
  getHives();      
}

function deleteHive(delId) {
  $.ajax( BASE_URL + collection + '/' + delId,
    {
        method: 'DELETE',
        success: console.log('Deleted one'),
        error: reportAjaxError
    } );
}
  

function newStatus( ) {
    $('#hive').val( '' );
    $('#dateChecked').val( '' );
    $('#notes').val('');

    $('#submit').one( 'click', addHive );
    $('#cancel').one( 'click', showHives );

    $('#hiveList').hide();
    $('#addStatus').show();

    function addHive( evt ) {
        evt.preventDefault();
        var name = $('#hive').val();
        var age = $('#dateChecked').val();
        var notes = $('#notes').val();
        var oneHive = {
          name: name,
          age: age,
          notes: notes
        } ;
        addRow(oneHive);
        evt.preventDefault( );
        getHives();
    }
}
  
function addRow(oneHive) {
  $.ajax( BASE_URL + collection,
                {
                    method: 'POST',
                    data: oneHive,
                    success: console.log('loaded one'),
                    error: reportAjaxError
                } );
    function listHives( data ) {
      if (data.error) {
        onFailure (data.error);
      } else {
        onSuccess(data);
      }
    }
    function reportAjaxError(jqXHR, textStatus,errorThrown) {
      reportAjaxError(onFailure,jqXHR,textStatus,errorThrown) ;
    }
} 



function reportAjaxError( jqXHR, textStatus, errorThrown ) {
    var msg = 'AJAX error.\n' +
        'Status Code: ' + jqXHR.status + '\n' +
        'Status: ' + textStatus;
    if ( errorThrown ) {
        msg += '\n' + 'Error thrown: ' + errorThrown;
    }
    if ( jqXHR.responseText ) {
        msg += '\n' + 'Response text: ' + jqXHR.responseText;
    }
    console.log('error=' + msg);
}
})();

