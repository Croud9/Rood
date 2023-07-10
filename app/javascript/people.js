document.addEventListener("turbo:load", function() { 
  if (document.getElementById("table_of_people") !== null) {
    $('#family').change(get_family);
    
    function get_family() {
      if ($('#family:selected').text() != "Выберите") {
        $.ajax({
          url: "get_family",
          dataType: "html",
          data: { id: $("#family option:selected").val() },
          success: function(data) {
            window.Turbo.renderStreamMessage(data);
          }
        });
      };
    };

  };
});
