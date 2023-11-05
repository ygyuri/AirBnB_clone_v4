$(() => {
    const checkedAmenities = {};
    const checkedStates = {};
    const checkedCities = {};
    const checkedLocations = {};
    const users = {};

    $.get('http://0.0.0.0:5001/api/v1/status/', data => {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });

    $.getJSON('http://0.0.0.0:5001/api/v1/users', data => data.forEach(user => users[user.id] = `${user.first_name} ${user.last_name}`));

    $.ajax({
      method: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: '{}',
      dataType: 'json',
      contentType: 'application/json',
      success: function (places) {
        setPlaces(places)
      },
    });

    $('.locations > .popover > ul > li > input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        checkedStates[$(this).data('id')] = $(this).data('name');
        checkedLocations[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedStates[$(this).data('id')];
        delete checkedLocations[$(this).data('id')];
      }
      const locations = Object.values(checkedLocations);
      const locationsList = locations.join(', ').slice(0, 30);
      $('.locations h4').html(locationsList.length > 0 ? `<em>${locationsList}</em>` : '&nbsp;');
    });

    $('.locations > .popover > ul > li > ul > li > input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        checkedCities[$(this).data('id')] = $(this).data('name');
        checkedLocations[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedCities[$(this).data('id')];
        delete checkedLocations[$(this).data('id')];
      }
      const locations = Object.values(checkedLocations);
      const locationsList = locations.join(', ').slice(0, 30);
      $('.locations h4').html(locationsList.length > 0 ? `<em>${locationsList}</em>` : '&nbsp;');
    });

    $('.amenities > .popover > ul > li > input[type=checkbox]').on('change', function () {
      if ($(this).is(':checked')) {
        checkedAmenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedAmenities[$(this).data('id')];
      }
      const amenities = Object.values(checkedAmenities);
      const amenitiesList = amenities.join(', ').slice(0, 30);
      $('.amenities h4').html(amenitiesList.length > 0 ? `<em>${amenitiesList}</em>` : '&nbsp;');
    });

    $('button').on('click', e => {
      e.preventDefault();
      const payload = {
        amenities: Object.keys(checkedAmenities),
        states: Object.keys(checkedStates),
        cities: Object.keys(checkedCities),
      };
      $('article').remove();
      $.ajax({
        method: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        data: JSON.stringify(payload),
        dataType: 'json',
        contentType: 'application/json',
        success: function (places) {
          setPlaces(places)
        },
      });
    });

    $(document).on('click', 'span.toggle', function (e) {
      const ul = $(this).parent().parent().children('div').children('ul').last();
      if ($(this).text() === 'Show') {
        $(this).text('Hide');
        $.get(`http://0.0.0.0:5001/api/v1/places/${$(this).data('id')}/reviews`, data => {
            const len = Object.keys(data).length;
            $(this).parent().children('span.num').text(`${len} Review${len !== 1 ? 's' : ''}`);
            ul.empty();
            data.forEach(review => {
              const datestr = (new Date(Date.parse(review.updated_at))).toDateString();
              const html = `<li>
                <h3>From ${users[review.user_id]} the ${datestr}</h3>
                <p>${review.text}</p>
              </li>`
              ul.append(html);
              ul.show();
            });
          });
      } else {
        $(this).parent().children('span.num').text('Reviews');
        $(this).text('Show');
        ul.hide();
      }
    });

    const setPlaces = places => {
      places.forEach(place => {
        const s = place.max_guest !== 1 ? 's' : '';
        const s2 = place.number_rooms !== 1 ? 's' : '';
        const s3 = place.number_bathrooms !== 1 ? 's' : '';
        const html = `<article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${s}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${s2}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${s3}</div>
          </div>
          <div class="user"><strong>Owner:</strong> ${users[place.user_id]}</div>
          <div class="description">${place.description}</div>
          <div class="reviews">
            <h2><span class="num">Reviews</span> <span class="toggle" data-id="${place.id}">Show</span></h2>
            <div class="reviews_pad">
              <ul></ul>
            </div>
          </div>
        </article>`;
        $('section.places').append(html);
      });
    };
  });
