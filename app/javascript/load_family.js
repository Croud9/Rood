document.addEventListener("turbo:load", function() { 
  if (document.getElementById("person_family") !== null) {
    $('#person_family').change(get_family);
    disabled_select()
    function get_family() {
      if ( disabled_select() == false ) {
        $.ajax({
          url: "/get_family",
          data:  "id=" + $("#person_family option:selected").val(),
          success: null,
          dataType: "script",
        });
      };
    };

    function disabled_select() {
      if ($('#person_family').val() == "") {
        $("#person_father").prop('disabled', true);
        $("#person_mother").prop('disabled', true);
        $("#person_married_on").prop('disabled', true);
        return true
      } else {
        $("#person_father").prop('disabled', false);
        $("#person_mother").prop('disabled', false);
        $("#person_married_on").prop('disabled', false);
        return false
      }
    };

  };
});
