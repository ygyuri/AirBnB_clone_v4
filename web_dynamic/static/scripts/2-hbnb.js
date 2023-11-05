$(() => {
    $.get('http://0.0.0.0:5001/api/v1/status/', data => {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
    const listCheck = {};
    $('li input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        listCheck[$(this).data('id')] = $(this).data('name');
      } else {
        delete listCheck[$(this).data('id')];
      }
      const values = Object.values(listCheck);
      const list = values.join(', ');
      const short = list.slice(0, 30);
      $('.amenities h4').html(short.length > 0 ? `<em>${short}</em>` : '&nbsp;');
    });
  });
