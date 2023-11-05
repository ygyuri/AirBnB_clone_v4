$(() => {
    const listCheck = {};
    $('li input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        listCheck[$(this).data('id')] = $(this).data('name');
      } else {
        delete listCheck[$(this).data('id')];
      }
      const values = Object.values(listCheck);
      const list = values.join(', ');
      const short = list.slice(0, 34);
      $('.amenities h4').html(short.length > 0 ? `<em>${short}</em>` : '&nbsp;');
    });
});
